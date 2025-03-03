import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomResolver } from './chatroom.resolver';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[UserModule],
  providers: [ChatroomService, ChatroomResolver,PrismaService,JwtService]
})
export class ChatroomModule {}
