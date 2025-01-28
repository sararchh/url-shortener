import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Req,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { UrlsService } from './urls.service';
import { UpdateUrlDto } from './dto/update-url.dto';
import { generateShortUrl } from 'src/utils/generate-short-url.util';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller('urls')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async create(
    @Body('url') url: string,
    @Headers('authorization') authHeader: string,
    @Req() req: Request,
  ) {
    try {
      const shortUrl = generateShortUrl();
      const domain = req['protocol'] + '://' + req.headers['host'];

      let userId: number | null = null;

      if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decodedToken = this.jwtService.decode(token);
        userId = decodedToken ? parseInt(decodedToken.sub) : null;
      }

      const createUrlDto: CreateUrlDto = {
        url,
        shortUrl,
        userId,
      };

      const createdUrl = await this.urlsService.create(createUrlDto);
      if (!createdUrl) {
        throw new NotFoundException(`URL not created`);
      }

      return { ...createdUrl, shortUrl: `${domain}/urls/${shortUrl}` };
    } catch (error) {
      throw new NotFoundException(`URL not created - ${error.message}`);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    try {
      const userId = Number(req.user.userId);
      return this.urlsService.findAll({ active: true, userId });
    } catch (error) {
      throw new NotFoundException(`URLs not found - ${error.message}`);
    }
  }

  @Get(':url')
  findOne(@Param('url') url: string) {
    // console.log('🚀url:', url);
    //TODO - ATUALIZAR CONTADOR DE VISITAS
    // return this.urlsService.findOne(+id);
    return {};
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlsService.update(+id, updateUrlDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const url = await this.urlsService.findOne(+id);
    if (url) {
      return this.urlsService.remove(+id, url);
    } else {
      throw new NotFoundException(`URL with id ${id} not found`);
    }
  }
}
