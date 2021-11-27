import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import app from '../../src/app.js';
import connection from '../../src/database/database.js';

afterAll(() => {
  connection.end();
});

describe('POST /records', () => {
  const userId = 999999999;
  const token = uuid();

  beforeAll(async () => {
    await connection.query(`
            INSERT INTO sessions
            ("userId", token)
            VALUES (${userId}, '${token}');
        `);
    await connection.query(`
            INSERT INTO records
            ("userId", records)
            VALUES (${userId}, '[]');
        `);
  });

  afterAll(async () => {
    await connection.query(`
            DELETE FROM sessions
            WHERE "userId" = ${userId};
        `);
    await connection.query(`
            DELETE FROM records
            WHERE "userId" = ${userId};
        `);
  });

  it('returns 401 for no token', async () => {
    const result = await supertest(app)
      .post('/records');
    expect(result.status).toEqual(401);
  });

  it('returns 400 for wrong body', async () => {
    const result = await supertest(app)
      .post('/records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '30/300',
        description: 'nada',
        value: 10,
        isAddRecord: true,
      });
    expect(result.status).toEqual(400);
  });

  it('returns 404 for wrong token', async () => {
    const result = await supertest(app)
      .post('/records')
      .set('Authorization', 'Bearer lalala999999')
      .send({
        date: '01/01',
        description: 'nada',
        value: 10,
        isAddRecord: true,
      });
    expect(result.status).toEqual(404);
  });

  it('returns 201 for post records sucess', async () => {
    const result = await supertest(app)
      .post('/records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '01/01',
        description: 'nada',
        value: 10,
        isAddRecord: true,
      });
    expect(result.status).toEqual(201);
  });
});
