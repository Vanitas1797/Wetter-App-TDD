const config = require('config');
const dbConfig = config.get('database');
const sqlite = require('sqlite3');
const request = require('supertest');
const app = require('../backend/app');
const fs = require('fs');
// const user = require('../backend/routes/user');
// const createHttpError = require('http-errors');

let db = new sqlite.Database(dbConfig.storage);

const testDbQueries = {
  afterDeleteAUser: fs
    .readFileSync('tests/queries/afterDeleteAUser.sql')
    .toString(),
  afterAllTestsHaveRunValues: fs
    .readFileSync('tests/queries/afterAllTestsHaveRunValues.sql')
    .toString(),
  afterAllTestsHaveRunTables: fs
    .readFileSync('tests/queries/afterAllTestsHaveRunTables.sql')
    .toString(),
};

const manyFavorites = {
  userId: 2,
  username: 'hasManyFavorites',
  email: 'hasManyFavorites@test.test',
  password: 'right',
};
const oneUser = {
  userId: 4,
  username: 'exist',
  email: 'exist@test.test',
  password: 'right',
};
const oneUserToDelete = {
  userId: 6,
  username: 'oneUserToDelete',
  email: 'oneUserToDelete@test.test',
  password: 'right',
};
const oneUserToRegister = {
  userId: 5,
  username: 'oneUserToRegister',
  email: 'oneUserToRegister@test.test',
  password: 'right',
};
const noUser = {
  userId: 7,
  username: 'notExist',
  email: 'notExist@test.test',
  password: 'right',
};

function hasDuplicates(value, key) {
  let obj = {};
  for (const object of value) {
    obj[object[key]] = (obj[object[key]] || 0) + 1;
  }
  for (const o in obj) {
    if (obj[o] > 1) {
      return true;
    }
  }
  return false;
}

describe('All tests for user endpoint', () => {
  describe('Get all favorite locations of one user', () => {
    it('user exists', async () => {
      const response = await request(app).get(
        `/user/${oneUser.userId}/favorites`
      );
      expect(response.body).not.toContainEqual(
        expect.not.objectContaining({ fk_user_name: oneUser.username })
      );
      expect(response.body.rows.length).toBeGreaterThanOrEqual(1);
      expect(response.status).toBe(200);
    });
    it('user does not exist', async () => {
      const response = await request(app).get(
        `/user/${noUser.userId}/favorites`
      );
      expect(response.status).toBe(404);
    });
    it('user exists and has more than one favorite', async () => {
      const response = await request(app).get(
        `/user/${manyFavorites.userId}/favorites`
      );
      expect(response.body).not.toContainEqual(
        expect.not.objectContaining({ fk_user_name: manyFavorites.username })
      );
      if (response.body.length > 0) {
        expect(hasDuplicates(response.body, 'fk_location_id')).toBe(false);
      }
      expect(response.status).toBe(200);
    });
  });

  describe('Delete a user account', () => {
    // it('if password is not correct', async () => {
    //   const response = await request(app)
    //     .delete(`/user/${oneUserToDelete.username}/account`)
    //     .send({ password: 'wrong' });
    //   expect(response.status).toBe(400);
    // });
    // it('if user not exist', async () => {
    //   const response = await request(app)
    //     .delete(`/user/${noUser.username}/account`)
    //     .send({ password: 'right' });
    //   expect(response.status).toBe(404);
    // });
    // it('if body is not correct', async () => {
    //   const response = await request(app)
    //     .delete(`/user/${oneUserToDelete.username}/account`)
    //     .send({ passwor: 'right' });
    //   expect(response.status).toBe(400);
    // });
    // it('if everything OK', async () => {
    //   const response = await request(app)
    //     .delete(`/user/${oneUserToDelete.username}/account`)
    //     .send({ password: 'right' });
    //   expect(response.status).toBe(200);
    // });
  });

  describe('Register a user', () => {
    it('if a user already exists', async () => {
      const response = await request(app)
        .post(`/user/register`)
        .send(oneUserToRegister);
      expect(response.status).toBe(400);
    });
    it('if a user not exists', async () => {
      const response = await request(app).post(`/user/register`).send(noUser);
      expect(response.status).toBe(200);
    });
    it('if body is not correct', async () => {
      const response = await request(app)
        .post(`/user/register`)
        .send({ wrong: 'wrong' });
      expect(response.status).toBe(400);
    });
  });

  describe('Reset password', () => {
    // it('if current password is not correct', async () => {
    //   const response = await request(app)
    //     .put(`/user/${oneUser.username}/resetPassword`)
    //     .send({
    //       currentPassword: 'wrong',
    //       newPassword: 'newRight',
    //       repeatNewPassword: 'newRight',
    //     });
    //   expect(response.status).toBe(400);
    // });
    // it('if new password repeat is not correct', async () => {
    //   const response = await request(app)
    //     .put(`/user/${oneUser.username}/resetPassword`)
    //     .send({
    //       currentPassword: 'right',
    //       newPassword: 'newRight',
    //       repeatNewPassword: 'newWrong',
    //     });
    //   expect(response.status).toBe(400);
    // });
    // it('if all is correct', async () => {
    //   const response = await request(app)
    //     .put(`/user/${oneUser.username}/resetPassword`)
    //     .send({
    //       currentPassword: 'right',
    //       newPassword: 'newRight',
    //       repeatNewPassword: 'newRight',
    //     });
    //   expect(response.status).toBe(200);
    // });
  });

  describe('Forgot password', () => {
    //   it('if username or email is not correct', async () => {
    //     const response = await request(app)
    //       .get(`/user/forgotPassword`)
    //       .send({ usernameOrEmail: 'wrong' });
    //     expect(response.status).toBe(404);
    //   });
    //   it('if username is correct', async () => {
    //     const response = await request(app)
    //       .get(`/user/forgotPassword`)
    //       .send({ usernameOrEmail: oneUser.username });
    //     expect(response.status).toBe(200);
    //   });
    //   it('if email is correct', async () => {
    //     const response = await request(app)
    //       .get(`/user/forgotPassword`)
    //       .send({ usernameOrEmail: oneUser.email });
    //     expect(response.status).toBe(200);
    //   });
    //   it('after forgot password if all is correct', async () => {
    //     const response = await request(app)
    //       .put(`/user/${oneUser.username}/forgotPassword`)
    //       .send({
    //         newPassword: 'newRight',
    //         repeatNewPassword: 'newRight',
    //       });
    //     expect(response.status).toBe(200);
    //   });
    //   it('after forgot password if new password is not correct', async () => {
    //     const response = await request(app)
    //       .put(`/user/${oneUser.username}/forgotPassword`)
    //       .send({
    //         newPassword: 'newWrong',
    //         repeatNewPassword: 'newRight',
    //       });
    //     expect(response.status).toBe(400);
    //   });
    //   it('after forgot password if new password repeat is not correct', async () => {
    //     const response = await request(app)
    //       .put(`/user/${oneUser.username}/forgotPassword`)
    //       .send({
    //         newPassword: 'newRight',
    //         repeatNewPassword: 'newWrong',
    //       });
    //     expect(response.status).toBe(400);
    //   });
  });
});

describe('All tests for location endpoint', () => {
  describe('get all locations by search', () => {
    it('if all is OK', async () => {
      const response = await request(app).post('/location').send({
        city_name: 'Berlin',
        country_name: '',
        state_name: '',
        zip_code: '',
        latitude: '',
        longitude: '',
        timezone_offset: '',
      });
      expect(response.body.rows.length).toBeGreaterThanOrEqual(1);
      expect(response.status).toBe(200);
    });
  });
});

beforeAll(() => {
  // const tables = testDbQueries.afterAllTestsHaveRunTables.split(';');
  // const inserts = testDbQueries.afterAllTestsHaveRunValues.split(';');
  // db.serialize(() => {
  //   for (let i of inserts) {
  //     let m = i.match(/"(/w+)"/);
  //     if (m) {
  //       db.run(`delete from ${m[1]}`);
  //       db.run(i);
  //     }
  //   }
  // });
  fs.copyFileSync(
    `backend/database/db/wetter-app-test-copy.db`,
    `backend/database/db/wetter-app-test.db`
  );
});
