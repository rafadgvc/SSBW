import express   from 'express'
import nunjucks  from 'nunjucks'

import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

const IN = process.env.IN || 'development'                                                                    // development o production
const app = express()

nunjucks.configure('views', {                                                                      // directorio 'views' para las plantillas html
    autoescape: true,
    noCache:    IN === 'development',                                                                                // true para desarrollo, sin cache
    watch:      IN === 'development',                                                                                // reinicio con Ctrl-S
    express: app
})
app.set('view engine', 'html')
app.use(express.urlencoded({ extended: true }))  // para poner los parámetros del form en el request
app.use(cookieParser())

import obrasRouter from "./routes/obras.mjs"
app.use("/obras", obrasRouter);
app.use(express.static('public'));

import usuariosRouter from "./routes/usuarios.mjs"
app.use("/usuarios", usuariosRouter);
app.use(express.static('public'));

app.get('/hola', (req, res) => {          // test para el servidor
    res.send('Hola <b>amigos</b> de <b>internet</b>');
});

app.get('/', (req, res) => {               // test plantillas en:
    const saludado = 'Fulanito'
    res.render("index.njk", {saludado})           // ./views/index.html
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en  http://localhost:${PORT} en ${IN}`);
})



//
// // middleware de
// const autentificación = (req, res, next) => {
//     const token = req.cookies.access_token;
//     if (token) {
//         const data = jwt.verify(token, process.env.SECRET_KEY);
//         req.usuario        = data.usuario   // en el request
//         req.rol            = data.rol
//         res.locals.usuario = data.usuario   // en el response para
//         res.locals.rol     = data.rol       // para que se tenga acceso en las plantillas
//         console.log('En el request ', req.usuario, req.rol)
//     }
//     next()
// }
//
// //...
//
// app.use(autentificación)