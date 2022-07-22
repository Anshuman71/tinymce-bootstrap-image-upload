const express = require("express");
const server = express();
const PORT = 8080;
const multer = require("multer");
const { nanoid } = require("nanoid");

// serve HTML file from /public folder at "/" path
server.use(express.static("public"));

// serve the uploaded images from ./images folder at "./images" path
server.use("/images", express.static("images"));

// configure storage options for multer
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images"); // relative path to storage location
  },
  filename: (req, file, cb) => {
    // get the file extension from mimetype
    const fileExtension = file.mimetype.split("/")[1];
    // create a unique file name using 10 random characters joined with time in milliseconds
    const uniqueFileName = `${nanoid(10)}-${Date.now()}.${fileExtension}`;
    cb(null, uniqueFileName);
  },
});

// initialize multer with the storage engine configuration
const upload = multer({ storage: fileStorageEngine });

// handle image upload using multer and return the `imageUrl` as response
server.post("/upload-image", upload.single("image"), (request, response) => {
  response.send({
    imageUrl: `${request.headers.origin}/${request.file.path}`,
  });
});

// start the server at http://localhost:{PORT}
server.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});
