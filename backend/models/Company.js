const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    ownerName: {
      type: String,
    },

    mobile: {
      type: String,
    },

    address: {
      type: String,
    },

    gstNumber: {
      type: String,
    },

    services: {
      type: String,
    },

    logo: {
      type: String,
    },

    signature: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Company",
  companySchema
);