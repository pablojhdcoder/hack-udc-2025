import axios from "axios";
import * as cheerio from "cheerio";

export async function getImages(url: string): Promise<string[]> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const images: string[] = [];

    $("img").each((_, img) => {
      const src = $(img).attr("src");
      if (src) images.push(src);
    });

    return images;
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    return [];
  }
}
