import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import "../assets/hstyles.css"
import VisualSearch from '../components/SearchVisual';

export function Home() {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
        generatePreviews(selectedFiles);
      }
    };
  
    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files);
      setFiles(droppedFiles);
      generatePreviews(droppedFiles);
    };
  
    const generatePreviews = (fileList: File[]) => {
      const newPreviews = fileList.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    };
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setUploading(true);
      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
  
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          alert('Files uploaded successfully!');
        } else {
          alert('Failed to upload files.');
        }
      } catch (error) {
        console.error('Error uploading files:', error);
        alert('Error uploading files. Check console for details.');
      } finally {
        setUploading(false);
      }
    };
    
    return (
      <View>
        <VisualSearch/>
      </View>
    );
};
