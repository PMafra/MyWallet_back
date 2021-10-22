import express from "express";
import cors from "cors";
import Joi from "joi";

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
            return res.status(403).send(`${isNewEmail.rows[0].email} is already registered!`);
        }

        await connection.query(`
            INSERT INTO users
            (name, email, password, online)
            VALUES ($1, $2, $3, $4);
        `,[name, email, password, false]);

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/users', async (req, res) => {

    try {
        res.send("ok");
    } catch (err) {
        res.sendStatus(500);
    }
});

app.listen(APP_PORT);