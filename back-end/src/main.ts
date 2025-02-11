import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:'http://localhost:5173',
    credentials:true,
    allowedHeaders:[
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods:['GET','PUT','POST','DELETE','OPTIONS'],
  });
  app.use(cookieParser())
  app.use(graphqlUploadExpress({
    maxFieldSize:10000000000,
    maxFiles:1
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      transform:true,
      exceptionFactory:(errors)=>{
        const formattedErrors= errors.reduce((acc,err)=>{
          acc[err.property]=Object.values(err.constraints).join(
            ', ',
          )
          return acc;
        },{});
        throw new BadRequestException(formattedErrors)
      }
    })
  )

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
