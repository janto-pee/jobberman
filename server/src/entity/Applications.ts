import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
