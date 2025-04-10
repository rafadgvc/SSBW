import express from "express"

const router = express.Router();

import {PrismaClient} from '@prisma/client'
import logger from '../scripts/logger.mjs'


/**
 * @swagger
 * components:
 *   schemas:
 *     usuario:
 *       type: object
 *       required:
 *         - correo
 *         - nombre
 *         - password
 *       properties:
 *         correo:
 *           type: string
 *           description: correo del usuario
 *         nombre:
 *           type: string
 *           description: nombre del usuario
 *         password:
 *           type: string
 *           description: contraseña hasheada del usuario
 *       example:
 *         correo: jesusmartinezgarrido@gmail.com
 *         nombre: Jesus
 *         password: adoighqp4gpoqejrgjwergp8934
 */
router.get('/usuario/:correo', async (req, res) => {
    try {
        const correo = req.params.correo // Capturamos el ID desde los parametros
        logger.debug(`------------------------- GET USER ${correo}`)

        const usuario = await prisma.usuario.findUnique({
            where: {correo}
        })

        if (usuario) {
            res.status(200).json({ok:true, data:correo})
        } else {
            res.status(404).json({ok:false, msg:`${correo} not found`})
        }

    } catch (error) {
        logger.error(`Error en /api/usuario/${correo}`)
        res.status(500).json({ok:false, msg:error})
    }
})


router.get('/obra/cuantas', async (req, res) => {
    try {
        logger.debug(`------------------------- GET /obras/cuantas`)

        const obras = await prisma.obra.count()

        if (obras) {
            res.status(200).json({ok:true, data:obras})
        } else {
            res.status(404).json({ok:false, msg:`No existe ninguna obra`})
        }

    } catch (error) {
        logger.error(`Error en /api/obras/cuantas`)
        res.status(500).json({ok:false, msg:error})
    }
})


export default router;