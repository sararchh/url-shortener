import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Url } from './entities/url.entity';

@Injectable()
export class UrlsService {
  constructor(private prisma: PrismaService) {}

  async create(createUrlDto: CreateUrlDto) {
    return this.prisma.url.create({
      data: createUrlDto,
    });
  }

  async findAll(filter: { active?: boolean; userId?: number }) {
    let where = filter?.active ? { deletedAt: null } : {};
    if (filter?.userId) {
      where['userId'] = filter.userId;
    }
    return this.prisma.url.findMany({
      where,
    });
  }

  async findOne(shortUrl: string):Promise<Url | null> {
    return this.prisma.url.findFirst({
      where: { shortUrl },
    });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    return this.prisma.url.update({
      where: { id },
      data: { ...updateUrlDto, updatedAt: new Date() },
    });
  }

  async remove(id: number, updateUrlDto: UpdateUrlDto) {
    return this.prisma.url.update({
      where: { id },
      data: { ...updateUrlDto, deletedAt: new Date() },
    });
  }
}
