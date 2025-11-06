const express = require("express");
const router = express.Router();
const verifyjwt = require("../middleware/verifyJwt");
const loginLimiter = require("../middleware/loginLimiter");
const announce = require('../controllers/announcement')
router.use(verifyjwt)
router.use(loginLimiter);
//@ADMIN
router.route('/add').post(announce.add_announce)
router.route('/get').get(announce.get_all)
router.route('/deleteannounce/:id').delete(announce.delete_announce)



router.use(verifyjwt)

module.exports = router;