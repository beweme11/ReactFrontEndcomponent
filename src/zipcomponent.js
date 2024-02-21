import React from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import JSZip from 'jszip';

const azureStorageConnectionString = "https://interntest.blob.core.windows.net/";
const containerName = "apistorage4";

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnectionString);
  }

  handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const zipFile = files[0];
    await this.uploadFilesToAzure(zipFile);
    console.log("Files uploaded successfully.");
  };

  uploadFilesToAzure = async (zipFile) => {
    const zip = new JSZip();
    await zip.loadAsync(zipFile);

    for (const relativePath in zip.files) {
      const file = zip.files[relativePath];
      if (!file.dir) {
        const blobName = relativePath.replace(/\//g, "_"); // replace '/' with '_' in blob name
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlockBlobClient(blobName);
        await blobClient.uploadData(await file.async("blob"));
      }
    }
  };

  render() {
    return (
      <div>
        <h2>Upload a Zip File</h2>
        <input
          type="file"
          ref={this.fileInputRef}
          onChange={this.handleFileChange}
          accept=".zip"
        />
      </div>
    );
  }
}

export default FileUpload;
