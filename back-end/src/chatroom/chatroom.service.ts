import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatroomService {
    constructor(
        private readonly prisma:PrismaService,
        private readonly configService:ConfigService,
    ){}
    async getChatroom(id:string){
        return this.prisma.chatroom.findUnique({
            where:{
                id:parseInt(id)
            }
        })
    }
    async createChatroom(name:string,sub:number){
        const existChatroom= await this.prisma.chatroom.findFirst({
            where:{
                name
            }
        })
        if(existChatroom){
            throw new BadRequestException({name:'Chatroom already exists'})
        }
        return this.prisma.chatroom.create({
            data:{
                name,
                users:{
                    connect:{
                        id:sub
                    }
                }
            }
        })
    }
    async addUsersToChatroom(chatroomId:number,userIds:number[]){
        const existChatroom= await this.prisma.chatroom.findFirst({
            where:{
                id:chatroomId
            }
        })
        if(!existChatroom){
            throw new BadRequestException({name:'Chatroom does not exists'})
        }
        const updateResult= await this.prisma.chatroom.update({
            where:{
                id:chatroomId
            },
            data:{
                users:{
                    connect:userIds.map((id)=>({id}))
                }
            },
            include:{
                users:true //return users in response
            }
        })
        return updateResult
    }
    async getChatroomForUser(userId:number){
        return this.prisma.chatroom.findMany({
            where:{
                users:{
                    some:{
                        id:userId
                    }
                }
            },
            include:{
                users:{
                    orderBy:{
                        createdAt:'desc'
                    }
                },
                messages:{
                    take:1,
                    orderBy:{
                        createdAt:'desc'
                    }
                }
            }
        })
    }
    async sendMessage(
        chatroomId:number,
        message:string,
        userId:number,
        imagePath:string,
    ){
        await this.prisma.message.create({
            data:{
                content:message,
                imageUrl:imagePath,
                chatroomId,
                userId,
            },
            include:{
                chatroom:{
                    include:{
                        users:true
                    }
                },
                user:true
            }
        })
    }
    async saveImage(image:{
        createReadStream:()=>any;
        filename:string;
        mimetype:string
    }){
        const validImageTypes=['image/jpeg','image/png','image/gif']
        if(!validImageTypes.includes(image.mimetype)){
            throw new BadRequestException({image:'Invalid image type!'})
        }
        const imageName=`${Date.now()}-${image.filename}`;
        const imagePath=`${this.configService.get('IMAGE_PATH')}/${imageName}`
        const stream=image.createReadStream()
        const outputPath=`public${imagePath}`
        const writeStream=createWriteStream(outputPath)
        stream.pipe(writeStream)
        await new Promise((resolve,reject)=>{
            stream.on('end',resolve)
            stream.on('error',reject)
        })
        return imagePath
    }
}
