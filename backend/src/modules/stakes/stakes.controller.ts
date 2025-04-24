import { Controller, Get, Post, Body, Param, Put, UseGuards, Query } from '@nestjs/common';
import { StakesService } from './stakes.service';
import { CreateStakeDto } from './dto/create-stake.dto';
import { UpdateStakeDto } from './dto/update-stake.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('stakes')
@Controller('stakes')
export class StakesController {
  constructor(private readonly stakesService: StakesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stakes' })
  @ApiResponse({ status: 200, description: 'Return all stakes' })
  findAll() {
    return this.stakesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stake by ID' })
  @ApiResponse({ status: 200, description: 'Return stake by ID' })
  @ApiResponse({ status: 404, description: 'Stake not found' })
  findOne(@Param('id') id: string) {
    return this.stakesService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get stakes by user ID' })
  @ApiResponse({ status: 200, description: 'Return stakes by user ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return stakes by user ID' })
  findByUser(@Param('userId') userId: string) {
    return this.stakesService.findByUser(userId);
  }

  @Get('user/:userId/active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active stakes by user ID' })
  @ApiResponse({ status: 200, description: 'Return active stakes by user ID' })
  findActiveByUser(@Param('userId') userId: string) {
    return this.stakesService.findActiveByUser(userId);
  }

  @Get('wallet/:walletAddress')
  @ApiOperation({ summary: 'Get stakes by wallet address' })
  @ApiResponse({ status: 200, description: 'Return stakes by wallet address' })
  findByWalletAddress(@Param('walletAddress') walletAddress: string) {
    return this.stakesService.findByWalletAddress(walletAddress);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new stake' })
  @ApiResponse({ status: 201, description: 'Stake created successfully' })
  create(@Body() createStakeDto: CreateStakeDto) {
    return this.stakesService.create(createStakeDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a stake' })
  @ApiResponse({ status: 200, description: 'Stake updated successfully' })
  @ApiResponse({ status: 404, description: 'Stake not found' })
  update(@Param('id') id: string, @Body() updateStakeDto: UpdateStakeDto) {
    return this.stakesService.update(id, updateStakeDto);
  }

  @Put(':id/unstake')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unstake tokens' })
  @ApiResponse({ status: 200, description: 'Unstake successful' })
  @ApiResponse({ status: 404, description: 'Stake not found' })
  unstake(@Param('id') id: string, @Query('txHash') txHash: string) {
    return this.stakesService.unstake(id, txHash);
  }

  @Get(':id/rewards')
  @ApiOperation({ summary: 'Calculate stake rewards' })
  @ApiResponse({ status: 200, description: 'Return calculated rewards' })
  @ApiResponse({ status: 404, description: 'Stake not found' })
  calculateRewards(@Param('id') id: string) {
    return this.stakesService.calculateRewards(id);
  }

  @Put(':id/rewards')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update stake rewards' })
  @ApiResponse({ status: 200, description: 'Rewards updated successfully' })
  @ApiResponse({ status: 404, description: 'Stake not found' })
  updateRewards(@Param('id') id: string) {
    return this.stakesService.updateRewards(id);
  }
}