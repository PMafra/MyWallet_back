/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as recordService from '../services/recordService.js';

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

export {
  listRecords,
};
