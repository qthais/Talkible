import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from './user.type';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma:PrismaService
    ){}
    async updateProfile(userId:number, fullname:string, avatarUrl:string):Promise<User>{
        if(avatarUrl){
            return await this.prisma.user.update({
                where:{id:userId},
                data:{
                    fullname,
                    avatarUrl
                }
            })
        }
        return await this.prisma.user.update({
            where:{id:userId},
            data:{
                fullname,
            }
        })
    }
}
