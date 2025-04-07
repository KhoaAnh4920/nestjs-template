import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;
}

export interface BaseResponse<T> {
  statusCode: number;
  success: boolean;
  data: T;
}

export interface PaginationResponse<T> {
  statusCode: number;
  success: boolean;
  data: T[];
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
