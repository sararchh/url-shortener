import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlDto } from './create-url.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {
  @ApiProperty({ example: 'https://short.ly/abc123', description: 'The shortened URL' })
  @IsString()
  @IsNotEmpty()
  shortUrl: string;
}
