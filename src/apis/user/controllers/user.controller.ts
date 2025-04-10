import {
  ApiCreate,
  ApiGetAll,
  BaseController,
  BaseResponse,
  PaginationDto,
  PaginationResponse,
} from '@app/base';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entities';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController extends BaseController<UserEntity>(
  UserEntity,
  'users',
) {
  relations = [];
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post('create')
  @ApiCreate(UserEntity, 'users')
  @ApiResponse({
    status: 409,
    description: 'User with this email/username already exists',
    schema: {
      properties: {
        status: { example: 409 },
        error: { example: 'User with this email already exists' },
      },
    },
  })
  create(@Body() body: CreateUserDto): Promise<BaseResponse<UserEntity>> {
    return super.create(body);
  }

  @Get('getAll')
  @ApiGetAll(UserEntity, 'users')
  getAll(
    @Query() query: PaginationDto,
  ): Promise<PaginationResponse<UserEntity>> {
    return super.getAll(query);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user profile',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(
    @Request() req,
  ): Promise<BaseResponse<Omit<UserEntity, 'password'>>> {
    const userId = req.user.id;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    return {
      statusCode: 200,
      success: true,
      data: userWithoutPassword as Omit<UserEntity, 'password'>,
    };
  }
}
