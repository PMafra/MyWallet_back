/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as recordService from '../services/recordService.js';
import { newRecordSchema } from '../validations/bodyValidations.js';

async function listRecords(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.sendStatus(401);

  try {
    const allRecords = await recordService.requireRecords({ token });

    if (!allRecords) {
      return res.status(404).send('Seus registros de entradas e saídas não foram encontrados! Sua sessão provavelmente foi terminada.');
    }

    const allRecordsToSend = JSON.parse(allRecords);
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
    const updateRecords = await recordService.addNewRecord({ token, newRecord });

    if (!updateRecords) {
      return res.status(404).send('O seu id de usuário não foi encontrado! Por favor, verifique se sua sessão foi terminada.');
    }

    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export {
  listRecords,
  sendRecord,
};
