import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swap } from '../../database/entities/swap.entity';
import { CreateSwapDto } from './dto/create-swap.dto';
import { Web3Service } from '../web3/web3.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SwapsService {
  constructor(
    @InjectRepository(Swap)
    private readonly swapsRepository: Repository<Swap>,
    private readonly web3Service: Web3Service,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Swap[]> {
    return this.swapsRepository.find({
      relations: ['user', 'fromToken', 'toToken'],
      order: { timestamp: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Swap> {
    const swap = await this.swapsRepository.findOne({ 
      where: { id },
      relations: ['user', 'fromToken', 'toToken'],
    });
    
    if (!swap) {
      throw new NotFoundException(`Swap with ID ${id} not found`);
    }
    
    return swap;
  }

  async findByUser(userId: string): Promise<Swap[]> {
    return this.swapsRepository.find({
      where: { userId },
      relations: ['fromToken', 'toToken'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByWalletAddress(walletAddress: string): Promise<Swap[]> {
    const user = await this.usersService.findByWalletAddress(walletAddress);
    
    if (!user) {
      return [];
    }
    
    return this.findByUser(user.id);
  }

  async create(createSwapDto: CreateSwapDto): Promise<Swap> {
    // Validate tokens
    const fromToken = await this.tokensService.findOne(createSwapDto.fromTokenId);
    const toToken = await this.tokensService.findOne(createSwapDto.toTokenId);
    
    if (!fromToken.isSwappable || !toToken.isSwappable) {
      throw new BadRequestException('One or both tokens are not swappable');
    }
    
    // Validate user
    const user = await this.usersService.findOne(createSwapDto.userId);
    
    // Create swap record
    const swap = this.swapsRepository.create({
      ...createSwapDto,
      status: 'completed',
    });
    
    return this.swapsRepository.save(swap);
  }

  async getRecentSwaps(limit: number = 10): Promise<Swap[]> {
    return this.swapsRepository.find({
      relations: ['user', 'fromToken', 'toToken'],
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async verifySwapTransaction(txHash: string): Promise<boolean> {
    try {
      const provider = this.web3Service.getProvider();
      const receipt = await provider.getTransactionReceipt(txHash);
      
      return receipt && receipt.status === 1;
    } catch (error) {
      return false;
    }
  }
}