import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { jwtPayload, LoginResponse, RegisterResponse } from './types';
import { LoginDto, RegisterDto } from './dto';
import { BadRequestException, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { User } from 'src/user/user.type';
import { GraphqlAuthGurad } from './graphql.auth.guard';

@UseFilters(GraphQLErrorFilter)
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
                message:"Password and confirm passoword are not the same.",
                validator:{
                    confirmPassword: 'Password and confirm passoword are not the same.'
                }
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
        @Args('loginInput') loginDto:LoginDto,
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
    @UseGuards(GraphqlAuthGurad)
    @Query(()=>jwtPayload)
    async authCheck(@Context() context:{req:Request,res:Response}){
        try{
            const userPayload=context.req.user
            return userPayload
        }catch(err){
            throw new UnauthorizedException('Login again !',err)
        }
    }
}
