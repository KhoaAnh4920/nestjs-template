import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
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

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };

    // Instead of using the general update method, create a dedicated method in UserService
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

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Access denied');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  // async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
  //   const { currentPassword, newPassword } = changePasswordDto;

  //   const user = await this.userService.findById(userId);

  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }

  //   const isPasswordValid = await argon2.verify(user.password, currentPassword);

  //   if (!isPasswordValid) {
  //     throw new BadRequestException('Current password is incorrect');
  //   }

  //   if (currentPassword === newPassword) {
  //     throw new BadRequestException('New password must be different from current password');
  //   }

  //   const hashedPassword = await argon2.hash(newPassword);

  //   await this.userService.update(userId, { password: hashedPassword });

  //   return { message: 'Password changed successfully' };
  // }

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_JWT'),
      expiresIn: '1h',
    });
  }

  generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_JWT'),
      expiresIn: '7d',
    });
  }

  private excludePassword(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
