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
import { Salary } from './Salary.entity';
import { Applicant } from './Applicants.entity';
import { Probation } from './Probation.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employer, (employer) => employer.jobs)
  employer: Employer;

  @OneToMany(() => Application, (applicantion) => applicantion.job)
  applications: Application[];

  @OneToOne(() => Probation)
  @JoinColumn()
  probation: Probation;

  // @ManyToOne(() => Company, (company) => company.jobs)
  // company: Company;

  @OneToOne(() => Job)
  @JoinColumn()
  salary: Salary;

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
