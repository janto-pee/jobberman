import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class FineGrainedSalary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  totalSalaryMinor: string;

  @Column()
  workingHours: number;

  @Column()
  totalOvertimeHours: number;

  @Column()
  statutoryOvertimeHours: number;

  @Column()
  fixedOvertimeSalaryMinor: string;

  @Column()
  fixedOvertimePay: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
