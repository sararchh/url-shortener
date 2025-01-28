import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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
  async register(@Body() body: AuthRegisterDTO) {
    try {
      return await this.authService.register(body);
    } catch (error) {
      throw new HttpException(
        `Failed to register: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
