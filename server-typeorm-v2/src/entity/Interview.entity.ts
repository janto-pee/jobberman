import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Employer } from './Employer.entity';
import { Applicant } from './Applicants.entity';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToMany(() => Employer)
  // @JoinTable()
  // interviewer: Employer[];

  @ManyToMany(() => Applicant)
  @JoinTable()
  interviewee: Applicant[];

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  timezone: string;

  @Column()
  title: string;

  @Column()
  requestMetadata: string;

  @Column()
  languageCode: string;

  @Column()
  countryCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
