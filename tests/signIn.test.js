import '../src/setup.js';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import connection from '../src/database/database.js';
import app from '../src/app.js';

afterAll(() => {
  connection.end();
});

describe('POST /sign-in', () => {
  const randomEmail = `${uuid()}@email.com`;
  const password = 'Pedro123@';
  const hashPassword = bcrypt.hashSync(password, 11);

  beforeEach(async () => {
    await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ('Pedro', '${randomEmail}', '${hashPassword}');
        `);
  });

  afterEach(async () => {
    await connection.query(`
            DELETE FROM users
            WHERE email = '${randomEmail}';
        `);
  });

  it('returns 400 for incorrect body', async () => {
    const result = await supertest(app)
      .post('/sign-in')
      .send({
        email: randomEmail,
      });
    expect(result.status).toEqual(400);
  });

  it('returns 404 for email not registered', async () => {
    const result = await supertest(app)
      .post('/sign-in')
      .send({
        email: `${uuid()}@email.com`,
        password,
      });
    expect(result.status).toEqual(404);
  });

  it('returns 404 for wrong password', async () => {
    const result = await supertest(app)
      .post('/sign-in')
      .send({
        email: randomEmail,
        password: 'Lalala123@',
      });
    expect(result.status).toEqual(404);
  });

  it('returns 200 for sign-in sucess', async () => {
    const result = await supertest(app)
      .post('/sign-in')
      .send({
        email: randomEmail,
        password: 'Pedro123@',
      });
    expect(result.status).toEqual(200);
  });
});
