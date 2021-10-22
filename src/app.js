import express from "express";
import cors from "cors";
import Joi from "joi";
import bcrypt from "bcrypt";

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
            (name, email, password, online)
            VALUES ($1, $2, $3, $4);
        `,[name, email, hashedPassword, false]);

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

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.listen(APP_PORT);