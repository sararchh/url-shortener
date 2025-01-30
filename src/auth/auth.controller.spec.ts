import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '@/users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: JwtService, useValue: {} },
        { provide: PrismaService, useValue: {} },
        { provide: UsersService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService login method', async () => {
    const loginSpy = jest.spyOn(authService, 'login').mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      accessToken: 'token',
    });

    const result = await controller.login({
      email: 'test@example.com',
      password: 'password',
    });
    expect(loginSpy).toHaveBeenCalledWith('test@example.com', 'password');
    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      accessToken: 'token',
    });
  });

  it('should call AuthService register method', async () => {
    const registerSpy = jest.spyOn(authService, 'register').mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      accessToken: 'token',
    });

    const result = await controller.register({
      email: 'test@example.com',
      password: 'password',
    });
    expect(registerSpy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      accessToken: 'token',
    });
  });
});
