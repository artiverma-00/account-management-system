const express = require("express");

const { getSystemSummary } = require("../controllers/systemController");

const router = express.Router();

router.get("/", getSystemSummary);

module.exports = router;
