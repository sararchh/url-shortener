import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDTO {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  email: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhcmF0ZXN0ZTExQGVtYWlsLmNvbSIsImlhdCI6MTczODE2Nzc1MiwiZXhwIjoxNzM4NzcyNTUyLCJzdWIiOiIxIn0.dRozdPGW5vl5y2wAt4H1DFC48a893zSOMzLZeAbQ-IA',
    description: 'The access token',
  })
  accessToken: string;
}
