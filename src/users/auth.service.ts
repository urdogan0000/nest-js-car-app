import {
  BadRequestException,
  HttpService,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private keycloakLoginUri: string;
  private keycloakResponseType: string;
  private keycloakScope: string;
  private keycloakRedirectUri: string;
  private keycloakClientId: string;
  private keycloakClientSecret: string;
  private keycloakTokenUri: string;
  private keycloakLogoutUri: string;
  constructor(
    private usersService: UsersService,
    readonly _config: ConfigService,
    private readonly _http: HttpService,
  ) {
    this.keycloakLoginUri = _config.get('KEYCLOAK_LOGIN_URI');
    this.keycloakResponseType = _config.get('KEYCLOAK_RESPONSE_TYPE');
    this.keycloakScope = _config.get('KEYCLOAK_SCOPE');
    this.keycloakRedirectUri = _config.get('KEYCLOAK_REDIRECT_URI');
    this.keycloakClientId = _config.get('KEYCLOAK_CLIENT_ID');
    this.keycloakClientSecret = _config.get('KEYCLOAK_CLIENT_SECRET');
    this.keycloakTokenUri = this._config.get('KEYCLOAK_TOKEN_URI');
    this.keycloakLogoutUri = this._config.get('KEYCLOAK_LOGOUT_URI');
  }

  getUrlLogin(): any {
    return {
      url:
        `${this.keycloakLoginUri}` +
        `?client_id=${this.keycloakClientId}` +
        `&response_type=${this.keycloakResponseType}` +
        `&scope=${this.keycloakScope}` +
        `&redirect_uri=${this.keycloakRedirectUri}`,
    };
  }

  async signup(createUserdto: CreateUserDto) {
    const { email, password } = createUserdto;
    const userExist = await this.usersService.getByEmail(email);
    if (userExist) {
      throw new BadRequestException('user is exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      ...createUserdto,
      password: hashedPassword,
    });
    return user;
  }

  async signin(createUserdto: CreateUserDto) {
    const { email, password } = createUserdto;
    const userExist = await this.usersService.getByEmail(email);
    if (!userExist) {
      throw new NotFoundException('wrong credantials');
    }

    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (userExist && isPasswordMatch) {
      return userExist;
    } else {
      throw new BadRequestException('wrong credantials');
    }
  }
}
