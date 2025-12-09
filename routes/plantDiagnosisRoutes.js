const express = require("express");
const router = express.Router();
const plantDiagnosisController = require("../controllers/plantDiagnosis");

router.route("/").post(plantDiagnosisController.diagnosePlant);

router.route("/tips").get(plantDiagnosisController.getPlantTips);

module.exports = router;
