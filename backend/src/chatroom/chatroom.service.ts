import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream } from 'fs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async getChatroom(id: number) {
    return this.prisma.chatroom.findUnique({
      where: {
        id: id,
      },
      include:{
        users:true
      }
    });
  }
  async createChatroom(name: string, sub: number) {
    const existChatroom = await this.prisma.chatroom.findFirst({
      where: {
        name,
      },
    });
    if (existChatroom) {
      throw new BadRequestException({ name: 'Chatroom already exists' });
    }
    return this.prisma.chatroom.create({
      data: {
        name,
        users: {
          connect: {
            id: sub,
          },
        },
      },
    });
  }
  async addUsersToChatroom(chatroomId: number, userIds: number[]) {
    const existChatroom = await this.prisma.chatroom.findFirst({
      where: {
        id: chatroomId,
      },
    });
    if (!existChatroom) {
      throw new BadRequestException({ name: 'Chatroom does not exists' });
    }
    const updateResult = await this.prisma.chatroom.update({
      where: {
        id: chatroomId,
      },
      data: {
        users: {
          connect: userIds.map((id) => ({ id })),
        },
      },
      include: {
        users: true, //return users in response
      },
    });
    return updateResult;
  }
  async getChatroomForUser(userId: number) {
    return this.prisma.chatroom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        messages: {
          include: {
            user: true,
          },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
  async sendMessage(
    chatroomId: number,
    message: string,
    userId: number,
    imagePath: string,
    systemMessage:boolean
  ) {
    return await this.prisma.message.create({
      data: {
        content: message,
        imageUrl: imagePath,
        chatroomId,
        userId,
        systemMessage
      },
      include: {
        chatroom: {
          include: {
            users: true,
          },
        },
        user: true,
      },
    });
  }
  async saveImage(image: {
    createReadStream: () => any;
    filename: string;
    mimetype: string;
  }) {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(image.mimetype)) {
      throw new BadRequestException({ image: 'Invalid image type!' });
    }
    const imageName = `${Date.now()}-${image.filename}`;
    const imagePath = `${this.configService.get('IMAGE_PATH')}/${imageName}`;
    const stream = image.createReadStream();
    const outputPath = `public${imagePath}`;
    const writeStream = createWriteStream(outputPath);
    stream.pipe(writeStream);
    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });
    return imagePath;
  }
  async getMessagesForChatroom(chatroomId: number) {
    return await this.prisma.message.findMany({
      where: { chatroomId: chatroomId },
      include: {
        chatroom: {
          include: {
            users: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
        user: true,
      },
    });
  }
  async deleteChatroom(chatroomId: number) {
    return this.prisma.chatroom.delete({
      where: {
        id: chatroomId,
      },
    });
  }
  async leaveGroup(chatroomId: number, userId: number) {
    const updatedChatroom = await this.prisma.chatroom.update({
      where: {
        id: chatroomId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });
    if (updatedChatroom.users.length === 0) {
      await this.prisma.chatroom.delete({ where: { id: chatroomId } });
      console.log(`Chatroom ${chatroomId} deleted as it has no users.`);
    }
    return updatedChatroom
  }
}
