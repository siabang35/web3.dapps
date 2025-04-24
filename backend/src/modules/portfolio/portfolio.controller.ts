import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':walletAddress')
  @ApiOperation({ summary: 'Get portfolio for a wallet address' })
  @ApiResponse({ status: 200, description: 'Return portfolio data' })
  async getPortfolio(@Param('walletAddress') walletAddress: string) {
    return this.portfolioService.getPortfolio(walletAddress);
  }

  @Get(':walletAddress/history')
  @ApiOperation({ summary: 'Get portfolio history for a wallet address' })
  @ApiResponse({ status: 200, description: 'Return portfolio history data' })
  async getPortfolioHistory(@Param('walletAddress') walletAddress: string) {
    return this.portfolioService.getPortfolioHistory(walletAddress);
  }
}