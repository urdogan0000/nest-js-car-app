import {
  BadRequestException,
  HttpException,
  HttpService,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './Repositories/user-repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: UserRepository,
  
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.repo.create(createUserDto);

    return this.repo.save(user);
  }

  async getAll() {
    const users = await this.repo.find();

    return users;
  }

  async getByEmail(email: string) {
    const user = await this.repo.findOne({ email });
    return user;
  }

  async getUser(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.repo.findOne(id);

    if (!user) {
      throw new HttpException('User not foud', 400);
    }

    return user;
  }
}
