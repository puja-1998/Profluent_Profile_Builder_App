import User from "../model/userModel.js";
import Credit from "../model/CreditModel.js";

export const getUserCreditBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ credits: user.credits, message: "Credit balance fetched" });
  } catch (error) {
    console.error("getUserCreditBalance error:", err);
    res.status(500).json({ message: "Unable to fetched Credit balance " });
  }
};

export const getUserCreditHistory = async (req, res) => {
  try {
    const rows = await Credit.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ ledger: rows, message: "Credit history fetched" });
  } catch (error) {
    console.error("getUserCreditHistory error:", err);
    res.status(500).json({ message: "Unable to fetched Credit history  " });
  }
};
