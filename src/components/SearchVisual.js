import React, { useState } from "react";
import axios from "axios";
import { getToken } from "./GetToken";

const VisualSearch = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    generatePreviews(selectedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
    generatePreviews(droppedFiles);
  };

  const generatePreviews = (fileList) => {
    const newPreviews = fileList.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file); // Make sure backend expects "file"
      });

      // Upload files
      const uploadResponse = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.status === 200) {
        const uploadedImageUrl = uploadResponse.data.imageUrl; // Adjust according to backend response
        fetchProducts(uploadedImageUrl);
      } else {
        throw new Error("Failed to upload files.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setError("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  const fetchProducts = async (imageUrl) => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `https://api-sandbox.inditex.com/pubvsearch-sandbox/products?image=${imageUrl}`,
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
    height: '100vh',
    margin: 0
  };

  return (
    <div style={bodyStyle}>
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
            <input type="file" id="fileInput" multiple onChange={handleFileChange} />
          </label>
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Subir Archivo'}
          </button>
        </form>
        <div id="preview">
          {previews.map((src, index) => (
            <img key={index} src={src} alt="Preview" className="preview-image" />
          ))}
        </div>
        <div id="products">
          {products.map((product, index) => (
            <div key={index}>
              <h3>{product.name}</h3>
              <img src={product.image} alt={product.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualSearch;