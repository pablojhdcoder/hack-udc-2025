import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./GetToken";

const QueryProduct = () => {
    const [query, setQuery] = useState(""); // Default search term
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(
                `https://cors-anywhere.herokuapp.com/https://api.inditex.com/searchpmpa/products?brand=zara&query=${query}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
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

    return (
        <div style={{ textAlign: "center"}}>
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
                                {product.name || "No Name"},
                            </a> -  
                            {price ? `${price} ${currency}` : "No Price"}
                            {originalPrice && originalPrice !== price ? (
                                <span style={{ textDecoration: "line-through", marginLeft: "10px", color: "gray" }}>
                                    {originalPrice} {currency}
                                </span>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default QueryProduct;