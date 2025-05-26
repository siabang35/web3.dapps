import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';
import { Web3LoginDto } from './dto/web3-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';
import { verifyMessage } from 'ethers';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateWeb3Login(loginDto: Web3LoginDto): Promise<User> {
    const { walletAddress, signature, nonce } = loginDto;
    
    // Verify the signature
    const message = `Login to DApp with wallet: ${walletAddress}\nNonce: ${nonce}`;
    const recoveredAddress = verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }
    
    // Find or create user
    let user = await this.usersRepository.findOne({ where: { walletAddress } });
    
    if (!user) {
      // Create a new user if not exists
      user = this.usersRepository.create({
        walletAddress,
        isAdmin: false,
        isActive: true,
      });
      await this.usersRepository.save(user);
    }
    
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return user;
  }

  async register(registerDto: UserRegisterDto): Promise<{ message: string }> {
    const { email, password, username } = registerDto;
    
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    
    // Check if username already exists
    const existingUsername = await this.usersRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      username,
      isAdmin: false,
      isActive: true,
    });
    
    await this.usersRepository.save(user);
    
    return { message: 'User registered successfully' };
  }

  async login(user: User) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      walletAddress: user.walletAddress,
      username: user.username,
      isAdmin: user.isAdmin 
    };
    
    // Generate access token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h', // Short-lived token
    });
    
    // Generate refresh token
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' }, // Longer-lived token
    );
    
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      // Get user from database
      const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
      
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // Generate new access token
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}