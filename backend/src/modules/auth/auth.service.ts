import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Web3LoginDto } from './dto/web3-login.dto';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateWeb3Login(loginDto: Web3LoginDto): Promise<any> {
    try {
      // Verify the signature
      const message = `Sign this message to authenticate with our dApp: ${loginDto.nonce}`;
      const address = ethers.verifyMessage(message, loginDto.signature);
      
      // Check if the recovered address matches the provided address
      if (address.toLowerCase() !== loginDto.walletAddress.toLowerCase()) {
        throw new UnauthorizedException('Invalid signature');
      }
      
      // Find or create user
      let user = await this.usersService.findByWalletAddress(loginDto.walletAddress);
      
      if (!user) {
        user = await this.usersService.create({
          walletAddress: loginDto.walletAddress,
        });
      }
      
      return user;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async login(user: any) {
    const payload = { 
      sub: user.id, 
      walletAddress: user.walletAddress,
      isAdmin: user.isAdmin 
    };
    
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}