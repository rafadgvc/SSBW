import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

router.get('/login', (req, res)=>{
    res.render('login.njk')
})

router.post('/login', async (req, res)=>{     // viene del formulario de login
    // comprobar las credenciales en la BD:
    const {correo, password} = req.body
    console.log(req.body)
    try {
        const user = await prisma.usuario.findUnique({
            where: {
                correo: req.body.correo,
            }
        })
        const validPassword = await bcryptjs.compare(password, user.password)
        if(validPassword){
            console.log(user)
            const token = jwt.sign({usuario: user.nombre, rol: user.rol}, process.env.SECRET_KEY)
            // pone la cookie con el jwt
            res.locals.usuario = user.nombre
            res.cookie('access_token', token, {
                httpOnly: true,                          // Evita acceso desde JavaScript del cliente
                secure: process.env.IN === 'production', // En producción aseguramos HTTPS
                maxAge: 7200000                          // 2 horas en milisegundos
            }).render('index.njk') // o donde sea
        }
    }catch (err){
        console.log(err)
    }


})

router.get('/logout', (req, res)=>{
    // borrar la cookie:
    //...
    res.render('index.njk') // o donde sea
})

router.post('/register', async (req, res) => {  // viene del formulario de registro
    console.log(req.body)
    const {nombre, correo, password, repassword} = req.body



    const passwordCifrado = await bcryptjs.hash(password, 8)
    try {
        const user = await prisma.usuario.create({
            data: {
                nombre,
                correo,
                password: passwordCifrado,

            }
        })
    }catch (err) {
        console.log(err)
    }
    res.render('login.njk') // o a una bienvenida
})


export default router