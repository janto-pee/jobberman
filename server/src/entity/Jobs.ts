import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employer_id: string;

  @Column()
  title: string;

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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
