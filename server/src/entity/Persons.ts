import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Person {
  @Column()
  username: string;

  @Column()
  hashed_pasword: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  address2: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  is_email_verified: boolean;

  @Column()
  pasword_changed_at: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
