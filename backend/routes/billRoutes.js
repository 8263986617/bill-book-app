const express = require("express");
const router = express.Router();

const {
  createBill,
  getBills,
  getNextBillNo,
  getSingleBill,
  updateBill,
  deleteBill,
} = require("../controllers/billController");

const { validateBill } = require("../middleware/validate");

router.post("/create", validateBill, createBill);
router.get("/next", getNextBillNo);
router.get("/", getBills);
router.get("/:id", getSingleBill);
router.put("/:id", validateBill, updateBill);
router.delete("/:id", deleteBill);

module.exports = router;