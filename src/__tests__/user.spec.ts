import { serverSetup } from '..';
import { TestDataSource } from '../../data-source-test';
import supertest = require('supertest');

describe('user', () => {
  beforeEach(async () => {
    await TestDataSource.initialize();
  });

  /* Closing database connection after each test. */
  afterEach(async () => {
    if (TestDataSource.isInitialized) TestDataSource.destroy();
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
