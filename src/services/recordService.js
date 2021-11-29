import * as recordRepository from '../repositories/recordRepository.js';

async function requireRecords({ token }) {
  const recordsObject = await recordRepository.selectRecords({ token });

  if (!recordsObject) {
    return null;
  }

  return recordsObject.records;
}

async function addNewRecord({ token, newRecord }) {
  const allRecords = await recordRepository.selectRecords({ token });

  if (!allRecords) {
    return null;
  }

  const { userId, records } = allRecords;

  const previousRecords = JSON.parse(records);
  const updatedRecords = JSON.stringify([
    ...previousRecords,
    newRecord,
  ]);

  await recordRepository.updateRecords({ updatedRecords, userId });

  return true;
}

export {
  requireRecords,
  addNewRecord,
};
