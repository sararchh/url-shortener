import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Req,
  Headers,
  UseGuards,
  Request,
  Redirect,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { UrlsService } from './urls.service';
import { UpdateUrlDto } from './dto/update-url.dto';
import { generateShortUrl } from 'src/utils/generate-short-url.util';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';

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
  @Redirect()
  async findOne(@Param('url') url: string) {
    try {
      const urlData: Url | null = await this.urlsService.findOne({ shortUrl: url });
      if (!urlData || !urlData.url) {
        throw new NotFoundException(`URL not found`);
      }

      await this.urlsService.update(urlData.id, {
        ...urlData,
        clickCount: (urlData.clickCount || 0) + 1,
      });

      return { url: urlData.url, statusCode: 302 };
    } catch (error) {
      throw new NotFoundException(`URL not found - ${error.message}`);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Request() req,
  ) {
    try {
      const userId = Number(req.user.userId);
      const url = await this.urlsService.findOne({
        id: +id,
        userId,
        active: true,
      });

      if (!url) {
        throw new NotFoundException(
          `URL with id ${id} not found or not active for user logged`,
        );
      }

      const urlUpdated = await this.urlsService.update(+id, updateUrlDto);
      if (!urlUpdated) {
        throw new NotFoundException(`URL with id ${id} not updated`);
      }

      return urlUpdated;
    } catch (error) {
      throw new NotFoundException(`URL with id ${id} not found - ${error.message}`);
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   const url = await this.urlsService.findOne(+id);
  //   if (url) {
  //     return this.urlsService.remove(+id, url);
  //   } else {
  //     throw new NotFoundException(`URL with id ${id} not found`);
  //   }
  // }
}
