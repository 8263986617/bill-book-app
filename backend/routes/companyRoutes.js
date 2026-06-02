const express = require("express");

const router = express.Router();

const {
  saveCompany,
  getCompany,
} = require("../controllers/companyController");

const { validateCompany } = require("../middleware/validate");

router.post("/", validateCompany, saveCompany);
router.get("/", getCompany);

module.exports = router;