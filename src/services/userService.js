import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import * as userRepository from '../repositories/userRepository.js';
import * as recordRepository from '../repositories/recordRepository.js';

async function createUser({ name, email, password }) {
  const existingUserWithGivenEmail = await userRepository.selectUser({ email });

  if (existingUserWithGivenEmail) {
    return 'already exists';
  }

  const hashedPassword = bcrypt.hashSync(password, 12);
  await userRepository.createUser({ name, email, password: hashedPassword });

  const newUser = await userRepository.selectUser({ email });
  await recordRepository.createRecord({ userId: newUser.id, recordsList: [] });

  return true;
}

async function createUserSession({ email, password }) {
  const user = await userRepository.selectUser({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return null;
  }

  const token = uuid();
  await userRepository.createSession({ userId: user.id, token });

  return {
    token, name: user.name,
  };
}
export {
  createUser,
  createUserSession,
};
