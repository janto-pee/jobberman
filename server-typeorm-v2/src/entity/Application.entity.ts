import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  username: string;

  @Column()
  job_id: number;

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
