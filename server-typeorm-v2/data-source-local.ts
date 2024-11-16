import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';
import { User } from './src/entity/User.entity';
import { Auth } from './src/entity/Auth.entity';
import { Address } from './src/entity/Address.entity';
import { Applicant } from './src/entity/Applicants.entity';
import { Employer } from './src/entity/Employer.entity';
import { Application } from './src/entity/Application.entity';
import { Job } from './src/entity/Job.entity';
import { FineGrainedSalary } from './src/entity/FineGrained.entity';
import { Interview } from './src/entity/Interview.entity';
import { Location } from './src/entity/Location.entity';
import { Message } from './src/entity/Messages.entity';
import { Metadata } from './src/entity/Metadata.entity';
import { Notification } from './src/entity/Notifications.entity';
import { Probation } from './src/entity/Probation.entity';
import { Rating } from './src/entity/Ratings.entity';
import { Salary } from './src/entity/Salary.entity';
import { TaskBased } from './src/entity/TaskBased.entity';
import { Company } from './src/entity/Company.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.get<string>('host'),
  port: config.get<number>('dbPort'),
  username: config.get<string>('dbUsername'),
  password: config.get<string>('dbPassword'),
  database: config.get<string>('database'),
  synchronize: true,
  logging: false,
  entities: [
    User,
    Auth,
    Company,
    Address,
    Applicant,
    Employer,
    Application,
    Job,
    FineGrainedSalary,
    Interview,
    Location,
    Message,
    Metadata,
    Notification,
    Probation,
    Rating,
    Salary,
    TaskBased,
  ],
  migrations: ['src/migrations/*{.ts,.js}'],
  subscribers: [],
});
