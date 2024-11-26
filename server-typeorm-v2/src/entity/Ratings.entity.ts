import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToMany(() => Applicant)
  // @JoinTable()
  // applicants: Applicant[];

  // @ManyToMany(() => Job)
  // @JoinTable()
  // jobs: Job[];

  @Column()
  ratings: number;

  @Column()
  review_text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
