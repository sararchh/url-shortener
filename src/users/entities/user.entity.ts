import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  password: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The creation date of the user',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The last update date of the user',
  })
  updatedAt: Date;

  @ApiProperty({
    example: null,
    description: 'The deletion date of the user, if applicable',
  })
  deletedAt: Date | null;
}
