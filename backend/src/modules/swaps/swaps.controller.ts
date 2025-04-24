import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { CreateSwapDto } from './dto/create-swap.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('swaps')
@Controller('swaps')
export class SwapsController {
  constructor(private readonly swapsService: SwapsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all swaps' })
  @ApiResponse({ status: 200, description: 'Return all swaps' })
  findAll() {
    return this.swapsService.findAll();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent swaps' })
  @ApiResponse({ status: 200, description: 'Return recent swaps' })
  getRecentSwaps(@Query('limit') limit: number) {
    return this.swapsService.getRecentSwaps(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get swap by ID' })
  @ApiResponse({ status: 200, description: 'Return swap by ID' })
  @ApiResponse({ status: 404, description: 'Swap not found' })
  findOne(@Param('id') id: string) {
    return this.swapsService.findOne(id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get swaps by user ID' })
  @ApiResponse({ status: 200, description: 'Return swaps by user ID' })
  findByUser(@Param('userId') userId: string) {
    return this.swapsService.findByUser(userId);
  }

  @Get('wallet/:walletAddress')
  @ApiOperation({ summary: 'Get swaps by wallet address' })
  @ApiResponse({ status: 200, description: 'Return swaps by wallet address' })
  findByWalletAddress(@Param('walletAddress') walletAddress: string) {
    return this.swapsService.findByWalletAddress(walletAddress);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new swap' })
  @ApiResponse({ status: 201, description: 'Swap created successfully' })
  create(@Body() createSwapDto: CreateSwapDto) {
    return this.swapsService.create(createSwapDto);
  }

  @Get('verify/:txHash')
  @ApiOperation({ summary: 'Verify swap transaction' })
  @ApiResponse({ status: 200, description: 'Return verification result' })
  verifySwapTransaction(@Param('txHash') txHash: string) {
    return this.swapsService.verifySwapTransaction(txHash);
  }
}