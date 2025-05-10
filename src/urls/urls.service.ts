import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { IUrl } from './interface/url.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UrlsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUrlDto: CreateUrlDto, domain: string) {
    try {
      const createdUrl = await this.prisma.url.create({
        data: createUrlDto,
      });

      if (!createdUrl) {
        throw new NotFoundException('URL not created');
      }

      return { ...createdUrl, shortUrl: `${domain}/urls/${createdUrl.shortUrl}` };
    } catch (error) {
      throw new NotFoundException(`URL not created - ${error.message}`);
    }
  }

  async findAll(filter: { active?: boolean; userId?: number }) {
    try {
      const where = filter?.active ? { deletedAt: null } : {};
      if (filter?.userId) {
        where['userId'] = filter.userId;
      }
      return await this.prisma.url.findMany({ where });
    } catch (error) {
      throw new NotFoundException(`URLs not found - ${error.message}`);
    }
  }

  async findOne(filters: {
    shortUrl?: string;
    userId?: number;
    id?: number;
    active?: boolean;
  }): Promise<IUrl | null> {
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

    return await this.prisma.url.findFirst({ where });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    try {
      const urlUpdated = await this.prisma.url.update({
        where: { id },
        data: { ...updateUrlDto, updatedAt: new Date() },
      });

      if (!urlUpdated) {
        throw new NotFoundException(`URL with id ${id} not updated`);
      }

      return urlUpdated;
    } catch (error) {
      throw new NotFoundException(`URL with id ${id} not found - ${error.message}`);
    }
  }

  async remove(id: number, updateUrlDto: UpdateUrlDto) {
    try {
      await this.prisma.url.update({
        where: { id },
        data: { ...updateUrlDto, deletedAt: new Date() },
      });
      return { message: `URL with id ${id} deleted successfully` };
    } catch (error) {
      throw new NotFoundException(`URL with id ${id} not found - ${error.message}`);
    }
  }

  async validateAndGetUserId(authHeader?: string): Promise<number | null> {
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    const decodedToken = await this.jwtService.decode(token);
    return decodedToken ? parseInt(decodedToken.sub) : null;
  }

  async incrementClickCount(urlData: IUrl) {
    return this.update(urlData.id, {
      ...urlData,
      clickCount: (urlData.clickCount || 0) + 1,
    });
  }
}
