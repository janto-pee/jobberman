import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class InterviewApplicant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  interviewId: string;

  @Column()
  ApplicantUsername: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
