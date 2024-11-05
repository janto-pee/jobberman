import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Job } from './Job.entity';
import { FineGrainedSalary } from './FineGrained.entity';
import { TaskBased } from './TaskBased.entity';

@Entity()
export class Salary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Job)
  @JoinColumn()
  job: Job;

  @Column()
  currency: string;

  @Column()
  maximumMinor: string;

  @Column()
  minimumMinor: string;

  @Column()
  period: string;

  @OneToOne(() => FineGrainedSalary)
  @JoinColumn()
  finegrained: FineGrainedSalary;

  @OneToOne(() => TaskBased)
  @JoinColumn()
  taskBased: TaskBased;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
