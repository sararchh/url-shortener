import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Headers,
  UseGuards,
  Request,
  Redirect,
  Put,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UrlsService } from './urls.service';
import { UpdateUrlDto } from './dto/update-url.dto';
import { generateShortUrl } from '@/utils/generate-short-url.util';
import { CreateUrlDto } from './dto/create-url.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UrlResponseDto } from './dto/response-url.dto';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

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
    const shortUrl = generateShortUrl();
    const domain = req['protocol'] + '://' + req.headers['host'];
    const userId = await this.urlsService.validateAndGetUserId(authHeader);

    const createUrlDto: CreateUrlDto = {
      url,
      shortUrl,
      userId,
    };

    return this.urlsService.create(createUrlDto, domain);
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
    const userId = Number(req.user.userId);
    return this.urlsService.findAll({ active: true, userId });
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
    const urlData = await this.urlsService.findOne({ shortUrl: url });
    if (!urlData || !urlData.url) {
      throw new NotFoundException(`URL not found`);
    }

    await this.urlsService.incrementClickCount(urlData);
    return { url: urlData.url, statusCode: 302 };
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

    return this.urlsService.update(+id, updateUrlDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a URL' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async remove(@Param('id') id: string, @Request() req) {
    const userId = Number(req.user.userId);
    const url = await this.urlsService.findOne({ id: +id, userId, active: true });

    if (!url) {
      throw new NotFoundException(
        `URL with id ${id} not found or not active for user logged`,
      );
    }

    return this.urlsService.remove(+id, url);
  }
}
