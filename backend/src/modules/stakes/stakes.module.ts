import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StakesService } from './stakes.service';
import { StakesController } from './stakes.controller';
import { Stake } from '../../database/entities/stake.entity';
import { Web3Module } from '../web3/web3.module';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stake]),
    Web3Module,
    TokensModule,
    UsersModule,
  ],
  providers: [StakesService],
  controllers: [StakesController],
  exports: [StakesService],
})
export class StakesModule {}