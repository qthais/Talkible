import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse, RegisterResponse } from './types';
import { LoginDto, RegisterDto } from './dto';
import { BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService:AuthService
    ){}
    @Query(()=>String)
    async hello(){
        return 'hola'
    }
    @Mutation(()=>RegisterResponse)
    async register(
        @Args('registerInput') registerDto:RegisterDto,
        @Context() context:{res:Response}
    ){
        if(registerDto.password!==registerDto.confirmPassword){
            throw new BadRequestException({
                confirmedPassword: 'Password and confirm passoword are not the same.'
            })
        }
        const {user}= await this.authService.register(
            registerDto,
            context.res,
        )
        return {user}
    }

    @Mutation(()=>LoginResponse)
    async login(
        @Args('registerInput') loginDto:LoginDto,
        @Context() context:{res:Response}
    ){
        return this.authService.login(loginDto,context.res)
    }

    @Mutation(()=>String)
    async logout(@Context() context:{res:Response}){
        return this.authService.logout(context.res)
    }

    @Mutation(()=>String)
    async refreshToken(@Context() context:{req:Request,res:Response}){
        try{
            return this.authService.refreshToken(context.req,context.res)
        }catch(err){
            throw new BadRequestException(err.message)
        }
    }
}
