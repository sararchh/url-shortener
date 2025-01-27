import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

import * as bcrypt from 'bcrypt';
import { env } from 'node:process';

@Injectable()
export class AuthService {
  private EXPIRATION_TIME = '7 days';

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  createToken(user: User) {
    const token = this.jwtService.sign(
      {
        email: user.email,
      },
      {
        expiresIn: this.EXPIRATION_TIME,
        subject: String(user.id),
      },
    );

    return {
      id: user.id,
      email: user.email,
      accessToken: token,
    };
  }

  checkToken(token: string): { email: string; sub: string } {
    try {
      const data = this.jwtService.verify<{ email: string; sub: string }>(token);
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(`Email or password not valid.`);
    }

    let valid: boolean;
    try {
      valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new UnauthorizedException(`Email or password not valid.`);

      return this.createToken(user);
    } catch (error) {
      throw new UnauthorizedException(`Email or password not valid.${error}`);
    }
  }

  async register(data: AuthRegisterDTO) {
    if (!data.password) {
      throw new BadRequestException('Password is required');
    }

    const SALT_ROUNDS: number | undefined = env.SALT_ROUNDS
      ? parseInt(env.SALT_ROUNDS)
      : undefined;

    if (!SALT_ROUNDS) {
      throw new BadRequestException('Salt rounds not defined');
    }

    try {
      const hashedPassword: string = await bcrypt.hash(data.password, SALT_ROUNDS);
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
      return this.createToken(user);
    } catch (error) {
      throw new BadRequestException(`Error hashing password: ${error}`);
    }
  }
}
