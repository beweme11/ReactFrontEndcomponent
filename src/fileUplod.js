import React, { useState } from 'react';
import JSZip from 'jszip';
import uploadFileToBlob, { isStorageConfigured } from './azureBlob';

const storageConfigured = isStorageConfigured();

const FileUpload = () => {
  const [fileSelected, setFileSelected] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      setFileSelected(file);
    } else {
      setFileSelected(null);
      alert('Please select a valid zip file.');
    }
  };

  const onFileUpload = async () => {
    setUploading(true);
    try {
      const zip = await JSZip.loadAsync(fileSelected);
      const totalFiles = Object.keys(zip.files).length;
      let uploadedFiles = 0;
  
      for (const entryPath in zip.files) {
        const content = await zip.files[entryPath].async('blob');
        const fileName = zip.files[entryPath].name;
        const newPath = `${fileSelected.name.replace('.zip', '')}/${fileName}`;
        
        
        const contentType = determineContentType(fileName);
  
       
        await uploadFileToBlob(newPath, content, contentType);
  
        uploadedFiles++;
        const uploadProgress = Math.round((uploadedFiles / totalFiles) * 100);
        setProgress(uploadProgress);
      }
      alert('Upload successful!');
    } catch (error) {
      console.error('Error uploading folder:', error);
      alert('Error uploading folder. Please try again.');
    }
    setUploading(false);
    setProgress(0);
    setFileSelected(null);
    setInputKey(Math.random().toString(36));
  };
  
  const determineContentType = (fileName) => {
    const extension = fileName.split('.').pop();
    const determineContentType = (fileName) => {
      const extension = fileName.split('.').pop();
      switch (extension.toLowerCase()) {
        case 'txt':
          return 'text/plain';
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'xml':
          return 'text/xml';
        case 'css':
          return 'text/css';
        case 'pdf':
          return 'application/pdf';
        case 'json':
          return 'application/json';
        case 'html':
          return 'text/html';
        case 'csv':
          return 'text/csv';
        case 'zip':
          return 'application/zip';
        
        // Add more cases as needed for other file types
        default:
          return 'text/plain'; // Default to binary data
      }
    };
    
  };

  const DisplayForm = () => (
    <div>
      <input type="file" accept=".zip" onChange={onFileChange} key={inputKey || ''} />
      <button type="submit" onClick={onFileUpload} disabled={!fileSelected}>
        Upload!
      </button>
    </div>
  );

  return (
    <div>
      <h1>Upload Zip File to Azure Blob Storage</h1>
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && (
        <div>
          <div>Uploading... {progress}%</div>
          <progress value={progress} max="100" />
        </div>
      )}
      <hr />
    </div>
  );
};

export default FileUpload;
