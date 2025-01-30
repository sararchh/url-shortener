import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

type UserWithoutPassword = Pick<User, 'id' | 'email'>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    return { id: user.id, email: user.email };
  }

  findAll(): Promise<UserWithoutPassword[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: false,
      },
    });
  }

  findOne(filters: { id?: number; email?: string }): Promise<UserWithoutPassword | null> {
    const { id, email } = filters;
    const where: { id?: number; email?: string } = {};
    if (id) {
      where['id'] = id;
    }

    if (email) {
      where['email'] = email;
    }

    return this.prisma.user.findFirst({
      where: { ...where },
      select: {
        id: true,
        email: true,
        password: false,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto, updatedAt: new Date() },
    });
    return { id: user.id, email: user.email };
  }

  remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
