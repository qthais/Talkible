import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from './user.type';
import { join } from 'path';
import * as fs from 'fs'

@Injectable()
export class UserService {
    constructor(
        private readonly prisma:PrismaService
    ){}
    async updateProfile(userId:number, fullname:string, avatarUrl:string):Promise<User>{
        if(avatarUrl){
            const oldUser= await this.prisma.user.findUnique({
                where:{id:userId}
            })
            const updatedUser= await this.prisma.user.update({
                where:{id:userId},
                data:{
                    fullname,
                    avatarUrl
                }
            })
            //delete old avatar of user and replace
            if(oldUser.avatarUrl){
                const imageName=oldUser.avatarUrl.split('/').pop()
                const imagePath=join(__dirname,'..','..','publics','images',imageName)
                if(fs.existsSync(imagePath)){
                    fs.unlinkSync(imagePath)
                }
            }
            return updatedUser
        }
        return await this.prisma.user.update({
            where:{id:userId},
            data:{
                fullname,
            }
        })
    }
    async searchUsers(fullname:string, userId:number){
        return this.prisma.user.findMany({
            where:{
                fullname:{
                    contains:fullname
                },
                id:{
                    not:userId
                }
            },
        })
    }
    async getUserByIds(ids:number[]){
        return this.prisma.user.findMany({
            where: {
                id: {
                    in: ids, 
                },
            },
        });
    }
    async getUsersOfChatroom(chatroomId:number){
        return this.prisma.user.findMany({
            where:{
                chatrooms:{
                    some:{
                        id:chatroomId
                    }
                }
            }
        })
    }
    async getUser(userId:number){
        return this.prisma.user.findUnique({
            where:{
                id:userId
            },include:{
                chatrooms:true
            }
        })
    }
}
