import User from "../model/userModel.js";

export const requireCredits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.credits < 5) {
      return res.status(402).json({ message: "Insufficient credits" });
    }

    // Deduct 5 credits ONLY for this operation
    user.credits -= 5;
    await user.save();

    req.currentUser = user;
    next();
  } catch (error) {
    console.log("requireCredits Error");
    return res.status(500).json({
      message: `requireCredits Error ${error}`,
    });
  }
};
