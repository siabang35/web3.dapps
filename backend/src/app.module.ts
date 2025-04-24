import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { SwapsModule } from './modules/swaps/swaps.module';
import { StakesModule } from './modules/stakes/stakes.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { Web3Module } from './modules/web3/web3.module';
import { SubgraphModule } from './modules/subgraph/subgraph.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    
    // Feature modules
    AuthModule,
    UsersModule,
    TokensModule,
    SwapsModule,
    StakesModule,
    PortfolioModule,
    Web3Module,
    SubgraphModule,
  ],
})
export class AppModule {}