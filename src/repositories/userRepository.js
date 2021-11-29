import connection from '../database/database.js';

async function createUser({ name, email, password }) {
  const result = await connection.query(
    'INSERT INTO "users" ("name", "email", "password") VALUES ($1, $2, $3)',
    [name, email, password],
  );

  return result;
}

async function selectUser({ email }) {
  const result = await connection.query(
    'SELECT * FROM "users" WHERE "email"=$1',
    [email],
  );

  return result.rows[0];
}

async function createSession({ userId, token }) {
  const result = await connection.query(
    'INSERT INTO "sessions" ("userId", "token") VALUES ($1, $2)',
    [userId, token],
  );

  return result;
}

async function deleteSession({ token }) {
  const result = await connection.query(
    'DELETE FROM sessions WHERE token = $1',
    [token],
  );

  return result.rowCount;
}

export {
  createUser,
  selectUser,
  createSession,
  deleteSession,
};
