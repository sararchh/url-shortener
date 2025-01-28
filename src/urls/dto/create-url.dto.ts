import { IsNotEmpty, IsString, IsOptional, IsUrl, IsNumber } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  shortUrl: string;

  @IsNumber()
  @IsOptional()
  clickCount?: number;

  @IsOptional()
  userId?: number | null;
}
