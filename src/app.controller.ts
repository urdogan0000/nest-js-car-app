import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, RoleGuard, Roles } from 'nest-keycloak-connect';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles({ roles: ['admin', 'dev','qa'] })
  getHello(): string {
    return this.appService.getHello();
  }
}
