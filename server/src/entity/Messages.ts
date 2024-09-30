import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender_username: string;

  @Column()
  reciever_username: string;

  @Column()
  content: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
