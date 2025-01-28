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
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UpdateUrlDto } from './dto/update-url.dto';
import { generateShortUrl } from 'src/utils/generate-short-url.util';
import { Request } from '@nestjs/common';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body('url') url: string, @Req() req: Request) {
    const shortUrl = generateShortUrl();
    // TODO
    return {};
  }

  @Get()
  findAll() {
    return this.urlsService.findAll({ active: true });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //TODO - ATUALIZAR CONTADOR DE VISITAS
    return this.urlsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlsService.update(+id, updateUrlDto);
  }

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
