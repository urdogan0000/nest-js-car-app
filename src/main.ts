import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//nst { countAllRequests } = require("./monitoring");
//const tracer = require('./tracer')
//const cookieSession=require('cookie-session')


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //await tracer.start();

  //app.use(countAllRequests());
 
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true
  }));
  await app.listen(3001);
  
  
}
bootstrap();
