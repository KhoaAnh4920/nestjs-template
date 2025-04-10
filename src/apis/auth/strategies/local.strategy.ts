import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserEntity } from 'src/apis/user/entities/user.entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    try {
      const user = await this.authService.validateUser(email, password);
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
