import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  street: string;

  @Column()
  street2: string;

  @Column()
  city: string;

  @Column()
  state_province_code: string;

  @Column()
  state_province_name: string;

  @Column()
  postal_code: string;

  @Column()
  country_code: string;

  @Column()
  location: string;

  @Column()
  country: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
