import { Controller, Get, Param, Query } from '@nestjs/common';
import { SubgraphService } from './subgraph.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('subgraph')
@Controller('subgraph')
export class SubgraphController {
  constructor(private readonly subgraphService: SubgraphService) {}

  @Get('token/:address')
  @ApiOperation({ summary: 'Get token data from subgraph' })
  @ApiResponse({ status: 200, description: 'Return token data' })
  getTokenData(@Param('address') address: string): Promise<any> {
    return this.subgraphService.getTokenData(address);
  }

  @Get('swaps')
  @ApiOperation({ summary: 'Get recent swap events from subgraph' })
  @ApiResponse({ status: 200, description: 'Return swap events' })
  getSwapEvents(@Query('limit') limit: number = 10) {
    return this.subgraphService.getSwapEvents(limit);
  }

  @Get('user/:address/transactions')
  @ApiOperation({ summary: 'Get user transactions from subgraph' })
  @ApiResponse({ status: 200, description: 'Return user transactions' })
  getUserTransactions(
    @Param('address') address: string,
    @Query('limit') limit: number = 50,
  ) {
    return this.subgraphService.getUserTransactions(address, limit);
  }
}