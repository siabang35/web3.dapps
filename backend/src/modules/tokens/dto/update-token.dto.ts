import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTokenDto {
  @ApiProperty({
    description: 'Token name',
    example: 'Ethereum',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Token symbol',
    example: 'ETH',
    required: false,
  })
  @IsOptional()
  @IsString()
  symbol?: string;

  @ApiProperty({
    description: 'Token decimals',
    example: 18,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(36)
  decimals?: number;

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
    description: 'Is token active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Is token stakeable',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isStakeable?: boolean;

  @ApiProperty({
    description: 'Is token swappable',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isSwappable?: boolean;
}