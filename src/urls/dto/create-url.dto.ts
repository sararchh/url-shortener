import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  shortUrl: string;

  @IsOptional()
  userId?: number | null;
}
