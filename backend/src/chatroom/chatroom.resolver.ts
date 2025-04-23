import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { ChatroomService } from './chatroom.service';
import { UserService } from 'src/user/user.service';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { GraphqlAuthGurad } from 'src/auth/graphql.auth.guard';
import { Chatroom, Message, UserActivity } from './chatroom.types';
import { Request } from 'express';
import { PubSub } from 'graphql-subscriptions';
import { User } from 'src/user/user.type';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
@Resolver()
export class ChatroomResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub:PubSub,
    private readonly chatroomService: ChatroomService,
    private readonly userService: UserService,
  ) {}
  @Subscription(()=>User,{
    nullable:true,
    resolve:(value)=>value.user,
    filter:(payload,variables)=>{
      return payload.leavingUserId !== variables.userId;
    }
  })
  userLeaveChatGroup(@Args('chatroomId') chatroomId:number,@Args('userId') userId:number){
    return this.pubSub.asyncIterableIterator(`userLeaveChatGroup.${chatroomId}`)
  }

  @Subscription(()=>[User],{
    nullable:true,
    resolve:(value)=>value.addedUsers,
    filter:(payload,variables)=>{
      return payload.chatroomUsersIds.includes(variables.userId);
    }
  })
  userIsAddedToChatGroup(@Args('userId') userId:number){
    return this.pubSub.asyncIterableIterator(`userIsAddedToChatGroup.${userId}`)
  }

  @Subscription(() => Message, {
    nullable: true,
    resolve: (value) => ({
      ...value.newMessage,
      createdAt: new Date(value.newMessage.createdAt), // ✅ convert back to Date object
    }),
  })
  newMessage(@Args('chatroomId') chatroomId: number) {
    return this.pubSub.asyncIterableIterator(`newMessage.${chatroomId}`);
  }
  @Subscription(() => User, {
    nullable: true,
    resolve: (value) => value.user,
    filter: (payload, variables) => {
      return variables.userId !== payload.typingUserId;
    },
  })
  userStartedTyping(@Args('chatroomId') chatroomId: number,@Args('userId') userId:number) {
    return this.pubSub.asyncIterableIterator(`userStartedTyping.${chatroomId}`);
  }

  @Subscription(() => User, {
    nullable: true,
    resolve: (value) => value.user,
    filter: (payload, variables) => {
      return variables.userId !== payload.typingUserId;
    },
  })
  userStoppedTyping(@Args('chatroomId') chatroomId: number, @Args('userId') userId:number) {
    return this.pubSub.asyncIterableIterator(`userStoppedTyping.${chatroomId}`);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGurad)
  @Mutation(() => User)
  async userStartedTypingMutation(
    @Args('chatroomId') chatroomId: number,
    @Context() context: { req: Request },
  ) {
    const user = await this.userService.getUser(context.req.user.sub);
    await this.pubSub.publish(`userStartedTyping.${chatroomId}`, {
      user,
      typingUserId: user.id,
    });
    return user;
  }
  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGurad)
  @Mutation(() => User)
  async userStoppedTypingMutation(
    @Args('chatroomId') chatroomId: number,
    @Context() context: { req: Request },
  ) {
    const user = await this.userService.getUser(context.req.user.sub);
    await this.pubSub.publish(`userStoppedTyping.${chatroomId}`, {
      user,
      typingUserId: user.id,
    });
    return user;
  }

  @UseGuards(GraphqlAuthGurad)
  @Mutation(() => Message)
  async sendMessage(
    @Args('chatroomId') chatroomId: number,
    @Args('content') content: string,
    @Args('systemMessage', { type: () => Boolean, nullable: true }) systemMessage: boolean = false,
    @Context() context: { req: Request },
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image: FileUpload,
  ) {
    let imagePath = null;
    let newMessage;
    try {
      if (image) {
        imagePath = await this.chatroomService.saveImage(image);
      }
      newMessage = await this.chatroomService.sendMessage(
        chatroomId,
        content,
        context.req.user.sub,
        imagePath,
        systemMessage,
      );
      const res = await this.pubSub.publish(`newMessage.${chatroomId}`, {
        newMessage,
      });
      return newMessage
    } catch (err) {
      console.log('err', err);
    }
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGurad)
  @Mutation(() => Chatroom)
  async createChatroom(
    @Args('name') name: string,
    @Context() context: { req: Request },
  ) {
    return this.chatroomService.createChatroom(name, context.req.user.sub);
  }
  @Mutation(() => Chatroom)
  async addUsersToChatroom(
    @Args('chatroomId') chatroomId: number,
    @Args('userIds', { type: () => [Number] }) userIds: number[],
  ) {
    const result = await this.chatroomService.addUsersToChatroom(chatroomId, userIds);

    const chatroom = await this.chatroomService.getChatroom(chatroomId);
    const chatroomUsersIds = chatroom.users.map(user => user.id); 
    const addedUsers=await this.userService.getUserByIds(userIds)
    for (const chatUserId of chatroomUsersIds) {
      await this.pubSub.publish(`userIsAddedToChatGroup.${chatUserId}`, {
        addedUsers,
        chatroomUsersIds, 
      });
    }
    return result;
  }


  @Query(() => Chatroom)
  async getChatroom(@Args('chatroomId') chatroomId: number) {
    return this.chatroomService.getChatroom(chatroomId);
  }
  
  @Query(() => [Chatroom])
  async getChatroomsForUser(@Args('userId') userId: number) {
    return this.chatroomService.getChatroomForUser(userId);
  }
  @Query(() => [Message])
  async getMessagesForChatroom(@Args('chatroomId') chatroomId: number) {
    return this.chatroomService.getMessagesForChatroom(chatroomId);
  }
  @Mutation(() => String)
  async deleteChatroom(@Args('chatroomId') chatroomId: number) {
    await this.chatroomService.deleteChatroom(chatroomId);
    return 'Chatroom deleted successfully!';
  }
  @UseGuards(GraphqlAuthGurad)
  @Mutation(()=>String)
  async leaveGroup(@Args('chatroomId') chatroomId: number,@Context() context: { req: Request }) {
    await this.chatroomService.leaveGroup(chatroomId,context.req.user.sub)
    const user = await this.userService.getUser(context.req.user.sub);
    await this.pubSub.publish(`userLeaveChatGroup.${chatroomId}`,{
      user,
      leavingUserId:context.req.user.sub
    })
    return 'Leave successfully!';
  }
}
