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

import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UrlResponseDto } from './dto/response-url.dto';

@Controller('urls')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new URL' })
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({
    status: 201,
    description: 'URL created successfully',
    type: UrlResponseDto,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Authorization token',
    required: false,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(
    @Body('url') url: string,
    @Req() req: Request,
    @Headers('authorization') authHeader?: string,
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
  @ApiOperation({ summary: 'Get all URLs for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'URLs retrieved successfully',
    type: [UrlResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'URLs not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findAll(@Request() req) {
    try {
      const userId = Number(req.user.userId);
      return this.urlsService.findAll({ active: true, userId });
    } catch (error) {
      throw new NotFoundException(`URLs not found - ${error.message}`);
    }
  }

  @Get(':url')
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiHeader({
    name: 'authorization',
    description: 'Authorization token',
    required: false,
  })
  @ApiResponse({ status: 302, description: 'Redirecting to the original URL' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Redirect()
  async findOne(@Param('url') url: string) {
    try {
      const urlData = await this.urlsService.findOne({ shortUrl: url });
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
  @ApiOperation({ summary: 'Update a URL' })
  @ApiBody({ type: UpdateUrlDto })
  @ApiResponse({
    status: 200,
    description: 'URL updated successfully',
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
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

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a URL' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async remove(@Param('id') id: string, @Request() req) {
    try {
      const userId = Number(req.user.userId);
      const url = await this.urlsService.findOne({ id: +id, userId, active: true });

      if (!url) {
        throw new NotFoundException(
          `URL with id ${id} not found or not active for user logged`,
        );
      }

      await this.urlsService.remove(+id, url);
      return { message: `URL with id ${id} deleted successfully` };
    } catch (error) {
      throw new NotFoundException(`URL with id ${id} not found - ${error.message}`);
    }
  }
}
