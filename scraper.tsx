import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Función que obtiene las imágenes de una URL y las guarda en el sistema de archivos
export const getImages = async (url: string): Promise<string[]> => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // Buscar todas las etiquetas <img> y obtener el atributo src
    const images: string[] = [];
    const downloadPromises: Promise<void>[] = [];
    
    $('img').each((index, element) => {
      const imgSrc = $(element).attr('src');
      if (imgSrc) {
        // Si la URL de la imagen es relativa, convertirla a absoluta
        const absoluteUrl = imgSrc.startsWith('http') ? imgSrc : new URL(imgSrc, url).href;
        images.push(absoluteUrl);
        
        // Descargar la imagen y guardarla en el sistema de archivos
        const downloadPromise = axios({
          url: absoluteUrl,
          responseType: 'stream'
        }).then(response => {
          const filePath = path.join(__dirname, 'downloads', path.basename(absoluteUrl));
          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);
          return new Promise<void>((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
        }).catch(error => {
          console.error(`Error al descargar la imagen ${absoluteUrl}:`, error);
        });
        
        downloadPromises.push(downloadPromise);
      }
    });

    // Esperar a que todas las imágenes se descarguen
    await Promise.all(downloadPromises);

    return images;
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    return [];
  }
};