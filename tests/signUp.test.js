import app from "../src/app.js"
import supertest from 'supertest';
import connection from "../src/database/database.js";
import { v4 as uuid } from "uuid";

afterAll(() => {
    connection.end();
});

describe("POST /sign-up", () => {

    const randomEmail = `${uuid()}@email.com`;

    beforeAll(async () => {
        await connection.query(`
            INSERT INTO users
            (name, email, password)
            VALUES ('Pedro', '${randomEmail}', 'Pedro123@');
        `)
    })

    afterAll(async () => {
        await connection.query(`
            DELETE FROM users
            WHERE email = '${randomEmail}';
        `)
    })

    it('returns 400 for incorrect body', async () => {
        const result = await supertest(app)
        .post("/sign-up")
        .send({
            name: "Matheus",
            email: "matheus@email.com",
            password: "oi"
        });
        expect(result.status).toEqual(400);
    })

    it('returns 409 for email already registered', async () => {
        const result = await supertest(app)
        .post("/sign-up")
        .send({
            name: "PedroSegundo",
            email: randomEmail,
            password: "PedroSegundo123@"
        })
        expect(result.status).toEqual(409);
    })

    it('returns 201 for signing up sucess', async () => {
        const result = await supertest(app)
        .post("/sign-up")
        .send({
            name: "PedroTerceiro",
            email: `${uuid()}@email.com`,
            password: "PedroTerceiro123@"
        })
        expect(result.status).toEqual(201);
    })
})
