import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reviewer: string;

  @Column()
  job_id: number;

  @Column()
  application_id: number;

  @Column()
  ratings: number;

  @Column()
  review_text: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
