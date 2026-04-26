const request = require('supertest')
const app = require('../app')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

beforeAll(async () => {
    await prisma.task.deleteMany()
    await prisma.user.deleteMany()
    await request(app).post('/auth/register').send({username: "testuser", password: "testpass"})
    const res = await request(app).post('/auth/login').send({username: "testuser", password: "testpass"})
    token = res.text
})

describe('GET /tasks', () =>{
    it('Must get a 200', async() =>{
        const res = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.status).toBe(200)
    })

    it('Must receive an array', async() =>{
        const res = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`)

        expect(Array.isArray(res.body)).toBe(true)
    })
})

describe('POST /tasks', () =>{
    it('Must create a task with success', async () =>{
        const res = await request(app)
            .post('/tasks')
            .send({titulo: "Test Task"})
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.status).toBe(200)
        expect(res.body.titulo).toBe("Test Task")
    })

    it('Must return error 400 if there is no content in the JSON', async() =>{
        const res = await request(app)
            .post('/tasks')
            .send({})
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
    })
})

describe('DELETE /tasks/:id', () =>{
    it('Must delete the task with the given id', async () =>{
        const created = await request(app)
            .post('/tasks')
            .send({titulo: 'task to remove'})
            .set('Authorization', `Bearer ${token}`)

        const id = created.body.id
        console.log(id)
        const res = await request(app)
            .delete(`/tasks/${id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
    })

    it('Must return error 400 if there is no id given', async () =>{
        const created = await request(app)
            .post('/tasks')
            .send({titulo: 'task to remove'})
            .set('Authorization', `Bearer ${token}`)
        
        const id = created.body.id
        const res = await request(app).delete(`/tasks/:-1`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(400)
    })
})

describe('UPDATE /tasks/:id', () =>{
    it('Must update the desk with the given id', async () =>{
        const created = await request(app)
            .post('/tasks')
            .send({titulo: 'task to update'})
            .set('Authorization', `Bearer ${token}`)

        const id = created.body.id
        const res = await request(app).put(`/tasks/${id}`)
            .send({titulo: "task updated"})
            .set('Authorization', `Bearer ${token}`)
            
        expect(res.status).toBe(200)
        expect(res.body.titulo).toBe("task updated")
    })

    it('Must return error 404 if the id given is wrong', async () =>{
        const res = await request(app)
            .put('/tasks/99999')
            .send({titulo: 'Novo titulo'})
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(404)
    })

    it('Must return error 400 if there is no content in the JSON', async() =>{
        const res = await request(app)
            .put('/tasks/:id')
            .send({})
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(400)
    })
})