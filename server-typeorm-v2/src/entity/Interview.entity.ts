import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Employer } from './Employer.entity';
import { Applicant } from './Applicants.entity';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Employer)
  @JoinColumn()
  employer: Employer;

  @ManyToMany(() => Applicant)
  @JoinTable()
  applicant: Applicant[];

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
