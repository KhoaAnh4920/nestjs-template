import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserEntity } from '../../user/entities/user.entities';
import { UserService } from '../../user/services/user.service';

interface JwtPayload {
  id: string;
  email: string;
  sub?: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends TokenResponse {
  user: Omit<UserEntity, 'password'>;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);

    console.log('user: ', user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    console.log('isPasswordValid: ', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    return user;
  }

  async login(user: UserEntity): Promise<LoginResponse> {
    const payload = { id: user.id, email: user.email };

    try {
      await this.userService.updateLastLogin(user.id);
    } catch (error) {
      // Just log the error but don't fail the login process
      console.error('Failed to update last login time:', error);
    }

    return {
      user: this.excludePassword(user),
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_JWT'),
      expiresIn: '1h',
    });
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_JWT'),
      expiresIn: '7d',
    });
  }

  private excludePassword(user: UserEntity): Omit<UserEntity, 'password'> {
    const { password, ...result } = user;
    return result as Omit<UserEntity, 'password'>;
  }
}
