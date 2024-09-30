import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class VerifyEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  secret_code: string;

  @Column()
  is_used: true;

  @Column()
  expires_at: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
