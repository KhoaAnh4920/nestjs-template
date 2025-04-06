import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(field: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: [`User with this ${field} already exists`],
        error: 'Conflict'
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: [`User with id ${id} not found`],
        error: 'Not Found'
      },
      HttpStatus.NOT_FOUND,
    );
  }
}