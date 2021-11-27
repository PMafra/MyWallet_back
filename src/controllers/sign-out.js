/* eslint-disable no-console */
import connection from '../database/database.js';

async function signOut(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Você não está autorizado a realizar este tipo de ação.');

  try {
    const logOut = await connection.query(`
            DELETE FROM sessions
            WHERE token = $1
        `, [token]);

    if (logOut.rowCount === 0) {
      return res.status(404).send('Esta sessão não existe ou já foi terminada!');
    }

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export default signOut;
