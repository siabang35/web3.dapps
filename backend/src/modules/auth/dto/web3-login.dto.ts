import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Web3LoginDto {
  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty({
    description: 'Signature of the authentication message',
    example: '0x1234567890abcdef...',
  })
  @IsNotEmpty()
  @IsString()
  signature: string;

  @ApiProperty({
    description: 'Nonce used for the signature (to prevent replay attacks)',
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  nonce: string;
}