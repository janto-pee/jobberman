import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { Company } from './Company.entity';

@Entity()
export class Employer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isActive: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  // @OneToOne(() => Company)
  // @JoinColumn()
  // company: Company;

  // @OneToMany(() => Job, (job) => job.employer)
  // jobs: Job[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
