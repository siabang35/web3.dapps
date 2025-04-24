import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../../database/entities/token.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Web3Service } from '../web3/web3.service';
import { ethers } from 'ethers';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
    private web3Service: Web3Service,
  ) {}

  async findAll(): Promise<Token[]> {
    return this.tokensRepository.find();
  }

  async findOne(id: string): Promise<Token> {
    const token = await this.tokensRepository.findOne({ where: { id } });
    if (!token) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }
    return token;
  }

  async findByAddress(address: string): Promise<Token | null> {
    return this.tokensRepository.findOne({ 
      where: { address: address.toLowerCase() } 
    });
  }

  async create(createTokenDto: CreateTokenDto): Promise<Token> {
    // Normalize address
    const normalizedAddress = createTokenDto.address.toLowerCase();
    
    // Check if token already exists
    const existingToken = await this.findByAddress(normalizedAddress);
    if (existingToken) {
      return existingToken;
    }
    
    // Create new token
    const token = this.tokensRepository.create({
      ...createTokenDto,
      address: normalizedAddress,
    });
    
    return this.tokensRepository.save(token);
  }

  async update(id: string, updateTokenDto: UpdateTokenDto): Promise<Token> {
    const token = await this.findOne(id);
    
    // Update token properties
    Object.assign(token, updateTokenDto);
    
    return this.tokensRepository.save(token);
  }

  async remove(id: string): Promise<void> {
    const token = await this.findOne(id);
    await this.tokensRepository.remove(token);
  }

  async getTokenInfo(address: string): Promise<any> {
    try {
      // ERC20 token ABI (minimal for token info)
      const abi = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
        'function totalSupply() view returns (uint256)',
      ];
      
      const provider = this.web3Service.getProvider();
      const tokenContract = new ethers.Contract(address, abi, provider);
      
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.totalSupply(),
      ]);
      
      return {
        address,
        name,
        symbol,
        decimals,
        totalSupply: ethers.formatUnits(totalSupply, decimals),
      };
    } catch (error) {
      throw new Error(`Failed to get token info: ${error.message}`);
    }
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    return this.web3Service.getTokenBalance(tokenAddress, walletAddress);
  }
}