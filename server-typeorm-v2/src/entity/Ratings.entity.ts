import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Job } from './Job.entity';
import { Applicant } from './Applicants.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToMany(() => Applicant)
  // @JoinTable()
  // applicants: Applicant[];

  // @ManyToMany(() => Job)
  // @JoinTable()
  // jobs: Job[];

  @Column()
  ratings: number;

  @Column()
  review_text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
