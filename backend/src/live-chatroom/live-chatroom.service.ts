import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import Redis from 'ioredis';

@Injectable()
export class LiveChatroomService {
    private redisClient:Redis;
    constructor(){
        this.redisClient=new Redis({
            host:process.env.REDIS_HOST||'localhost',
            port:parseInt(process.env.REDIS_PORT||'6379',10)
        })
    }
    async addLiveUserToChatroom(chatroomId:number,user:User):Promise<void>{
        const existingLiveUsers=await this.getLiveUsersForChatroom(chatroomId)
        const existingUser=existingLiveUsers.find((liveUser)=>liveUser.id===user.id)
        if(existingUser){
            return
        }
        await this.redisClient.sadd(
            `liveUsers:chatroom:${chatroomId}`,
            JSON.stringify(user)
        );
    }
    async removeLiveUserFromChatroom(
        chatroomId:number,
        user:User
    ):Promise<void>{
        try{
        const res=await this.redisClient.srem(`liveUsers:chatroom:${chatroomId}`,JSON.stringify(user))
        }catch(err){
            console.log('removeLiveUserFromChatroom error',err)
        }

    }
    async getLiveUsersForChatroom(chatroomId:number):Promise<User[]>{
        try{
            const users= await this.redisClient.smembers(`liveUsers:chatroom:${chatroomId}`)
            return users.map((user)=>JSON.parse(user))
        }catch(err){
            console.log(' Get live users error',err)
        }
    }
}
