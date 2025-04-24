import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { Token } from '../../database/entities/token.entity';
import { Web3Module } from '../web3/web3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    Web3Module,
  ],
  providers: [TokensService],
  controllers: [TokensController],
  exports: [TokensService],
})
export class TokensModule {}