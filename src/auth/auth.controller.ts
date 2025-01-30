import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthResponseDTO } from './dto/auth-response.dto';

import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: AuthLoginDTO })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() body: AuthLoginDTO) {
    try {
      const { email, password } = body;
      return await this.authService.login(email, password);
    } catch (error) {
      throw new HttpException(
        `Failed to login: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: AuthRegisterDTO })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDTO,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() body: AuthRegisterDTO) {
    try {
      const userExists = await this.userService.findOne({ email: body.email });
      if (userExists) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      return await this.authService.register(body);
    } catch (error) {
      throw new HttpException(
        `Failed to register: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
