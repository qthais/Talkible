import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/user/user.type';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found!');
    }
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token: ',err.message);
    }
    const userExists= await this.prisma.user.findUnique({
        where:{id:payload.sub}
    })
    if(!userExists){
        throw new BadRequestException('User no longer exists')
    }
    const expiresIn=15000
    const expiration= Math.floor(Date.now()/1000)+expiresIn;
    const accessToken=this.jwtService.sign(
        {...payload,exp:expiration},
        {
            secret:this.configService.get<string>('ACCESS_TOKEN_SECRET')
        },
    )
    res.cookie('access_token',accessToken,{httpOnly:true})
    return accessToken
  }
  private async issueToken(user:User,res:Response){
    const payload={username:user.fullname, sub:user.id};
    const accessToken=this.jwtService.sign(
        payload,
        {
            secret:this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn:'150sec',
        }
    )
    const refreshToken=this.jwtService.sign(payload,{
        secret:this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn:'7d'
    })
    res.cookie('access_token',accessToken,{httpOnly:true})
    res.cookie('refresh_token',refreshToken,{
        httpOnly:true
    });
    return {user}
  }
  async validateUser(loginDto:LoginDto){
    const user=await this.prisma.user.findUnique({
        where:{email:loginDto.email}
    })
    if(user && bcrypt.compare(loginDto.password,user.password)){
        return user;
    }
    return null
  }
  async register(registerDto:RegisterDto,res:Response){
    const existingUser= await this.prisma.user.findUnique({
      where:{email:registerDto.email}
    })
    if(existingUser){
      throw new BadRequestException({email: "Email already in use!"})
    }
    const hashedPassword= await bcrypt.hash(registerDto.password,10)
    const user= await this.prisma.user.create({
      data:{
        fullname:registerDto.fullname,
        password:hashedPassword,
        email:registerDto.email
      }
    })
    return this.issueToken(user,res)
  }
  async login(loginDto:LoginDto,res:Response){
    const user= await this.validateUser(loginDto)
    if(!user){
      throw new BadRequestException({
        invalidCredentials:'Invalid credentials',
      })
    }
    return this.issueToken(user,res)
  }
  async logout(res:Response){
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    return 'Successfully logged out!'
  }

}
