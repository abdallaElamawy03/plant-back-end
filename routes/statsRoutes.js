const express = require("express");
const router = express.Router();
const stats = require("../controllers/stats");
const verifyjwt = require("../middleware/verifyJwt");
const loginLimiter = require("../middleware/loginLimiter");

// router.use(loginLimiter);
router.use(verifyjwt);

router.route("/dashboard").get(stats.getDashboardStats);
router.route("/community").get(stats.getCommunityStats);

module.exports = router;
