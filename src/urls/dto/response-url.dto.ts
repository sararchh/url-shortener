import { ApiProperty } from '@nestjs/swagger';
import { CreateUrlDto } from './create-url.dto';

export class UrlResponseDto extends CreateUrlDto {
  @ApiProperty({ example: 5, description: 'The ID of the URL' })
  id: number;

  @ApiProperty({
    example: 'http://localhost:3000/urls/t1mijm',
    description: 'The shortened URL',
  })
  shortUrl: string;

  @ApiProperty({
    example: 0,
    description: 'The number of times the URL has been clicked',
  })
  clickCount: number;

  @ApiProperty({
    example: '2025-01-29T16:40:21.689Z',
    description: 'The date the URL was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2025-01-29T16:40:21.689Z',
    description: 'The date the URL was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: null,
    description: 'The date the URL was deleted, if applicable',
    nullable: true,
  })
  deletedAt: Date | null;
}
