const express = require('express')
const router = express.Router();
const {protect} = require("../middleware/authMiddleware")
const {accessChat, fetchChat, createGroupChat, renameChat, addToGroup, removeFromGroup} = require("../controllers/chatControllers")

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").post(protect, renameChat);
router.route("/groupadd").put(protect, addToGroup)
router.route("/groupremove").put(protect, removeFromGroup)

module.exports = router