import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Company } from './Company.entity';
import { Employer } from './Employer.entity';
import { Application } from './Application.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employer, (employer) => employer.jobs)
  employer: Employer;

  @ManyToOne(() => Company, (company) => company.jobs)
  company: Company;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  description: string;

  @Column()
  qualification: string;

  @Column()
  complimentary_qualification: string;

  @Column()
  job_type: string;

  @Column()
  visa_sponsorship: string;

  @Column()
  remote_posible: string;

  @Column()
  preferred_timezones: string;

  @Column()
  location: string;

  @Column()
  salary: string;

  @Column()
  date_posted: string;

  @Column()
  relocation: string;

  @Column()
  skills: string;

  @Column()
  employer_hiring_contact: string;

  @Column()
  probationaryPeriod: string;

  @Column()
  hasProbationaryPeriod: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
