import { readFileSync } from "fs"
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
const obras = await leerObras('./infoObras.json')

console.log(obras)

obras.forEach(({imagen, titulo, descripcion, procedencia, comentario}) => {
    console.log (titulo)

    prisma.obra.create(
        {
        data: {
            titulo: titulo,
            imagen: imagen,
            descripcion: descripcion,
            procedencia: procedencia,
            comentario: comentario
        }
    }
    ).then(res => console.log(res))
        .catch(err => console.log(err))
})


async function leerObras(archivo){
    try {
        const contenido = readFileSync(archivo)
        const obras = JSON.parse(contenido)
        console.log(obras)
        return obras
    }
    catch (error) {
        console.log(error)
    }
}

