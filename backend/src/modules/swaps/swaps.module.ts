import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwapsService } from './swaps.service';
import { SwapsController } from './swaps.controller';
import { Swap } from '../../database/entities/swap.entity';
import { Web3Module } from '../web3/web3.module';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Swap]),
    Web3Module,
    TokensModule,
    UsersModule,
  ],
  providers: [SwapsService],
  controllers: [SwapsController],
  exports: [SwapsService],
})
export class SwapsModule {}