import express from "express"
const router = express.Router();

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

router.get('/buscar', async (req, res)=>{   ///obras/buscar
    const busqueda = req.query.busqueda
    const resultados = await prisma.obra.findMany({
        where:{
          comentario: {
              search: busqueda
          }
        },

        orderBy: {
            _relevance: {
                fields: ['titulo', 'descripcion', 'comentario'],
                search: busqueda,
                sort: 'desc'
            },
        },
        take: 3
    },
    )
    const resultadosFormateados = resultados.map(item => ({
        ...item,
        comentario: item.comentario ? item.comentario.slice(0, 300) + "..." : ""
    }));

    try {

        res.render('resultados.njk', {resultados: resultadosFormateados || {}})    // ../views/resultados.njk
    } catch (err) {
        console.error(err)
        res.status(500).send({err}) // o usar una página de error personalizada
    }
})
export default router