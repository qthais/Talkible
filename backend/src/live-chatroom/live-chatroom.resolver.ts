import { Args, Context, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { LiveChatroomService } from './live-chatroom.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.type';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { GraphqlAuthGurad } from 'src/auth/graphql.auth.guard';
import { Request } from 'express';

@Resolver()
export class LiveChatroomResolver {
    private pubSub:PubSub
    constructor(
        private readonly liveChatroomService:LiveChatroomService,
        private readonly userService:UserService,
    ){
        this.pubSub=new PubSub()
    }
    @Subscription(()=>[User],{
        nullable:true,
        resolve:(value)=>{
            return value.liveUsers
        },
        filter:(payload,variables)=>{
            return payload.chatroomId===variables.chatroomId
        }
    })
    liveUsersInChatroom(@Args('chatroomId') chatroomId:number){
        return this.pubSub.asyncIterableIterator(`liveUsersInChatroom.${chatroomId}`)
    }

    @UseFilters(GraphQLErrorFilter)
    @UseGuards(GraphqlAuthGurad)
    @Mutation(()=>Boolean)
    async enterChatroom(
        @Args('chatroomId') chatroomId:number,
        @Context() context:{req:Request},
    ){
        try{
            const user=await this.userService.getUser(context.req.user.sub)
            await this.liveChatroomService.addLiveUserToChatroom(chatroomId,user)
            const liveUsers=await this.liveChatroomService.getLiveUsersForChatroom(chatroomId)
            await this.pubSub.publish(`liveUsersInChatroom.${chatroomId}`,{
                liveUsers,
                chatroomId
            })
            return true
        }catch(err){
            console.log(err)
            return false
        }
    }
    @UseFilters(GraphQLErrorFilter)
    @UseGuards(GraphqlAuthGurad)
    @Mutation(()=>Boolean)
    async leaveChatroom(
        @Args('chatroomId') chatroomId:number,
        @Context() context:{req:Request},
    ){
        try{
            const user=await this.userService.getUser(context.req.user.sub)
            await this.liveChatroomService.removeLiveUserFromChatroom(chatroomId,user)
            const liveUsers=await this.liveChatroomService.getLiveUsersForChatroom(chatroomId)
            await this.pubSub.publish(`liveUsersInChatroom.${chatroomId}`,{
                liveUsers,
                chatroomId
            })
            return true
        }catch(err){
            console.log(err)
            return false
        }
    }
}

