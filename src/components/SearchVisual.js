import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./GetToken";

const VisualSearch = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileSelected(true);
  };

  const handleCancel = () => {
    setFile(null);
    setUploaded(false);
    setUploadedImageUrl(null);
    setProducts([]);
  };

  const handleGoBack = () => {
    setUploaded(false);
    setFileSelected(false);
    setProducts([]); // Clear the products
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer?.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileSelected(true);``
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
        params: {
          key: "83ba77030057ec144b6850fd5ad0583e", // Replace with your imgbb API key
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const uploadedImageUrl = response.data.data.url;
        setUploadedImageUrl(uploadedImageUrl);
        setUploaded(true);
        setLoading(true);
        await fetchProducts(uploadedImageUrl);
      } else {
        throw new Error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  const fetchProducts = async (imageUrl) => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://api.inditex.com/pubvsearch/products?image=${imageUrl}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const bodyStyle = {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    height: "75vh",
    margin: 0
  };

  return (
    <div style={bodyStyle}>
      <div className="container">
        {!fileSelected && !uploaded && (
          <div className="upload-container">
            <form onSubmit={handleSubmit} id="uploadForm">
              <label
                htmlFor="fileInput"
                className="drop-area"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="icon">+</div>
                <p>Arrastra tus archivos aquí o haz clic para seleccionar</p>
                <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} />
              </label>
              <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload file'}
              </button>
            </form>
          </div>
        )}
        {fileSelected && !uploaded && (
          <div className="upload-container">
            <p>Archivo seleccionado: {file.name}</p>
            <button onClick={handleCancel}>Cancelar</button>
            <button onClick={handleSubmit} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Subir Archivo'}
            </button>
          </div>
        )}
        {uploaded && (
          <div className="upload-container">
            <p>File uploaded successfully!</p>
            {loading ? (
              <div className="loading">
                Loading...
              </div>
            ) : (
              <>
                {products.length > 0 ? (
                  <div id="products" className="products-container">
                    {products.map((product, index) => {
                    const price = product.price?.value?.current; // Get current price
                    const originalPrice = product.price?.value?.original; // Get original price
                    const currency = product.price?.currency; // Get currency

                    return (
                        <li key={index} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                            <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold", color: "blue", textDecoration: "none" }}>
                                {product.name || "No Name"},
                            </a> -  
                            {price ? ` ${price} ${currency}` : " No Price"}
                            {originalPrice && originalPrice !== price ? (
                                <span style={{ textDecoration: "line-through", marginLeft: "10px", color: "gray" }}>
                                    {originalPrice} {currency}
                                </span>
                            ) : null}
                        </li>
                    );
                })}
                  </div>
                ) : (
                  <div className="no-products">
                    No products similar
                  </div>
                )}
              </>
            )}
            <button onClick={handleGoBack}>Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualSearch;