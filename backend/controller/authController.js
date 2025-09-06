import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    //taking email and password from body
    const {name, email, password } = req.body;

    if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
    // checking user is exists or not
    const user = await User.findOne({ email });

    //if user exists
    if (user) {
      return res
        .status(409)
        .json({ message: "This email is already registered" });
    }

    //if user not exists
    const hash = await bcrypt.hash(password, 10);    // Hash password before storing
    
    const newUser = await User.create({name, email, password: hash, credits: 0 });  // Save new user in DB

    res.json({
      id: newUser._id,
      message: "Account created successfully. Please log in",
    });
  } catch (error) {
    console.log("registerUser Error");
    return res.status(500).json({
      message: `registerUser Error ${error}`,
    });
  }
};

//User Login
export const loginUser = async (req, res) => {
  try {

    //taking email, password from body
    const { email, password } = req.body;
    const user = await User.findOne({ email });  // find user

    //if user not exists
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    //if user exists then  Compare given password with hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {  // if not match then return error
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    //if password match then cretate token 
    const token = jwt.sign(
      { id: user._id, role: user.role }, // payload
      process.env.JWT_SECRET,  // secret key
      { expiresIn: "7d" }   // expires in 7 days
    );

    res.json({ token, message: "Login successful" });

  } catch (error) {
    console.log("loginUser Error");
    return res.status(500).json({
      message: `loginUser Error ${error}`,
    });
  }
};

// Get current user details
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      credits: user.credits,
      subscription: user.subscription,
    });
  } catch (error) {
    console.log("getMe Error");
    return res.status(500).json({
      message: `getMe Error ${error}`,
    });
  }
};

// Logout

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "LogOut Successful" });
  } catch (error) {
    console.log("LogOut Error");
    return res.status(500).json({
      message: `LogOut Error ${error}`,
    });
  }
};
