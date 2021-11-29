import express from 'express';
import cors from 'cors';
import * as userController from './controllers/userController.js';
import * as recordController from './controllers/recordController.js';
import auth from './middlewares/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', userController.signUp);
app.post('/sign-in', userController.signIn);
app.post('/sign-out', auth, userController.signOut);
app.get('/records', auth, recordController.listRecords);
app.post('/records', auth, recordController.sendRecord);

export default app;
