import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ description: 'Email of user', example: 'user@example.com' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ description: 'Password of user', example: 'P@ssw0rd' })
  password!: string;
}
