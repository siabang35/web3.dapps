import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { User } from '@entities/user.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([User]), // Add direct access to User repository
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'super-secret-key',
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRATION') || '1h' // Shorter default for access tokens
        },
      }),
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy,
    // Add a provider for the refresh token secret
    {
      provide: 'REFRESH_TOKEN_SECRET',
      useFactory: (configService: ConfigService) => 
        configService.get('REFRESH_TOKEN_SECRET') || 'refresh-super-secret-key',
      inject: [ConfigService],
    },
    // Add a provider for the refresh token expiration
    {
      provide: 'REFRESH_TOKEN_EXPIRATION',
      useFactory: (configService: ConfigService) => 
        configService.get('REFRESH_TOKEN_EXPIRATION') || '7d',
      inject: [ConfigService],
    }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}