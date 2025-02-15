import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { TokenService } from './token/token.service';
const pubSub= new RedisPubSub({
  connection:{
    host:process.env.REDIS_HOST||'localhost',
    port: parseInt(process.env.REDIS_PORT||'6379',10),
    retryStrategy:(times)=>{
      return Math.min(times*50,2000)
    }
  }
})
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory:async(
        configService:ConfigService,
        tokenService:TokenService
      )=>{
        return{
          installSubscriptionHandlers:true,
          playground:true,
          autoSchemaFile:join(process.cwd(), 'src/schema.gql'),
          sortSchema:true,
          subscriptions:{
            'graphql-ws':{
              onConnect:(connectionParams)=>{
                const token= tokenService.extractToken(connectionParams);
                const user= tokenService.validateToken(token);
                if(!token){
                  throw new Error('Token not provided');
                }
                if(!user){
                  throw new Error('Invalid token')
                }
                return {user};
    
              }
            },
          },

        }
      }
    }),
    ConfigModule.forRoot({
      isGlobal:true
    }
    ),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
