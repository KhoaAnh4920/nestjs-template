import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/apis/user/entities/user.entities';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ description: 'Email of user', example: 'user@example.com' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ description: 'Password of user', example: 'P@ssw0rd' })
  password!: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'User object', type: Object })
  user: Omit<UserEntity, 'password'>;

  @ApiProperty({ description: 'Access token', type: String })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token', type: String })
  refreshToken: string;
}
