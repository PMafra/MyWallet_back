/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as userService from '../services/userService.js';
import { signUpSchema } from '../validations/bodyValidations.js';

const passwordRules = 'A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caracter especial.';

async function signUp(req, res) {
  const isCorrectBody = signUpSchema.validate(req.body);
  if (isCorrectBody.error) {
    if (isCorrectBody.error.details[0].path[0] === 'password') {
      return res.status(400).send(passwordRules);
    }
    return res.status(400).send(isCorrectBody.error.details[0].message);
  }

  const { name, email, password } = req.body;

  try {
    const user = await userService.createUser({ name, email, password });

    if (user === 'already exists') {
      return res.status(409).send('Email já registrado!');
    }

    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

export {
  signUp,
};
