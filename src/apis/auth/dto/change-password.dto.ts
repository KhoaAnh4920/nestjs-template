import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  @ApiProperty({ description: 'Current password of user', example: 'P@ssw0rd' })
  currentPassword!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    }
  )
  @IsNotEmpty({ message: 'New password is required' })
  @ApiProperty({ 
    description: 'New password of user', 
    example: 'NewP@ssw0rd',
    minLength: 8 
  })
  newPassword!: string;
}