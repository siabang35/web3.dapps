import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({
    description: 'Token contract address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Token name',
    example: 'Ethereum',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Token symbol',
    example: 'ETH',
  })
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @ApiProperty({
    description: 'Token decimals',
    example: 18,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(36)
  decimals: number;

  @ApiProperty({
    description: 'Token logo URL',
    example: 'https://example.com/eth-logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({
    description: 'Token price in USD',
    example: 3000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'Is token stakeable',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isStakeable?: boolean;

  @ApiProperty({
    description: 'Is token swappable',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isSwappable?: boolean;
}