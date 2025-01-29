import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDTO {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
