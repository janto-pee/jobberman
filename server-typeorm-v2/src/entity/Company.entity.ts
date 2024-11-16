import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Job } from './Job.entity';
import { Employer } from './Employer.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_name: string;

  @Column()
  employer_type: string;

  @Column()
  about_us: string;

  @OneToMany(() => Employer, (employer) => employer.company)
  employer: Employer[];

  // @OneToMany(() => Job, (job) => job.company)
  // jobs: Job[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
