import { ApiProperty } from '@nestjs/swagger';

export class Url {
  @ApiProperty({ example: 1, description: 'The ID of the URL' })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the URL',
    nullable: true,
  })
  userId?: number | null;

  @ApiProperty({ example: 'https://example.com', description: 'The original URL' })
  url: string;

  @ApiProperty({ example: 'https://short.ly/abc123', description: 'The shortened URL' })
  shortUrl: string;

  @ApiProperty({
    example: 0,
    description: 'The number of times the URL has been clicked',
  })
  clickCount: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The creation date of the URL',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The last update date of the URL',
  })
  updatedAt: Date;

  @ApiProperty({
    example: null,
    description: 'The deletion date of the URL, if applicable',
    nullable: true,
  })
  deletedAt?: Date | null;
}
