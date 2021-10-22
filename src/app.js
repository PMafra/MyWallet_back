import express from "express";
import cors from "cors";
import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import connection from "./database/database.js";

const app = express();
app.use(cors());
app.use(express.json());
const APP_PORT = 4000;

app.post('/sign-up', async (req, res) => {

    const { 
        name, 
        email, 
        password 
    } = req.body;

    try {

        const isNewEmail = await connection.query(`
            SELECT email FROM users
            WHERE email = $1;
        `, [email]);

        if (isNewEmail.rowCount !== 0) {
            return res.status(403).send(`${email} is already registered!`);
        }

        const hashedPassword = bcrypt.hashSync(password, 11);

        await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ($1, $2, $3);
        `,[name, email, hashedPassword]);

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post('/sign-in', async (req, res) => {

    const { 
        email, 
        password 
    } = req.body;

    try {
    
        const isEmailRegistered = await connection.query(`
            SELECT * FROM users
            WHERE email = $1 
        `,[email]);

        if(isEmailRegistered.rowCount === 0) {
            return res.status(404).send(`${email} is not registered!`);
        }

        const user = isEmailRegistered.rows[0];

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(404).send(`The password is wrong!`);
        }

        const token = uuid();

        await connection.query(`
            INSERT INTO sessions ("userId", token)
            VALUES ($1, $2)
        `, [user.id, token]);

        res.send(token);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post('/sign-out', async (req, res) => {

    const token = req.headers['authorization']?.replace('Bearer ', '');

    try {
    
        const logOut = await connection.query(`
            DELETE FROM sessions
            WHERE token = $1
        `,[token]);

        if(logOut.rowCount === 0) {
            return res.status(404).send(`You have already been logged out!`);
        }

        res.send(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/records', async (req, res) => {

    const token = req.headers['authorization']?.replace('Bearer ', '');

    try {

        if(!token) return res.status(401).send("You are not authorized to do this type of action");

        const allRecords = await connection.query(`
            SELECT records FROM records
            JOIN sessions
                ON sessions."userId" = records."userId"
            WHERE token = $1;
        `, [token]);

        if(allRecords.rowCount === 0) {
            return res.status(404).send(`User records have not been found!`);
        }

        res.send(allRecords.rows[0].allRecords);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post('/records', async (req, res) => {

    const token = req.headers['authorization']?.replace('Bearer ', '');
    const newRecordString = JSON.stringify(req.body);

    try {

        if(!token) return res.status(401).send("You are not authorized to do this type of action");

        const userId = await connection.query(`
            SELECT "userId" FROM sessions
            WHERE token = $1;
        `, [token]);

        if(userId.rowCount === 0) {
            return res.status(404).send(`User id have not been found!`);
        }

        await connection.query(`
            UPDATE records
            SET records = ${newRecordString}
            WHERE "userId" = $1;
        `, [userId]);

        console.log(allRecords.rows[0].allRecords);

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(APP_PORT);