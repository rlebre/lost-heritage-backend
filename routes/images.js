const express = require("express");
const router = express.Router();
const ImageUploadController = require("../controllers/images");

router.post("/upload", ImageUploadController.imageUpload);
router.post("/upload-alternative", ImageUploadController.imageUploadBusboy);
router.post("/remove", ImageUploadController.imageRemove);

module.exports = router;
