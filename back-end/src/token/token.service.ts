import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class TokenService {
    constructor(private configService:ConfigService, private jwtService:JwtService){}
    extractToken(connectionParams:any):string|null{
        return connectionParams?.token||null
    }
    //todo
    validateToken(token:string){
        const refreshTokenSecret=this.configService.get<string>('REFRESH_TOKEN_SECRET')
        try{
            return this.jwtService.verify(token,{secret:refreshTokenSecret})
        }catch(err){
            return null
        }
    }
}
