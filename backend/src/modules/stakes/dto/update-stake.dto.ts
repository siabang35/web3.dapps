import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStakeDto {
  @ApiProperty({
    description: 'Rewards amount',
    example: 5.25,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rewards?: number;

  @ApiProperty({
    description: 'Stake status',
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Unstake transaction hash',
    example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    required: false,
  })
  @IsOptional()
  @IsString()
  unstakeTxHash?: string;
}