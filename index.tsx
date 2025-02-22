import { getImages } from "../src/scraper.tsx";

const url = "https://www.zara.com/es/es/camiseta-basica-slim-fit-p05584361.html?v1=416633319&v2=2443335"; // Cambia esta URL

getImages(url).then((images) => {
  console.log("🔍 Imágenes encontradas:");
  images.forEach((img, index) => console.log(`${index + 1}. ${img}`));
});
