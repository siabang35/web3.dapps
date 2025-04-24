import { Injectable } from '@nestjs/common';
import { Web3Service } from '../web3/web3.service';
import { TokensService } from '../tokens/tokens.service';
import { SwapsService } from '../swaps/swaps.service';
import { StakesService } from '../stakes/stakes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PortfolioService {
  constructor(
    private web3Service: Web3Service,
    private tokensService: TokensService,
    private swapsService: SwapsService,
    private stakesService: StakesService,
    private usersService: UsersService,
  ) {}

  async getPortfolio(walletAddress: string) {
    // Get native token balance (ETH)
    const ethBalance = await this.web3Service.getBalance(walletAddress);
    
    // Get all tokens
    const tokens = await this.tokensService.findAll();
    
    // Get token balances
    const tokenBalances = await Promise.all(
      tokens.map(async (token) => {
        try {
          const balance = await this.web3Service.getTokenBalance(token.address, walletAddress);
          return {
            token,
            balance: parseFloat(balance),
            value: parseFloat(balance) * token.price,
          };
        } catch (error) {
          return {
            token,
            balance: 0,
            value: 0,
            error: error.message,
          };
        }
      })
    );
    
    // Filter out zero balances
    const nonZeroBalances = tokenBalances.filter(item => item.balance > 0);
    
    // Get active stakes
    const user = await this.usersService.findByWalletAddress(walletAddress);
    let stakes = [];
    
    if (user) {
      stakes = await this.stakesService.findActiveByUser(user.id);
      
      // Update rewards for each stake
      for (const stake of stakes) {
        await this.stakesService.updateRewards(stake.id);
      }
    }
    
    // Get recent swaps
    const recentSwaps = await this.swapsService.findByWalletAddress(walletAddress);
    
    // Calculate total portfolio value
    const ethValue = parseFloat(ethBalance) * 3000; // Assuming ETH price is $3000
    const tokensValue = nonZeroBalances.reduce((sum, item) => sum + item.value, 0);
    const stakesValue = stakes.reduce((sum, stake) => sum + parseFloat(stake.amount.toString()), 0);
    const totalValue = ethValue + tokensValue + stakesValue;
    
    return {
      walletAddress,
      ethBalance: parseFloat(ethBalance),
      ethValue,
      tokens: nonZeroBalances,
      stakes,
      recentSwaps: recentSwaps.slice(0, 5),
      totalValue,
    };
  }

  async getPortfolioHistory(walletAddress: string) {
    // This would typically query historical data from the database
    // For demonstration, we'll return a simple mock
    
    const now = new Date();
    const history = [];
    
    // Generate 30 days of mock data
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Mock value with some random fluctuation
      const baseValue = 10000;
      const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
      
      history.push({
        date: date.toISOString().split('T')[0],
        value: baseValue * randomFactor * (1 + (30 - i) * 0.01), // Slight uptrend
      });
    }
    
    return {
      walletAddress,
      history,
    };
  }
}