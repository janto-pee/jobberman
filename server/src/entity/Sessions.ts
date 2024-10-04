import { Entity, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Session {
  @Column()
  id: number;

  @Column()
  username: string;

  @Column()
  refresh_token: string;

  @Column()
  user_agent: string;

  @Column()
  client_ip: string;

  @Column()
  valid: boolean;

  @Column()
  is_blocked: boolean;

  @Column()
  expires_at: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
