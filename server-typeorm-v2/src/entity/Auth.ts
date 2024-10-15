import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  user_agent: string;

  @Column()
  valid: boolean;

  @ManyToOne(() => User, (user) => user.id)
  userId: User;
}
