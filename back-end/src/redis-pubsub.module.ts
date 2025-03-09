import { Global, Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Global() // 👈 Makes this module available globally
@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        return new RedisPubSub({
          connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            retryStrategy: (times) => Math.min(times * 50, 2000),
          },
        });
      },
    },
  ],
  exports: ['PUB_SUB'],
})
export class RedisPubSubModule {}
