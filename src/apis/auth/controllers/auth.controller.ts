import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Get,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { BaseResponse } from '@app/base';
import { UserEntity } from 'src/apis/user/entities/user.entities';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      properties: {
        statusCode: { example: 200 },
        data: {
          properties: {
            user: { type: 'object' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    const result = await this.authService.login(req.user);
    return { statusCode: HttpStatus.OK, data: result };
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Request() req,
    @Body() refreshTokenDto: RefreshTokenDto
  ) {
    const tokens = await this.authService.refreshTokens(req.user.sub, refreshTokenDto.refreshToken);
    return { statusCode: HttpStatus.OK, data: tokens };
  }

  // @Post('change-password')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Change user password' })
  // @ApiResponse({ status: 200, description: 'Password changed successfully' })
  // @ApiResponse({ status: 400, description: 'Invalid password data' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async changePassword(
  //   @Request() req,
  //   @Body() changePasswordDto: ChangePasswordDto
  // ){
  //   const result = await this.authService.changePassword(req.user.sub, changePasswordDto);
  //   return { statusCode: HttpStatus.OK, data: result };
  // }

  // @Get('profile')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get user profile' })
  // @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async getProfile(@Request() req): Promise<BaseResponse<UserEntity>> {
  //   const user = await this.userService.findOne(req.user.sub);
  //   return { statusCode: HttpStatus.OK, data: user };
  // }
}