import { BaseService } from '@app/base';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserAlreadyExistsException } from '../exceptions/user.exception';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  name = 'users';
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    super(userRepo);
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    // Check if email exists
    const existingEmail = await this.userRepo.findOne({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new UserAlreadyExistsException('email');
    }

    // Check if username exists (extracted from email)
    const userName = data.email.split('@')[0];
    const existingUserName = await this.userRepo.findOne({
      where: { userName },
    });

    if (existingUserName) {
      throw new UserAlreadyExistsException('username');
    }

    return super.create(data);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepo.update(userId, { lastLogin: new Date() });
  }
}
