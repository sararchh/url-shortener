import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from '@/prisma/prisma.service';

describe('UrlsController', () => {
  let controller: UrlsController;
  let urlsService: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        UrlsService,
        { provide: JwtService, useValue: { decode: jest.fn() } },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    urlsService = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a URL', async () => {
    const createUrlDto: CreateUrlDto = {
      url: 'http://example.com',
      shortUrl: 'abc123',
      userId: 1,
    };
    const createdUrl = {
      id: 1,
      url: createUrlDto.url,
      shortUrl: createUrlDto.shortUrl,
      userId: createUrlDto.userId ?? null,
      clickCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    jest.spyOn(urlsService, 'create').mockResolvedValue(createdUrl);

    const result = await controller.create(
      createUrlDto.url,
      { protocol: 'http', headers: { host: 'localhost' } } as any,
      'Bearer token',
    );

    expect(urlsService.create).toHaveBeenCalledWith(
      expect.objectContaining({ url: createUrlDto.url }),
    );
    expect(result).toEqual(
      expect.objectContaining({ ...createdUrl, shortUrl: `${result.shortUrl}` }),
    );
  });

  it('should return all URLs for the authenticated user', async () => {
    const urls = [
      {
        id: 1,
        url: 'http://example.com',
        shortUrl: 'abc123',
        userId: 1,
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    jest.spyOn(urlsService, 'findAll').mockResolvedValue(urls);

    const result = await controller.findAll({ user: { userId: 1 } } as any);
    expect(urlsService.findAll).toHaveBeenCalledWith({ active: true, userId: 1 });
    expect(result).toEqual(urls);
  });

  it('should redirect to the original URL', async () => {
    const urlData = {
      id: 1,
      url: 'http://example.com',
      shortUrl: 'abc123',
      clickCount: 0,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    jest.spyOn(urlsService, 'findOne').mockResolvedValue(urlData);
    jest.spyOn(urlsService, 'update').mockResolvedValue({ ...urlData, clickCount: 1 });

    const result = await controller.findOne('abc123');
    expect(urlsService.findOne).toHaveBeenCalledWith({ shortUrl: 'abc123' });
    expect(urlsService.update).toHaveBeenCalledWith(1, { ...urlData, clickCount: 1 });
    expect(result).toEqual({ url: 'http://example.com', statusCode: 302 });
  });

  it('should update a URL', async () => {
    const updateUrlDto: UpdateUrlDto = { url: 'http://updated.com', shortUrl: 'abc123' };
    const updatedUrl = {
      id: 1,
      url: 'http://updated.com',
      shortUrl: 'abc123',
      userId: 1,
      clickCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    jest.spyOn(urlsService, 'findOne').mockResolvedValue(updatedUrl);
    jest.spyOn(urlsService, 'update').mockResolvedValue(updatedUrl);

    const result = await controller.update('1', updateUrlDto, {
      user: { userId: 1 },
    });
    expect(urlsService.findOne).toHaveBeenCalledWith({ id: 1, userId: 1, active: true });
    expect(urlsService.update).toHaveBeenCalledWith(1, updateUrlDto);
    expect(result).toEqual(updatedUrl);
  });

  it('should delete a URL', async () => {
    const urlData = {
      id: 1,
      url: 'http://example.com',
      shortUrl: 'abc123',
      userId: 1,
      clickCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };
    jest.spyOn(urlsService, 'findOne').mockResolvedValue(urlData);
    jest.spyOn(urlsService, 'remove').mockResolvedValue(urlData);

    const result = await controller.remove('1', { user: { userId: 1 } });
    expect(urlsService.findOne).toHaveBeenCalledWith({ id: 1, userId: 1, active: true });
    expect(urlsService.remove).toHaveBeenCalledWith(urlData.id, urlData);
    expect(result).toEqual({ message: `URL with id 1 deleted successfully` });
  });
});
