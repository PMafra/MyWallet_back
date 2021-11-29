import * as recordRepository from '../repositories/recordRepository.js';

async function requireRecords({ token }) {
  const recordsObject = await recordRepository.selectRecords({ token });

  if (!recordsObject) {
    return null;
  }

  return recordsObject.records;
}

async function addRecord({ userId, value, type }) {
  await recordRepository.createRecord({ userId, value, type });

  return true;
}

export {
  requireRecords,
  addRecord,
};
