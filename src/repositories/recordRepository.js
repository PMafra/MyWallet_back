import connection from '../database/database.js';

async function createRecord({ userId, recordsList }) {
  const result = await connection.query(
    'INSERT INTO "records" ("userId", records) VALUES ($1, $2)',
    [userId, JSON.stringify(recordsList)],
  );
  return result;
}

async function selectRecords({ userId }) {
  const result = await connection.query(
    'SELECT * FROM "records" WHERE "userId"=$1 ORDER BY "id" DESC',
    [userId],
  );
  return result;
}

export {
  createRecord,
  selectRecords,
};
