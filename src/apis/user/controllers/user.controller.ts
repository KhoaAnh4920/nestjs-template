import {
  ApiCreate,
  ApiGetAll,
  BaseController,
  BaseResponse,
  PaginationDto,
  PaginationResponse,
} from '@app/base';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserEntity } from '../entities/user.entities';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiResponse } from '@nestjs/swagger';

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
}
