import express from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
const router = express.Router()
const prisma = new PrismaClient()


router.post('/register', async (req, res) => {
    // 1. extrair username e password do body
    const username = req.body.username
    const password = req.body.password
    const saltRounds = 10 //For encryption
    // 2. verificar se existem
    if(!username){
        res.status(400).send({error:"username is missing"})
        return
    }

    if(!password){
        res.status(400).send({error:"password is missing"})
        return
    }
    // 3. fazer hash da password com bcrypt.hash()
    const hash = await bcrypt.hash(password, saltRounds);
    // 4. criar o utilizador no prisma
    try{
        const user = await prisma.user.create({
            data: {
                username: username,
                password: hash
            }
        })
        // 5. responder com sucesso
        res.send({id: user.id, username: user.username})
    } catch(err){
        res.status(500).send({ error: "Something went wrong" })
        return
    }
})

router.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if(!username){
        res.status(400).send({error:"username is missing"})
        return
    }

    if(!password){
        res.status(400).send({error:"password is missing"})
        return
    }

    const user = await prisma.user.findUnique({
        where:{username}
    })

    if (!user) {
        res.status(404).send({error:"Something went wrong"})
        return
    }

    try{
        const passwordMatch = await bcrypt.compare(password, user.password)
    
        if(!passwordMatch){
            res.status(404).send({error:"Something went wrong"})
            return
        }

        const payload = {
            username: user.username,
            userId:   user.id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: '1h'
        })

        res.send(token)
    } catch(err){
        res.status(500).send({ error: "Something went wrong" })
        return
    }
})

//Middleware
function verifyToken(req: Request, res: Response, next: NextFunction) {
    // 1. verificar se o header existe
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' })
    }
    // 2. extrair o token — o header vem assim: "Bearer eyJhbG..."
    //    podes usar authHeader.split(' ')[1] para obter só o token
    const token = authHeader.split(' ')[1]
    // 3. verificar o token com jwt.verify()
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string, userId: number }
        req.user = decoded
        // 4. se válido, chamar next()
        next()
    } catch(err){
        return res.status(403).json({ message: 'Invalid or expired token' })
    }
}

export { router, verifyToken }