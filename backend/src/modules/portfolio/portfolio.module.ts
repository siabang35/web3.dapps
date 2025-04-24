import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { Web3Module } from '../web3/web3.module';
import { TokensModule } from '../tokens/tokens.module';
import { SwapsModule } from '../swaps/swaps.module';
import { StakesModule } from '../stakes/stakes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    Web3Module,
    TokensModule,
    SwapsModule,
    StakesModule,
    UsersModule,
  ],
  providers: [PortfolioService],
  controllers: [PortfolioController],
  exports: [PortfolioService],
})
export class PortfolioModule {}