const express = require("express");
const router = express.Router();
const uploadControl = require("../controllers/uploadController");

// Middleware do multer para lidar com o upload de um único arquivo
const uploadMiddleware = uploadControl.upload.single("file");

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.post("/upload", uploadMiddleware, uploadControl.uploadFunc);

module.exports = router;