import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import { Routes } from './routes';
import deserializeUser from './middleware/deserializeUser';
import config from 'config';
// import { User } from './entity/User.entity';

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(deserializeUser);

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: NextFunction) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next,
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined,
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        },
      );
    });

    // setup express app here
    // ...

    // start express server
    const port = config.get<number>('port');
    app.listen(port);

    // insert new users for test
    // await AppDataSource.manager.save(
    //   AppDataSource.manager.create(Auth, {
    //     userId: 'Timber',
    //     user_agent: ""
    //     age: 27,
    //   }),
    // );

    // await AppDataSource.manager.save(
    //   AppDataSource.manager.create(User, {
    //     username: 'laka4',
    //     first_name: 'laka4',
    //     hashed_password: 'abcd',
    //     last_name: 'bosch',
    //     email: 'lakabosch@gmail.com4',
    //     address: 'address name',
    //     address2: '',
    //     city: 'cityname',
    //     country: 'country name',
    //   }),
    // );
    // AppDataSource.manager.create(Auth, {
    //   userId: user,
    //   user_agent: '',
    //   age: 27,
    // });

    console.log(
      `Express server has started on port 3000. Open http://localhost:${port}/api/users to see results`,
    );
  })
  .catch((error) => console.log(error));
