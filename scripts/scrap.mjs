import {chromium} from "playwright"  // se puede usar el que sea, incluso puede hacer videos de como recolecta la info
import {writeFileSync} from "fs"

const browser = await chromium.launch()
const page       = await browser.newPage()

// lista de páginas con enlaces a 'obras-singulares'
const obrasSingulares = [
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=2",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=3",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=4",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=5",
    "https://www.museosdeandalucia.es/web/museoarqueologicodegranada/obras-singulares?p_p_id=101_INSTANCE_GRnu6ntjtLfp&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_count=1&_101_INSTANCE_GRnu6ntjtLfp_delta=6&_101_INSTANCE_GRnu6ntjtLfp_keywords=&_101_INSTANCE_GRnu6ntjtLfp_advancedSearch=false&_101_INSTANCE_GRnu6ntjtLfp_andOperator=true&p_r_p_564233524_resetCur=false&_101_INSTANCE_GRnu6ntjtLfp_cur=6"
]

    // Los métodos de Playwright son asíncronos, devuelven promesas

    const enlacesDeObrasSingulares = []
    const listaInfoParaBD          = []

    for (const pag of obrasSingulares) {
        const urls = await recuperaUrlsDe(pag)
        enlacesDeObrasSingulares.push(...urls)  // ... operador spread ES6
    }
    console.log("🚀 Hay ", enlacesDeObrasSingulares.length, ' páginas con obras singulares')

    for (const url of enlacesDeObrasSingulares) {
        const infoObra = await recuperaInfoDe(url)
        listaInfoParaBD.push(infoObra)
    }

    guardaEnDisco('infoObras.json', listaInfoParaBD)

    await browser.close();

async function recuperaUrlsDe(pag) {
    const pags = []
    await page.goto(pag)
    const locators = page.locator('.descripcion > a')
    for (const locator of await locators.all()) {
        pags.push(await locator.getAttribute('href'))
    }
    return pags
}

async function recuperaInfoDe(url) {

    await page.goto(url)

    try {

        // locators
        const locatorTitulo = await page.locator("h3.header-title").textContent();
        const locatorDescripcion = await page.locator(".detalle .body-content").nth(0).textContent();
        const locatorProcedencia = await page.locator(".detalle .body-content").nth(1).textContent();
        const locatorComentario = await page.locator(".detalle .body-content").nth(2).textContent();
        const locatorImagen = await page.locator(".wrapper-gallery figure a img").getAttribute("src");


        return {
            titulo: locatorTitulo ? locatorTitulo.trim() : "No encontrado",
            descripcion: locatorDescripcion ? locatorDescripcion.trim() : "No encontrado",
            procedencia: locatorProcedencia ? locatorProcedencia.trim() : "No encontrado",
            comentario: locatorComentario ? locatorComentario.trim() : "No encontrado",
            imagen: locatorImagen ? `https://www.museosdeandalucia.es${locatorImagen}` : "No encontrado"
        }
    } catch (err){
        console.error(err)
        return null
    }
}

function guardaEnDisco(nombreArchivo, datos) {
    try {
        writeFileSync(nombreArchivo, JSON.stringify(datos, null, 2), "utf-8");
        console.log('Archivo guardado correctamente: ' + nombreArchivo);
    } catch (err) {
        console.error(err);
    }
}

