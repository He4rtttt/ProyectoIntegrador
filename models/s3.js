// models/s3.js
require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Configura las credenciales de AWS
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Subir un archivo a S3
const uploadFile = async (filePath, bucketName) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: bucketName,
      Key: path.basename(filePath),
      Body: fileContent
      
    };

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${path.basename(filePath)}`;
    console.log(`File uploaded successfully. ${fileUrl}`);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Descargar un archivo de S3
const downloadFile = async (fileName, bucketName, downloadPath) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName
    };

    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    const fileStream = fs.createWriteStream(downloadPath);
    data.Body.pipe(fileStream);
    fileStream.on('close', () => {
      console.log("Archivo subido exitosamente");
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

module.exports = { uploadFile, downloadFile };