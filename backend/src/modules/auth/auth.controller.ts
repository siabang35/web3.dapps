import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Web3LoginDto } from './dto/web3-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('web3-login')
  @ApiOperation({ summary: 'Login with Web3 wallet' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async web3Login(@Body() loginDto: Web3LoginDto) {
    const user = await this.authService.validateWeb3Login(loginDto);
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req) {
    return req.user;
  }
  

  @Post('nonce')
  @ApiOperation({ summary: 'Get a nonce for Web3 login' })
  @ApiResponse({ status: 200, description: 'Nonce generated successfully' })
  getNonce() {
    // Generate a random nonce
    const nonce = Math.floor(Math.random() * 1000000000).toString();
    return { nonce };
  }
}