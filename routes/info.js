const express = require("express");
const router = express.Router();
const InfosCtrl = require("../controllers/infos");

router.get("/existing-counties", InfosCtrl.existingCounties);

module.exports = router;