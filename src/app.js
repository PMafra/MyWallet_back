import express from 'express';
import cors from 'cors';
import * as userController from './controllers/userController.js';
import * as recordController from './controllers/recordController.js';
import { sendRecord } from './controllers/records.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp);
app.post('/sign-in', userController.signIn);
app.post('/sign-out', userController.signOut);
app.get('/records', recordController.listRecords);
app.post('/records', sendRecord);

export default app;
