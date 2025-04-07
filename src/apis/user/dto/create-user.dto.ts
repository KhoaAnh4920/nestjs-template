import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ description: 'Email of user', example: 'user@example.com' })
  email!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({
    description: 'Password of user',
    example: 'P@ssw0rd',
    minLength: 8,
  })
  password!: string;
}
