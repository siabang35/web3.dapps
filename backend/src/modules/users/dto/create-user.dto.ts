import { IsNotEmpty, IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User password (hashed)',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'Username',
    example: 'crypto_whale',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Admin status',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}