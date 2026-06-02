// Validation Middleware
const validateBill = (req, res, next) => {
  const { customerName, totalAmount, items } = req.body;

  if (!customerName) {
    return res.status(400).json({
      success: false,
      message: "Customer Name is required",
    });
  }

  // Allow bills that have at least one item name OR a positive totalAmount.
  const hasNamedItem = Array.isArray(items) && items.some(it => it && it.name && String(it.name).trim());
  const total = Number(totalAmount) || 0;

  if (total <= 0 && !hasNamedItem) {
    return res.status(400).json({
      success: false,
      message: "Total Amount must be greater than 0 or at least one item name is required",
    });
  }

  next();
};

const validateCompany = (req, res, next) => {
  const { companyName } = req.body;

  if (!companyName) {
    return res.status(400).json({
      success: false,
      message: "Company Name is required",
    });
  }

  next();
};

module.exports = {
  validateBill,
  validateCompany,
};
