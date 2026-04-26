import express from 'express'
import { PrismaClient } from '@prisma/client'
import { router as authRouter, verifyToken } from './auth'  
const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use('/auth', authRouter)

declare global {
    namespace Express {
        interface Request {
            user?: {
                username: string
                userId: number
            }
        }
    }
}

app.get('/tasks', verifyToken, async (req, res) => {

    if (!req.user) {
        res.status(401).send({ error: "Unauthorized" })
        return
    }
    
    try{
        const tasks = await prisma.task.findMany({
            where: { userId: req.user.userId}
        })
        res.send(tasks)
    } catch (err){  
        res.status(500).send({error: "Something went wrong"})
    }
})

app.post('/tasks', verifyToken, async (req, res) => {
    const body = req.body
    if(!body.titulo){
        res.status(400).send({error: "Title missing"})
        return
    }

    if (!req.user) {
        res.status(401).send({ error: "Unauthorized" })
        return
    }

    try{
        const task = await prisma.task.create({
            data: {
                titulo: body.titulo,
                userId: req.user.userId
            }
        })
        res.send(task)
    } catch (err){
        console.log(err)
        res.status(500).send({error: "Something went wrong"})
    }
})

app.delete('/tasks/:id', verifyToken, async (req,res) =>{
    const id = req.params.id as string
    const id_int = parseInt(id, 10)
    if(isNaN(id_int)){
        res.status(400).send({ error: "Id must not be empty" })
        return
    }
    if (!req.user) {
        res.status(401).send({ error: "Unauthorized" })
        return
    }
    try{
        const task = await prisma.task.delete({
            where: { id: id_int,
                     userId: req.user.userId
            }
        })
        res.send(task)
    } catch (err) {
        const error = err as any
        if (error.code === 'P2025') {
            res.status(404).send({ error: "Task not found" })
            return
        } else {
            res.status(500).send({ error: "Something went wrong" })
        }
    }
})

app.put('/tasks/:id', verifyToken, async (req,res) =>{
    const id = req.params.id as string
    const id_int = parseInt(id, 10)
    if(isNaN(id_int)){
        res.status(400).send({ error: "Id must not be empty" })
        return
    }

    const body = req.body

    if(!body.titulo){
        res.status(400).send({error: "Title missing"})
        return
    }

    if (!req.user) {
        res.status(401).send({ error: "Unauthorized" })
        return
    }

    try{
        const task = await prisma.task.update({
            where: { id: id_int,
                     userId: req.user.userId
             },
            data: { titulo: body.titulo }
        })
        res.send(task)
    } catch (err) {
        const error = err as any
        if (error.code === 'P2025') {
            res.status(404).send({ error: "Task not found" })
            return
        } else {
            res.status(500).send({ error: "Something went wrong" })
        }
    }
})

export default app