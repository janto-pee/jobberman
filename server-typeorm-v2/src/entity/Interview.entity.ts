import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  interviewers: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  timezone: string;

  @Column()
  title: string;

  @Column()
  interviewee: string;

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
