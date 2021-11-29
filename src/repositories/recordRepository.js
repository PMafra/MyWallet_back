import connection from '../database/database.js';

async function createRecord({ userId, recordsList }) {
  const result = await connection.query(
    'INSERT INTO "records" ("userId", records) VALUES ($1, $2)',
    [userId, JSON.stringify(recordsList)],
  );
  return result;
}

async function selectRecords({ token }) {
  const result = await connection.query(
    'SELECT * FROM records JOIN sessions ON sessions."userId" = records."userId" WHERE token = $1;',
    [token],
  );
  return result.rows[0];
}

async function updateRecords({ updatedRecords, userId }) {
  const result = await connection.query(
    'UPDATE records SET records = $1 WHERE "userId" = $2;',
    [updatedRecords, userId],
  );
  return result.rows[0];
}

export {
  createRecord,
  selectRecords,
  updateRecords,
};
