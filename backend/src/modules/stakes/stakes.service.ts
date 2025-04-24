import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stake } from '../../database/entities/stake.entity';
import { CreateStakeDto } from './dto/create-stake.dto';
import { UpdateStakeDto } from './dto/update-stake.dto';
import { Web3Service } from '../web3/web3.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class StakesService {
  constructor(
    @InjectRepository(Stake)
    private stakesRepository: Repository<Stake>,
    private web3Service: Web3Service,
    private tokensService: TokensService,
    private usersService: UsersService,
  ) { }

  async findAll(): Promise<Stake[]> {
    return this.stakesRepository.find({
      relations: ['user', 'token'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Stake> {
    const stake = await this.stakesRepository.findOne({ 
      where: { id },
      relations: ['user', 'token'],
    });
    
    if (!stake) {
      throw new NotFoundException(`Stake with ID ${id} not found`);
    }
    
    return stake;
  }

  async findByUser(userId: string): Promise<Stake[]> {
    return this.stakesRepository.find({
      where: { userId },
      relations: ['token'],
      order: { startDate: 'DESC' },
    });
  }

  async findActiveByUser(userId: string): Promise<Stake[]> {
    return this.stakesRepository.find({
      where: { userId, status: 'active' },
      relations: ['token'],
      order: { startDate: 'DESC' },
    });
  }

  async findByWalletAddress(walletAddress: string): Promise<Stake[]> {
    const user = await this.usersService.findByWalletAddress(walletAddress);
    
    if (!user) {
      return [];
    }
    
    return this.findByUser(user.id);
  }

  async create(createStakeDto: CreateStakeDto): Promise<Stake> {
    // Validate token
    const token = await this.tokensService.findOne(createStakeDto.tokenId);
    
    if (!token.isStakeable) {
      throw new BadRequestException('Token is not stakeable');
    }
    
    // Validate user
    const user = await this.usersService.findOne(createStakeDto.userId);
    
    // Create stake record
    const stake = this.stakesRepository.create({
      ...createStakeDto,
      status: 'active',
    });
    
    return this.stakesRepository.save(stake);
  }

  async update(id: string, updateStakeDto: UpdateStakeDto): Promise<Stake> {
    const stake = await this.findOne(id);
    
    // Update stake properties
    Object.assign(stake, updateStakeDto);
    
    return this.stakesRepository.save(stake);
  }

  async unstake(id: string, txHash: string): Promise<Stake> {
    const stake = await this.findOne(id);
    
    if (stake.status !== 'active') {
      throw new BadRequestException('Stake is not active');
    }
    
    // Update stake
    stake.status = 'unstaked';
    stake.unstakeTxHash = txHash;
    stake.endDate = new Date();
    
    return this.stakesRepository.save(stake);
  }

  async calculateRewards(stakeId: string): Promise<number> {
    const stake = await this.findOne(stakeId);
    
    if (stake.status !== 'active') {
      return stake.rewards;
    }
    
    // Simple reward calculation (for demonstration)
    // In a real application, this would likely call a smart contract
    const startDate = new Date(stake.startDate).getTime();
    const now = Date.now();
    const daysStaked = (now - startDate) / (1000 * 60 * 60 * 24);
    
    // Example: 10% APY
    const annualRate = 0.1;
    const rewards = stake.amount * (annualRate * daysStaked / 365);
    
    return rewards;
  }

  async updateRewards(stakeId: string): Promise<Stake> {
    const stake = await this.findOne(stakeId);
    const rewards = await this.calculateRewards(stakeId);
    
    stake.rewards = rewards;
    return this.stakesRepository.save(stake);
  }
}