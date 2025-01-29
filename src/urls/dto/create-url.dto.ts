import { IsNotEmpty, IsString, IsOptional, IsUrl, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://example.com', description: 'The original URL' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 'https://short.ly/abc123',
    description: 'The shortened URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  shortUrl: string;

  @ApiProperty({
    example: 0,
    description: 'The number of times the URL has been clicked',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  clickCount?: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the URL',
    required: false,
  })
  @IsOptional()
  userId?: number | null;
}
