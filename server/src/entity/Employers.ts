import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Employer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  employer_type: string;

  @Column()
  employer_is_active: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
