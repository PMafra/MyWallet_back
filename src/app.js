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

        const newUser = await connection.query(`
            SELECT id FROM users
            WHERE email = $1;
        `,[email]);

        const userId = newUser.rows[0].id;

        await connection.query(`
            INSERT INTO records
            ("userId", records)
            VALUES ($1, $2);
        `,[userId, JSON.stringify([])]);

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

    if(!token) return res.status(401).send("You are not authorized to do this type of action");

    try {

        const allRecords = await connection.query(`
            SELECT records FROM records
            JOIN sessions
                ON sessions."userId" = records."userId"
            WHERE token = $1;
        `, [token]);

        if(allRecords.rowCount === 0) {
            return res.status(404).send(`User records have not been found!`);
        }

        const allRecordsToSend = JSON.parse(allRecords.rows[0].records);

        res.send(allRecordsToSend);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post('/records', async (req, res) => {

    const token = req.headers['authorization']?.replace('Bearer ', '');

    if(!token) return res.status(401).send("You are not authorized to do this type of action");

    const newRecord = req.body;

    try {

        const recordsTable = await connection.query(`
            SELECT * FROM records
            JOIN sessions
                ON sessions."userId" = records."userId"
            WHERE token = $1;
        `, [token]);

        if(recordsTable.rowCount === 0) {
            return res.status(404).send(`User id have not been found!`);
        }

        const userId = recordsTable.rows[0].userId;
        const previousRecords = JSON.parse(recordsTable.rows[0].records);

        const updatedRecords = JSON.stringify([
            ...previousRecords,
            newRecord
        ]);

        await connection.query(`
            UPDATE records
            SET records = '${updatedRecords}'
            WHERE "userId" = $1;
        `, [userId]);

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(APP_PORT);