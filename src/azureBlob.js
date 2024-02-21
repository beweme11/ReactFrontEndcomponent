// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
import { BlobServiceClient } from '@azure/storage-blob';

const sasToken = process.env.storagesastoken || "?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-02-20T17:26:23Z&st=2024-02-20T09:26:23Z&spr=https,http&sig=ws7YEf8Eb5VYOY7Ya0dH1zACm%2FDgshNBOnPl6Iul318%3D"; // Fill string with your SAS token
const containerName = `storage1`;
const storageAccountName = process.env.storageresourcename || "anonymousacess"; // Fill string with your Storage resource name

export const isStorageConfigured = () => {
  return !((!storageAccountName || !sasToken));
};


const createBlobInContainer = async (containerClient, filePath, fileContent, contentType) => {
  const blobClient = containerClient.getBlockBlobClient(filePath);

  // upload file
  await blobClient.uploadData(fileContent, {
    blobHTTPHeaders: {
      blobContentType: contentType 
    }
  });
};


const uploadFileToBlob = async (filePath, fileContent, contentType) => {
  if (!filePath || !fileContent) return;

  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  const containerClient = blobService.getContainerClient(containerName);

  // upload file
  await createBlobInContainer(containerClient, filePath, fileContent, contentType);
};

// </snippet_uploadFileToBlob>

export default uploadFileToBlob;
