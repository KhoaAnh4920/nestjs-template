/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { BaseResponse, PaginationDto, PaginationResponse } from './base.dto';
import { BaseEntity } from './base.entity';
import { BaseService } from './base.service';
import {
  ApiCreate,
  ApiDelete,
  ApiGetAll,
  ApiGetDetail,
  ApiUpdate,
} from './base.swagger';

// Add UUID validation pipe
class UUIDParam {
  @IsUUID('4', { message: 'Invalid UUID format' })
  id: string;
}

export function BaseController<Entity extends BaseEntity>(
  $ref: any,
  name?: string,
) {
  abstract class Controller {
    abstract relations: string[];

    constructor(public readonly service: BaseService<Entity>) {}

    @Post()
    async create(@Body() body: any): Promise<BaseResponse<Entity>> {
      const result = await this.service.create(body);
      return {
        statusCode: 200,
        success: true,
        data: result,
      };
    }

    @Get('all')
    @ApiGetAll($ref, name)
    async getAll(
      @Query() query: PaginationDto,
    ): Promise<PaginationResponse<Entity>> {
      const [data, total] = await this.service.getAllWithPagination(
        query,
        {},
        //@ts-ignore
        { createdAt: 'DESC' },
        ...this.relations,
      );

      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 10;

      return {
        statusCode: 200,
        success: true,
        data,
        metadata: {
          page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    @Get('detail/:id')
    @ApiGetDetail($ref, name)
    async getDetail(@Param() params: UUIDParam): Promise<BaseResponse<Entity>> {
      try {
        const result = await this.service.getOneByIdOrFail(
          params.id,
          ...this.relations,
        );
        return {
          statusCode: 200,
          success: true,
          data: result,
        };
      } catch (error) {
        if (error?.code === '22P02') {
          // PostgreSQL invalid UUID error code
          throw new BadRequestException('Invalid UUID format');
        }
        throw error;
      }
    }

    @Patch('update/:id')
    @ApiUpdate($ref, name)
    async update(
      @Param() params: UUIDParam,
      @Body() body,
    ): Promise<BaseResponse<Entity>> {
      try {
        const result = await this.service.updateById(params.id, body);
        return {
          statusCode: 200,
          success: true,
          data: result,
        };
      } catch (error) {
        if (error?.code === '22P02') {
          throw new BadRequestException('Invalid UUID format');
        }
        throw error;
      }
    }

    @Delete('delete/:id')
    @ApiDelete($ref, name)
    async delete(@Param() params: UUIDParam): Promise<BaseResponse<Entity>> {
      try {
        const result = await this.service.softDeleteById(params.id);
        return {
          statusCode: 200,
          success: true,
          data: result,
        };
      } catch (error) {
        if (error?.code === '22P02') {
          throw new BadRequestException('Invalid UUID format');
        }
        throw error;
      }
    }
  }

  return Controller;
}
