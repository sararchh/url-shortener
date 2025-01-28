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
    const where = filter?.active ? { deletedAt: null } : {};
    if (filter?.userId) {
      where['userId'] = filter.userId;
    }
    return this.prisma.url.findMany({
      where,
    });
  }

  async findOne(filters: {
    shortUrl?: string;
    userId?: number;
    id?: number;
    active?: boolean;
  }): Promise<Url | null> {
    const { shortUrl, userId, id, active } = filters;

    const where: any = {};
    if (shortUrl) {
      where.shortUrl = shortUrl;
    }
    if (userId) {
      where.userId = userId;
    }
    if (id) {
      where.id = id;
    }

    if (active) {
      where.deletedAt = null;
    }

    return this.prisma.url.findFirst({
      where,
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
