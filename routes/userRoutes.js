const express = require("express")
const router = express.Router()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const {protect} = require("../middleware/authMiddleware")

const {registerUser, authUser, getProfileUrl, allUsers} = require("../controllers/userControllers")

router.route("/").get(protect, allUsers);
router.route("/register").post(registerUser);
router.post("/login", authUser);
router.post("/profile", upload.single('avatar'), getProfileUrl);

module.exports = router;