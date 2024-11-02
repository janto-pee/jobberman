import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Salary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  currency: string;

  @Column()
  maximumMinor: string;

  @Column()
  minimumMinor: string;

  @Column()
  period: string;

  @Column()
  fineGrainedSalaryInformation: string;

  @Column()
  taskBasedSalaryInformation: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
