import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';
import { User } from './src/entity/User.entity';
import { Auth } from './src/entity/Auth.entity';
import { Applicant } from './src/entity/Applicants.entity';
import { Application } from './src/entity/Application.entity';
import { Employer } from './src/entity/Employer.entity';
import { FineGrainedSalary } from './src/entity/FineGrained.entity';
import { Interview } from './src/entity/Interview.entity';
import { Job } from './src/entity/Job.entity';
import { Location } from './src/entity/Location.entity';
import { Message } from './src/entity/Messages.entity';
import { Metadata } from './src/entity/Metadata.entity';
import { Notification } from './src/entity/Notifications.entity';
import { Probation } from './src/entity/Probation.entity';
import { Rating } from './src/entity/Ratings.entity';
import { Salary } from './src/entity/Salary.entity';
import { Session } from './src/entity/Sessions.entity';
import { TaskGrained } from './src/entity/TaskGrained.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: config.get<number>('dbPort'),
  username: config.get<string>('dbUsername'),
  password: config.get<string>('dbPassword'),
  database: config.get<string>('database'),
  synchronize: true,
  logging: false,
  entities: [
    User,
    Auth,
    Applicant,
    Application,
    Employer,
    FineGrainedSalary,
    Interview,
    Job,
    Location,
    Message,
    Metadata,
    Notification,
    Probation,
    Rating,
    Salary,
    Session,
    TaskGrained,
  ],
  migrations: ['src/migrations/*{.ts,.js}'],
  subscribers: [],
});
