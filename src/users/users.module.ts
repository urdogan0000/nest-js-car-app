import { HttpModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './inteceptors/current-user.interceptor';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  providers: [
    UsersService,
    AuthService,

    // { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
