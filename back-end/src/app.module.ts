import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ChatroomModule } from './chatroom/chatroom.module';
import { LiveChatroomModule } from './live-chatroom/live-chatroom.module';
import { RedisPubSubModule } from './redis-pubsub.module';
// const pubSub = new RedisPubSub({
//   connection: {
//     host: process.env.REDIS_HOST || 'localhost',
//     port: parseInt(process.env.REDIS_PORT || '6379', 10),
//     retryStrategy: (times) => {
//       return Math.min(times * 50, 2000);
//     },
//   },
// });
@Module({
  imports: [
    RedisPubSubModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'public'),
        }),
        ConfigModule
      ],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (
      ) => {
        return {
          installSubscriptionHandlers: true,
          playground: false,
          debug:true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          subscriptions: {
            'graphql-ws': {
              // onConnect: (context: Context<any,any>) => {
              //   const { connectionParams, extra } = context; // ✅ Correct way to extract params

              //   const token = tokenService.extractToken(connectionParams);
              //   if (!token) {
              //     throw new Error('Token not provided');
              //   }

              //   const user = tokenService.validateToken(token);
              //   if (!user) {
              //     throw new Error('Invalid token');
              //   }

              //   extra.user = user; // ✅ Store user inside `extra` for access in resolvers
              // },
            },
          },
          context: ({req,res}) => {
            return { req,res }; // ✅ Now you can access `user` inside resolvers
          },
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ChatroomModule,
    LiveChatroomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
