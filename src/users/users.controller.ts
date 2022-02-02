import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')

export class UsersController {
  constructor(
    private readonly UserService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /*
  @Get('/whoami')
  whoAmI(@Session() session:any){
    return this.UserService.getUser(session.userId)

  }
  
*/


@Get('/login')
@Redirect('',301)
@Unprotected()
login(){
  this.authService.getUrlLogin()
}

  @Get('/whoami')
  @Roles({ roles: ['admin', 'customer'] })
  whoAmI() {
    return 'test';
  }


  @Post('/signup')
  async createUser(
    @Body() createUserdto: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(createUserdto);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;

  }
 

  @Post('/signin')
  async signin(@Body() createUserdto: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(createUserdto);
    session.userId = user.id;
    return user;
  }

  @Get('/')
  getUsers() {
    return this.UserService.getAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.UserService.getUser(id);
  }
}
