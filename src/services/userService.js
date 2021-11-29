/* eslint-disable import/prefer-default-export */
import bcrypt from 'bcrypt';
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
  const userId = newUser.id;

  await recordRepository.createRecord({ userId, recordsList: [] });

  return true;
}

export {
  createUser,
};
