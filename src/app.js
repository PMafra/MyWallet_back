import express from 'express';
import cors from 'cors';
import * as userController from './controllers/userController.js';
import signIn from './controllers/sign-in.js';
import signOut from './controllers/sign-out.js';
import { listRecords, sendRecord } from './controllers/records.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp);
app.post('/sign-in', signIn);
app.post('/sign-out', signOut);
app.get('/records', listRecords);
app.post('/records', sendRecord);

export default app;
