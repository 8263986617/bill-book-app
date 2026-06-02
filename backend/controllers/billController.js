const Bill = require("../models/Bill");

// CREATE
const createBill = async (req, res) => {
  try {
    const lastBill = await Bill.findOne({ billNo: { $exists: true } })
      .sort({ billNo: -1 })
      .select('billNo')
      .lean();

    const nextBillNo = lastBill ? lastBill.billNo + 1 : 1;
    const billData = {
      ...req.body,
      billNo: nextBillNo,
      date: req.body.date || new Date().toLocaleDateString('en-GB'),
      items: (req.body.items || []).map((item) => ({
        ...item,
        quantity: Number(item.quantity) || Number(item.qty) || 0,
        qty: Number(item.quantity) || Number(item.qty) || 0,
      })),
    };

    const bill = await Bill.create(billData);

    res.status(201).json({
      success: true,
      data: bill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL
const getBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET NEXT BILL NUMBER
const getNextBillNo = async (req, res) => {
  try {
    const lastBill = await Bill.findOne({ billNo: { $exists: true } })
      .sort({ billNo: -1 })
      .select('billNo')
      .lean();

    const nextBillNo = lastBill ? lastBill.billNo + 1 : 1;

    res.status(200).json({
      success: true,
      data: {
        nextBillNo,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE
const getSingleBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found"
      });
    }

    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE
const updateBill = async (req, res) => {
  try {
    const billData = {
      ...req.body,
      items: (req.body.items || []).map((item) => ({
        ...item,
        quantity: Number(item.quantity) || Number(item.qty) || 0,
        qty: Number(item.quantity) || Number(item.qty) || 0,
      })),
    };

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      billData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found"
      });
    }

    res.status(200).json({
      success: true,
      data: bill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE
const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill Not Found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Bill Deleted Successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBill,
  getBills,
  getNextBillNo,
  getSingleBill,
  updateBill,
  deleteBill
};