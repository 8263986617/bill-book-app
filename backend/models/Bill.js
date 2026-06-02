const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
{
    customerName: {
        type: String,
        required: true
    },

    mobile: {
        type: String
    },

    billNo: {
        type: Number,
        required: true,
        unique: true,
        sparse: true
    },

    date: {
        type: String,
        required: true,
        default: () => new Date().toLocaleDateString('en-GB')
    },

    totalAmount: {
        type: Number,
        required: true
    },

    items: [
        {
            name: String,
            quantity: {
                type: Number,
                default: 0
            },
            qty: {
                type: Number,
                default: 0
            },
            rate: Number,
            amount: Number
        }
    ]
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Bill", BillSchema);