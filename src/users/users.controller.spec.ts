import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const createdUser = { id: 1, email: 'test@example.com' };
    jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);

    const result = await controller.create(createUserDto);
    expect(() => usersService.create(createUserDto)).not.toThrow();
    expect(result).toEqual(createdUser);
  });

  it('should return all users', async () => {
    const users = [{ id: 1, email: 'test@example.com' }];
    jest.spyOn(usersService, 'findAll').mockResolvedValue(users);

    const result = await controller.findAll();
    expect(() => usersService.findAll()).not.toThrow();
    expect(result).toEqual(users);
  });

  it('should return a user by ID', async () => {
    const user = { id: 1, email: 'test@example.com' };
    jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

    const result = await controller.findOne('1');
    expect(() => usersService.findOne({ id: 1 }));
    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
    const updatedUser = { id: 1, email: 'updated@example.com' };
    jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);

    const result = await controller.update('1', updateUserDto);
    expect(() => usersService.update(1, updateUserDto));
    expect(result).toEqual(updatedUser);
  });

  it('should delete a user', async () => {
    const deletedUser = {
      id: 1,
      email: 'test@example.com',
      password: '',
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null,
    };
    jest.spyOn(usersService, 'remove').mockResolvedValue(deletedUser);

    const result = await controller.remove('1');
    expect(() => usersService.remove(1));
    expect(result).toEqual({ message: 'User with id 1 deleted successfully' });
  });
});
