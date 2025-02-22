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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileSelected(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    setFileSelected(true);
  };

  const handleCancel = () => {
    setFile(null);
    setFileSelected(false);
  };

  const handleGoBack = () => {
    setUploaded(false);
    setFileSelected(false); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file); // Make sure backend expects "file"

      // Upload file
      const uploadResponse = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.status === 200) {
        const uploadedImageUrl = uploadResponse.data.fileUrl; // Adjust according to backend response
        await fetchProducts(uploadedImageUrl);
        setFile(null);
        setUploaded(true);
        setFileSelected(false);
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
        `https://cors-anywhere.herokuapp.com/https://api-sandbox.inditex.com/pubvsearch-sandbox/products?image=${imageUrl}`,
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
                <input type="file" id="fileInput"  accept="image/*" onChange={handleFileChange} />
              </label>
              <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Subir Archivo'}
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
            {products.length > 0 && (
              <div id="products" className="products-container">
                {products.map((product, index) => (
                  <div key={index}>
                    <h3>{product.name}</h3>
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleGoBack}>Go Back</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VisualSearch;