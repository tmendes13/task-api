const request = require('supertest')
const app = require('../app')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

beforeAll(async () => {
    await prisma.task.deleteMany()
    await prisma.user.deleteMany()
})

describe('POST /auth/register', () => {
    it('Must create a user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({username: "testuser", password: "testpass"})
        expect(res.status).toBe(200)
        expect(res.body.username).toBe("testuser")
    })

    it('Must return an error 400 if there is no username', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({password: "testpass"})
        expect(res.status).toBe(400)
    })

    it('Must return an error 400 if there is no password', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({username: "testuser"})
        expect(res.status).toBe(400)
    })
})

describe('POST /auth/login', () => {
    it('Must login succesfully', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({username: "testuser", password: "testpass"})
        expect(res.status).toBe(200)
        expect(res.text).toMatch(/^eyJ/)
    })

    it('Must must return an error 404 if the password is wrong', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({username: "testuser", password: "password_errada"})
        expect(res.status).toBe(404)
    })

    it('Must must return an error 404 if the username is wrong', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({username: "utilizador_que_nao_existe", password: "testpass"})
        expect(res.status).toBe(404)
    })
})