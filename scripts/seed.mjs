import { readFileSync, writeFile } from "fs";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch"; // Necesitarás instalar esto con `npm install node-fetch`
import path from "path";

const prisma = new PrismaClient();
const obras = await leerObras("./infoObras.json");

console.log(obras);

for (const {imagen, titulo, descripcion, procedencia, comentario} of obras) {

    let imagePath = null;

    if (imagen) {
        try {
            imagePath = await descargarImagen(imagen, "./public/images");
        } catch (error) {
            console.error(error);
        }
    }

    prisma.obra.create({
        data: {
            titulo: titulo,
            imagen: imagePath,
            descripcion: descripcion,
            procedencia: procedencia,
            comentario: comentario
        }
    }
    ).then(res => console.log(res))
        .catch(err => console.log(err))
}


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

async function descargarImagen(url, directorio) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al descargar la imagen: ${response.statusText}`);

        const extension = path.extname(new URL(url).pathname) || ".jpg";
        const nombreArchivo = `${Date.now()}${extension}`;
        const rutaCompleta = path.join(directorio, nombreArchivo);

        const buffer = await response.buffer();
        writeFile(rutaCompleta, buffer, (err) => {
            if (err) throw err;
            console.log(`Imagen guardada en ${rutaCompleta}`);
        });

        return `images/${nombreArchivo}`;
    } catch (error) {
        console.error(error);
        return null;
    }
}
