import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private configService: ConfigService) {
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      const rpcUrl = this.configService.get<string>('RPC_URL');
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      const privateKey = this.configService.get<string>('PRIVATE_KEY');
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      
      this.logger.log('Web3 provider initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize Web3 provider: ${error.message}`);
      throw error;
    }
  }

  getProvider() {
    return this.provider;
  }

  getWallet() {
    return this.wallet;
  }

  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    // ERC20 token ABI (minimal for balanceOf function)
    const abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, abi, this.provider);
    const balance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();
    
    return ethers.formatUnits(balance, decimals);
  }

  async sendTransaction(to: string, value: string): Promise<ethers.TransactionResponse> {
    const tx = await this.wallet.sendTransaction({
      to,
      value: ethers.parseEther(value),
    });
    
    return tx;
  }

  async callContractMethod(
    contractAddress: string, 
    abi: any[], 
    method: string, 
    params: any[] = []
  ): Promise<any> {
    const contract = new ethers.Contract(contractAddress, abi, this.provider);
    return await contract[method](...params);
  }

  async executeContractMethod(
    contractAddress: string, 
    abi: any[], 
    method: string, 
    params: any[] = []
  ): Promise<ethers.TransactionResponse> {
    const contract = new ethers.Contract(contractAddress, abi, this.wallet);
    return await contract[method](...params);
  }
}