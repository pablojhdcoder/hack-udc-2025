import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "./GetToken";


const QueryProduct = () => {
    const [query, setQuery] = useState(""); // Default search term
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [images, setImages] = useState({}); // Using an object to store images by index

    const iOSUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1";

    const fetchProducts = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://api.inditex.com/searchpmpa/products?query=${query}&perPage=5`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'User-Agent': iOSUserAgent,
                    },
                }
            );
            setProducts(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to fetch products. Check console for details.");
        }
    };

    const fetchImagesForProduct = async (url, index) => {
         try {
             const iOSUserAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36";
             const browser = await puppeteer.launch({
               headless: true,
               executablePath: '/usr/bin/chromium-browser', // Update this path to the location of your Chromium executable
               args: [
                 '--no-sandbox',
                 '--disable-setuid-sandbox',
                 '--disable-web-security',
                 '--disable-features=IsolateOrigins',
                 '--disable-site-isolation-trials'
               ],
               devtools: true, 
               defaultViewport: { hasTouch: true, isMobile: true, height: 1080, width: 1920, },
            });
            const images = await page.evaluate(() => {
                const imgElements = document.querySelectorAll('img');
                const imgUrls = [];
                imgElements.forEach((img) => {
                    const src = img.getAttribute('src');
                    if (src) {
                        imgUrls.push(src);
                    }
                });
                return imgUrls;
            });
        
            await browser.close();
            setImages(prevImages => ({ ...prevImages, [index]: images }));
            console.log("🔍 Imágenes encontradas:", images);
        } catch (err) {
            console.error("Error fetching images:", err);
            setError("Failed to fetch images. Check console for details.");
        }
    };

    useEffect(() => {
        products.forEach((product, index) => {
            fetchImagesForProduct(product.link, index);
        });
    }, [products]);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Product Search</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter product name..."
                style={{ padding: "8px", fontSize: "16px", marginRight: "10px" }}
            />
            <button onClick={fetchProducts} style={{ padding: "8px 16px", fontSize: "16px" }}>
                Search
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
                {products.map((product, index) => {
                    const price = product.price?.value?.current; // Get current price
                    const originalPrice = product.price?.value?.original; // Get original price
                    const currency = product.price?.currency; // Get currency

                    return (
                        <li key={index} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                            <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold", color: "blue", textDecoration: "none" }}>
                                {product.name || "No Name"}
                            </a> -  
                            {price ? `${price} ${currency}` : "No Price"}
                            {originalPrice && originalPrice !== price ? (
                                <span style={{ textDecoration: "line-through", marginLeft: "10px", color: "gray" }}>
                                    {originalPrice} {currency}
                                </span>
                            ) : null}

                            {/* Display images once fetched */}
                            {images[index] && images[index].length > 0 && (
                                <div>
                                    <h4>Images:</h4>
                                    {images[index].map((imgSrc, imgIndex) => (
                                        <img key={imgIndex} src={imgSrc} alt={`Product ${index} Image ${imgIndex}`} style={{ width: "100px", margin: "5px" }} />
                                    ))}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default QueryProduct;
