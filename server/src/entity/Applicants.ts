import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  applicant_is_active: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
