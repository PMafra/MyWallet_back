import app from "../src/app.js"
import supertest from 'supertest';
import connection from "../src/database/database.js";
import { v4 as uuid } from "uuid";

afterAll(() => {
    connection.end();
});

describe("POST /sign-out", () => {

    const userId = 999999999;
    const token = uuid();

    beforeAll(async () => {
        await connection.query(`
            INSERT INTO sessions
            ("userId", token)
            VALUES (${userId}, '${token}');
        `)
    })

    it('returns 401 for no token', async () => {
        const result = await supertest(app)
        .post("/sign-out")
        expect(result.status).toEqual(401);
    })

    it('returns 404 for wrong token', async () => {
        const result = await supertest(app)
        .post("/sign-out")
        .set('Authorization', 'Bearer lalala999999')
        expect(result.status).toEqual(404);
    })

    it('returns 200 for sign-out sucess', async () => {
        const result = await supertest(app)
        .post("/sign-out")
        .set('Authorization', `Bearer ${token}`)
        expect(result.status).toEqual(200);
    })
})