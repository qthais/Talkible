import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomResolver } from './chatroom.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ChatroomService, ChatroomResolver,PrismaService]
})
export class ChatroomModule {}
