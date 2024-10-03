import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import bcrypt from "bcrypt";
import config from "config";
import log from "../utils/logger";

@Entity()
export class Person {
  @Column()
  username: string;

  @Column()
  hashed_password: string;

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
  verificationCode: string;

  @Column()
  passwordResetCode: string;

  @Column()
  is_email_verified: boolean;

  @Column()
  pasword_changed_at: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @BeforeInsert()
  async beforeInsert() {
    try {
      const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

      const hash = await bcrypt.hashSync(this.hashed_password, salt);

      this.hashed_password = hash;
    } catch (e) {
      log.error(e, "Could not validate password");
      return false;
    }
  }
}
