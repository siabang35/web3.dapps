import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tokens' })
  @ApiResponse({ status: 200, description: 'Return all tokens' })
  findAll() {
    return this.tokensService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get token by ID' })
  @ApiResponse({ status: 200, description: 'Return token by ID' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  findOne(@Param('id') id: string): Promise<any> {
    return this.tokensService.findOne(id);
  }

  @Get('address/:address')
  @ApiOperation({ summary: 'Get token by address' })
  @ApiResponse({ status: 200, description: 'Return token by address' })
  findByAddress(@Param('address') address: string): Promise<any> {
    return this.tokensService.findByAddress(address);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new token' })
  @ApiResponse({ status: 201, description: 'Token created successfully' })
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokensService.create(createTokenDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a token' })
  @ApiResponse({ status: 200, description: 'Token updated successfully' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  update(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto) {
    return this.tokensService.update(id, updateTokenDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a token' })
  @ApiResponse({ status: 200, description: 'Token deleted successfully' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  remove(@Param('id') id: string) {
    return this.tokensService.remove(id);
  }

  @Get('info/:address')
  @ApiOperation({ summary: 'Get token info from blockchain' })
  @ApiResponse({ status: 200, description: 'Return token info' })
  getTokenInfo(@Param('address') address: string) {
    return this.tokensService.getTokenInfo(address);
  }

  @Get('balance/:tokenAddress')
  @ApiOperation({ summary: 'Get token balance for a wallet' })
  @ApiResponse({ status: 200, description: 'Return token balance' })
  getTokenBalance(
    @Param('tokenAddress') tokenAddress: string,
    @Query('walletAddress') walletAddress: string,
  ) {
    return this.tokensService.getTokenBalance(tokenAddress, walletAddress);
  }
}