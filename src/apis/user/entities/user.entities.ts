import { BaseEntity } from '@app/base';
import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import * as argon2 from 'argon2';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column()
  @Exclude()
  @ApiHideProperty()
  password!: string;

  @Column()
  userName!: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  verifyEmail: boolean;

  @BeforeInsert()
  async beforeInsert() {
    this.password = await argon2.hash(this.password);
    this.userName = this.email.split('@')[0];
  }
}
