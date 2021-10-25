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

const notAuthorized = "Você não está autorizado a realizar este tipo de ação.";
const passwordRules = "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caracter especial.";
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])$/;

const signUpSchema = Joi.object().length(3).keys({
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(passwordRegex).required(),
});

const signInSchema = Joi.object().length(2).keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().pattern(passwordRegex).required(),
});

const newRecordSchema = Joi.object().length(4).keys({
    date: Joi.string().pattern(dateRegex).required(),
    description: Joi.string().min(1).max(300).required(),
    value: Joi.number().positive().invalid(0).required(),
    isAddRecord: Joi.valid(true).valid(false).required()
});

const selectUser = 'SELECT * FROM users WHERE email = $1;'
const selectUserRecords = 'SELECT * FROM records JOIN sessions ON sessions."userId" = records."userId" WHERE token = $1;';

app.post('/sign-up', async (req, res) => {

    const isCorrectBody = signUpSchema.validate(req.body);
    if (isCorrectBody.error) {
        if (isCorrectBody.error.details[0].path[0] === "password") {
            return res.status(400).send(passwordRules);
        }
        return res.status(400).send(isCorrectBody.error.details[0].message);
    }

    const { 
        name, 
        email, 
        password 
    } = req.body;

    try {
        const isEmailAlreadyRegistered = await connection.query(selectUser, [email]);
        if (isEmailAlreadyRegistered.rowCount !== 0) {
            return res.status(409).send(`${email} já está registrado!`);
        }

        const hashedPassword = bcrypt.hashSync(password, 11);
        await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ($1, $2, $3);
        `,[name, email, hashedPassword]);

        const newUser = await connection.query(selectUser,[email]);
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

    const isCorrectBody = signInSchema.validate(req.body);
    if (isCorrectBody.error) {
        if (isCorrectBody.error.details[0].path[0] === "password") {
            return res.status(400).send(passwordRules);
        }
        return res.status(400).send(isCorrectBody.error.details[0].message);
    }

    const { 
        email, 
        password: receivedPassword
    } = req.body;

    try {
        const usersTable = await connection.query(selectUser,[email]);

        if(usersTable.rowCount === 0) {
            return res.status(404).send(`${email} não está registrado!`);
        }

        const {
            password,
            name,
            id: userId
        } = usersTable.rows[0];

        if (!bcrypt.compareSync(receivedPassword, password)) {
            return res.status(404).send(`Sua senha está errada!`);
        }

        const token = uuid();

        await connection.query(`
            INSERT INTO sessions ("userId", token)
            VALUES ($1, $2)
        `, [userId, token]);
        
        res.send({token, name});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post('/sign-out', async (req, res) => {

    const token = req.headers['authorization']?.replace('Bearer ', '');
    if(!token) return res.status(401).send(notAuthorized);

    try {
        const logOut = await connection.query(`
            DELETE FROM sessions
            WHERE token = $1
        `,[token]);

        if(logOut.rowCount === 0) {
            return res.status(404).send(`Esta sessão não existe ou já foi terminada!`);
        }

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get('/records', async (req, res) => {

    const token = req.headers['authorization']?.replace('Bearer ', '');
    if(!token) return res.status(401).send(notAuthorized);

    try {
        const allRecords = await connection.query(selectUserRecords, [token]);

        if(allRecords.rowCount === 0) {
            return res.status(404).send(`Seus registros de entradas e saídas não foram encontrados! Sua sessão provavelmente foi terminada.`);
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
    if(!token) return res.status(401).send(notAuthorized);

    const isCorrectBody = newRecordSchema.validate(req.body);
    if (isCorrectBody.error) {
        return res.status(400).send(isCorrectBody.error.details[0].message);
    }

    const newRecord = req.body;

    try {
        const recordsTable = await connection.query(selectUserRecords, [token]);

        if(recordsTable.rowCount === 0) {
            return res.status(404).send(`O seu id de usuário não foi encontrado! Por favor, verifique se sua sessão foi terminada.`);
        }

        const {
            userId,
            records
        } = recordsTable.rows[0];

        const previousRecords = JSON.parse(records);

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