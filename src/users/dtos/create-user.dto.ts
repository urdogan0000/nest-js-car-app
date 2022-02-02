import { IsEmail, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @MinLength(3)
  @MaxLength(10)
  @IsString()
  password: string;
}
