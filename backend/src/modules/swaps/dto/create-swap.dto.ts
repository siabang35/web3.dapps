import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSwapDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'From token ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsString()
  fromTokenId: string;

  @ApiProperty({
    description: 'To token ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty()
  @IsString()
  toTokenId: string;

  @ApiProperty({
    description: 'Amount of from token',
    example: 1.5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  fromAmount: number;

  @ApiProperty({
    description: 'Amount of to token',
    example: 2500,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  toAmount: number;

  @ApiProperty({
    description: 'Transaction hash',
    example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  })
  @IsNotEmpty()
  @IsString()
  txHash: string;
}