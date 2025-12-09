const asyncHandler = require("express-async-handler");

// @desc Analyze soil sample using AI simulation
// @route POST /ai/soil-analysis
// @access Public
const analyzeSoil = asyncHandler(async (req, res) => {
  const { image, location, sampleDepth } = req.body;

  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate dummy soil analysis data
  const soilTypes = ["Clay", "Sandy", "Loamy", "Silty", "Peaty", "Chalky"];
  const healthStatus = ["Excellent", "Good", "Fair", "Poor"];

  const randomSoilType =
    soilTypes[Math.floor(Math.random() * soilTypes.length)];
  const randomHealth =
    healthStatus[Math.floor(Math.random() * healthStatus.length)];

  const dummyAnalysis = {
    success: true,
    analysisId: `SA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    soilType: randomSoilType,
    healthStatus: randomHealth,
    properties: {
      ph: {
        value: (5.5 + Math.random() * 3).toFixed(1),
        status: Math.random() > 0.3 ? "Optimal" : "Needs Adjustment",
        recommendation: "Add lime to increase pH",
      },
      nitrogen: {
        level: (10 + Math.random() * 80).toFixed(1),
        unit: "mg/kg",
        status: Math.random() > 0.5 ? "Sufficient" : "Low",
        recommendation: "Apply nitrogen-rich fertilizer",
      },
      phosphorus: {
        level: (5 + Math.random() * 45).toFixed(1),
        unit: "mg/kg",
        status: Math.random() > 0.5 ? "Sufficient" : "Moderate",
        recommendation: "Monitor levels regularly",
      },
      potassium: {
        level: (80 + Math.random() * 120).toFixed(1),
        unit: "mg/kg",
        status: Math.random() > 0.4 ? "Good" : "Low",
        recommendation: "Consider potassium supplement",
      },
      organicMatter: {
        percentage: (2 + Math.random() * 6).toFixed(1),
        status: Math.random() > 0.5 ? "Good" : "Low",
        recommendation: "Add compost to improve soil structure",
      },
      moisture: {
        percentage: (15 + Math.random() * 35).toFixed(1),
        status: Math.random() > 0.5 ? "Adequate" : "Dry",
        recommendation: "Increase irrigation frequency",
      },
    },
    suitableFor: ["Tomatoes", "Lettuce", "Carrots", "Beans", "Peppers"]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3),
    recommendations: [
      "Test soil pH every 6 months",
      "Apply organic compost before planting season",
      "Ensure proper drainage to prevent waterlogging",
      "Rotate crops annually to maintain soil health",
    ],
    confidence: (85 + Math.random() * 14).toFixed(1) + "%",
  };

  res.status(200).json(dummyAnalysis);
});

module.exports = {
  analyzeSoil,
};
