import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Unique,
  AfterUpdate,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { hashPassword } from '../utils/hashpassword';
import log from '../utils/logger';
import { customAlphabet } from 'nanoid';
import { Auth } from './Auth';

const nanoid = customAlphabet('abcdefghij0123456789', 7);

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  first_name: string;

  @Column()
  hashed_password: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column()
  address2: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ default: nanoid() })
  verificationCode: string;

  @Column({ default: null })
  passwordResetCode: string;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ default: null })
  password_changed_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Auth, (auth) => auth.userId)
  auths: Auth[];

  @BeforeInsert()
  @BeforeUpdate()
  async beforeInsert() {
    try {
      const hash = await hashPassword(this.hashed_password);

      this.hashed_password = hash;
    } catch (e) {
      log.error(e, 'Could not validate password');
      return false;
    }
  }
}
