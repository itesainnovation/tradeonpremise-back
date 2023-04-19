const { Router } = require("express");
const routes = Router();
const fs = require("fs");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");

const upload = multer({ dest: "uploads/" });

routes.post("/", upload.single("file"), async (req, res) => {
  const fileName = req.file.filename;
  const blobName = req.file.originalname;
  const filePath = req.file.path;

  try {
    const connectionString =
      "DefaultEndpointsProtocol=https;AccountName=demandaccelerationsa;AccountKey=Nu0CUIurqOPTYcs10+T8rU2FNiqmrZQWoIarMb2X6aHsF3HdxiZQwe0D5nntFpKmej4Vs1jKEbMA+AStWHIsPQ==;EndpointSuffix=core.windows.net";
    const containerName = "images";

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create the container with public access if it doesn't exist
    const response = await containerClient.createIfNotExists({
      access: "blob",
    });

    if (response.succeeded) {
      console.log(`Container "${containerName}" created with public access.`);
    } else {
      console.log(`Container "${containerName}" already exists.`);
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const stream = fs.createReadStream(filePath);
    const uploadResponse = await blockBlobClient.uploadStream(stream);

    const blobUrl = `https://${blobServiceClient.accountName}.blob.core.windows.net/${containerName}/${blobName}`;

    console.log("File uploaded successfully!", blobUrl);

    console.log("uploadResponse", uploadResponse.isServerEncrypted);

    uploadResponse.isServerEncrypted &&
      fs.unlink(filePath, async (err) => {
        console.log("fileeename", fileName);
        if (err) throw err;
        console.log(`${fileName} deleted correctly!`);
      });

    res.status(200).json(blobUrl);
  } catch (error) {
    console.error("An error occurred while uploading the file:", error);
    res.status(500).send("An error occurred while uploading the file.");
  }
});

module.exports = routes;
