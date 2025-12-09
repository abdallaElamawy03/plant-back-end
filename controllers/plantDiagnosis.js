const asyncHandler = require("express-async-handler");

// @desc Diagnose plant disease using AI simulation
// @route POST /ai/plant-diagnosis
// @access Public
const diagnosePlant = asyncHandler(async (req, res) => {
  const { image, plantType, symptoms } = req.body;

  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Dummy disease database
  const diseases = [
    {
      name: "Powdery Mildew",
      severity: "Moderate",
      description: "Fungal disease appearing as white powdery spots on leaves",
      cause: "Fungal infection (Erysiphales)",
      affectedParts: ["Leaves", "Stems"],
      treatment: [
        "Remove affected leaves immediately",
        "Apply fungicide spray (neem oil or sulfur-based)",
        "Improve air circulation around plants",
        "Water at soil level, avoid wetting leaves",
      ],
      prevention: [
        "Ensure proper plant spacing",
        "Avoid overhead watering",
        "Apply preventive fungicide in humid conditions",
      ],
    },
    {
      name: "Leaf Spot Disease",
      severity: "Mild",
      description:
        "Dark spots on leaves caused by bacterial or fungal infection",
      cause: "Bacterial or fungal pathogen",
      affectedParts: ["Leaves"],
      treatment: [
        "Remove infected leaves and destroy them",
        "Apply copper-based fungicide",
        "Reduce leaf wetness by watering in morning",
        "Improve drainage around plant base",
      ],
      prevention: [
        "Use disease-resistant varieties",
        "Practice crop rotation",
        "Maintain proper plant nutrition",
      ],
    },
    {
      name: "Root Rot",
      severity: "Severe",
      description:
        "Fungal disease affecting roots, causing wilting and yellowing",
      cause: "Overwatering and poor drainage",
      affectedParts: ["Roots", "Stems", "Leaves"],
      treatment: [
        "Reduce watering frequency immediately",
        "Improve soil drainage",
        "Apply fungicide to soil",
        "Consider transplanting to fresh, well-draining soil",
      ],
      prevention: [
        "Ensure adequate drainage holes",
        "Use well-draining soil mix",
        "Water only when top soil is dry",
      ],
    },
    {
      name: "Nutrient Deficiency (Nitrogen)",
      severity: "Moderate",
      description: "Yellowing of older leaves due to lack of nitrogen",
      cause: "Insufficient nitrogen in soil",
      affectedParts: ["Leaves"],
      treatment: [
        "Apply nitrogen-rich fertilizer",
        "Use organic compost or manure",
        "Apply fish emulsion spray",
        "Monitor plant response over 1-2 weeks",
      ],
      prevention: [
        "Regular soil testing",
        "Maintain consistent fertilization schedule",
        "Use balanced NPK fertilizer",
      ],
    },
    {
      name: "Aphid Infestation",
      severity: "Mild",
      description:
        "Small insects sucking plant sap, causing leaf curl and stunted growth",
      cause: "Pest infestation (Aphidoidea)",
      affectedParts: ["Leaves", "Stems", "Buds"],
      treatment: [
        "Spray with water to dislodge aphids",
        "Apply insecticidal soap",
        "Introduce beneficial insects (ladybugs)",
        "Use neem oil spray",
      ],
      prevention: [
        "Encourage natural predators",
        "Regular plant inspection",
        "Avoid over-fertilizing with nitrogen",
      ],
    },
  ];

  // Select random disease for simulation
  const detectedDisease = diseases[Math.floor(Math.random() * diseases.length)];

  const dummyDiagnosis = {
    success: true,
    diagnosisId: `PD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    plantType: plantType || "Unknown",
    detected: {
      disease: detectedDisease.name,
      confidence: (80 + Math.random() * 19).toFixed(1) + "%",
      severity: detectedDisease.severity,
      description: detectedDisease.description,
      cause: detectedDisease.cause,
      affectedParts: detectedDisease.affectedParts,
    },
    treatment: {
      immediate: detectedDisease.treatment,
      preventive: detectedDisease.prevention,
      estimatedRecoveryTime: `${Math.floor(Math.random() * 4) + 1}-${
        Math.floor(Math.random() * 4) + 4
      } weeks`,
    },
    environmentalFactors: {
      temperature: {
        current: (18 + Math.random() * 15).toFixed(1) + "°C",
        optimal: "20-25°C",
        status: Math.random() > 0.5 ? "Good" : "Suboptimal",
      },
      humidity: {
        current: (40 + Math.random() * 50).toFixed(1) + "%",
        optimal: "50-70%",
        status: Math.random() > 0.5 ? "Good" : "Too High",
      },
      sunlight: {
        status: Math.random() > 0.5 ? "Adequate" : "Insufficient",
        recommendation: "Ensure 6-8 hours of sunlight daily",
      },
    },
    additionalRecommendations: [
      "Monitor plant daily for symptom changes",
      "Keep affected plant isolated from healthy plants",
      "Document treatment progress with photos",
      "Consult local agricultural extension if symptoms worsen",
    ],
    similarDiseases: diseases
      .filter((d) => d.name !== detectedDisease.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((d) => d.name),
  };

  res.status(200).json(dummyDiagnosis);
});

// @desc Get plant health tips
// @route GET /ai/plant-tips
// @access Public
const getPlantTips = asyncHandler(async (req, res) => {
  const tips = {
    success: true,
    tips: [
      {
        category: "Watering",
        tip: "Water deeply but infrequently to encourage deep root growth",
        importance: "High",
      },
      {
        category: "Sunlight",
        tip: "Most vegetables need 6-8 hours of direct sunlight daily",
        importance: "High",
      },
      {
        category: "Soil",
        tip: "Add organic matter annually to improve soil structure and nutrients",
        importance: "Medium",
      },
      {
        category: "Pest Control",
        tip: "Inspect plants weekly for early pest detection",
        importance: "Medium",
      },
      {
        category: "Pruning",
        tip: "Remove dead or diseased plant parts promptly to prevent spread",
        importance: "High",
      },
    ],
    seasonalAdvice: {
      current: "Winter",
      advice:
        "Protect plants from frost, reduce watering frequency, and prepare soil for spring planting",
    },
  };

  res.status(200).json(tips);
});

module.exports = {
  diagnosePlant,
  getPlantTips,
};
