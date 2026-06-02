const Company = require("../models/Company");

// Save Company

const saveCompany = async (req, res) => {
  try {
    console.log("Company save request - logo:", !!req.body.logo, "signature:", !!req.body.signature, "sigLength:", req.body.signature ? req.body.signature.length : 0);
    let company = await Company.findOne();

    if (company) {
      company = await Company.findByIdAndUpdate(
        company._id,
        req.body,
        { new: true }
      );
    } else {
      company = await Company.create(req.body);
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Company

const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne();

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveCompany,
  getCompany,
};