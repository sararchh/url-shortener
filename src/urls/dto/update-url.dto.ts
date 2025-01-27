import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlDto } from './create-url.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {
  @IsString()
  @IsNotEmpty()
  shortUrl: string;
}
