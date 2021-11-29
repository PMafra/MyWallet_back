/* eslint-disable no-console */
import * as userService from '../services/userService.js';
import { signUpSchema, signInSchema } from '../validations/bodyValidations.js';

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

async function signIn(req, res) {
  const isCorrectBody = signInSchema.validate(req.body);
  if (isCorrectBody.error) {
    if (isCorrectBody.error.details[0].path[0] === 'password') {
      return res.status(400).send(passwordRules);
    }
    return res.status(400).send(isCorrectBody.error.details[0].message);
  }

  const { email, password } = req.body;

  try {
    const user = await userService.createUserSession({ email, password });

    if (!user?.token) {
      return res.status(404).send('Email ou senha incorretos!');
    }

    return res.send({
      token: user.token,
      name: user.name,
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
}

async function signOut(req, res) {
  const { token } = res.locals;

  try {
    const logOut = await userService.terminateSession({ token });
    console.log(logOut);

    if (!logOut) {
      return res.status(401).send('Esta sessão não existe ou já foi terminada!');
    }

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export {
  signUp,
  signIn,
  signOut,
};
