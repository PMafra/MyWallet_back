/* eslint-disable no-console */
import connection from '../database/database.js';
import { newRecordSchema } from '../validations/bodyValidations.js';

const selectUserRecords = 'SELECT * FROM records JOIN sessions ON sessions."userId" = records."userId" WHERE token = $1;';

async function listRecords(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.sendStatus(401);

  try {
    const allRecords = await connection.query(selectUserRecords, [token]);

    if (allRecords.rowCount === 0) {
      return res.status(404).send('Seus registros de entradas e saídas não foram encontrados! Sua sessão provavelmente foi terminada.');
    }

    const allRecordsToSend = JSON.parse(allRecords.rows[0].records);
    return res.send(allRecordsToSend);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

async function sendRecord(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.sendStatus(401);

  const isCorrectBody = newRecordSchema.validate(req.body);
  if (isCorrectBody.error) {
    return res.status(400).send(isCorrectBody.error.details[0].message);
  }

  const newRecord = req.body;

  try {
    const recordsTable = await connection.query(selectUserRecords, [token]);

    if (recordsTable.rowCount === 0) {
      return res.status(404).send('O seu id de usuário não foi encontrado! Por favor, verifique se sua sessão foi terminada.');
    }

    const {
      userId,
      records,
    } = recordsTable.rows[0];

    const previousRecords = JSON.parse(records);

    const updatedRecords = JSON.stringify([
      ...previousRecords,
      newRecord,
    ]);

    await connection.query(`
            UPDATE records
            SET records = '${updatedRecords}'
            WHERE "userId" = $1;
        `, [userId]);

    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export { listRecords, sendRecord };
