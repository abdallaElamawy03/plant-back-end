const express = require("express");
const router = express.Router();
const soilAnalysisController = require("../controllers/soilAnalysis");

router.route("/").post(soilAnalysisController.analyzeSoil);

module.exports = router;
