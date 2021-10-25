import connection from "../database/database.js";
import { signInSchema } from "../validations/bodyValidations.js"
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const selectUser = 'SELECT * FROM users WHERE email = $1;';
const passwordRules = "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caracter especial.";

async function signIn (req, res) {
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
}

export default signIn;