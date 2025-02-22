import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Applicant } from './Applicants.entity';
import { Job } from './Job.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Applicant, (applicant) => applicant.application)
  applicant: Applicant;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;

  @Column()
  application_text: string;

  @Column()
  resume: boolean;

  @Column()
  cover_letter: boolean;

  @Column()
  referral_information: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
