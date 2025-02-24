import { serverSetup } from '..';
import { AppDataSource } from '../../data-source';
import supertest = require('supertest');

describe('user', () => {
  beforeEach(async () => {
    await AppDataSource.initialize();
  });

  /* Closing database connection after each test. */
  afterEach(async () => {
    if (AppDataSource.isInitialized) AppDataSource.destroy();
  });

  describe('user', () => {
    describe('get user route', () => {
      it('should return a 404', async () => {
        const id = '12345';
        await supertest(serverSetup).get(`/api/users/${id}`).expect(400);
      });
    });
  });
});
