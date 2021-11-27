/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import connection from '../database/database.js';
import { signUpSchema } from '../validations/bodyValidations.js';

const selectUser = 'SELECT * FROM users WHERE email = $1;';
const passwordRules = 'A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caracter especial.';

async function signUp(req, res) {
  const isCorrectBody = signUpSchema.validate(req.body);
  if (isCorrectBody.error) {
    if (isCorrectBody.error.details[0].path[0] === 'password') {
      return res.status(400).send(passwordRules);
    }
    return res.status(400).send(isCorrectBody.error.details[0].message);
  }

  const {
    name,
    email,
    password,
  } = req.body;

  try {
    const isEmailAlreadyRegistered = await connection.query(selectUser, [email]);
    if (isEmailAlreadyRegistered.rowCount !== 0) {
      return res.status(409).send(`${email} já está registrado!`);
    }

    const hashedPassword = bcrypt.hashSync(password, 11);
    await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ($1, $2, $3);
        `, [name, email, hashedPassword]);

    const newUser = await connection.query(selectUser, [email]);
    const userId = newUser.rows[0].id;

    await connection.query(`
            INSERT INTO records
            ("userId", records)
            VALUES ($1, $2);
        `, [userId, JSON.stringify([])]);

    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export default signUp;
