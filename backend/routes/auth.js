import express from 'express';
import {getMe, loginUser, Logout, registerUser} from '../controller/authController.js';
import {requireAuth} from '../middleware/auth.js'
const authRoutes = express.Router();

authRoutes.post("/register", registerUser);  //  Register a new account
authRoutes.post("/login", loginUser);  //Login with email/password
authRoutes.get("/me",requireAuth, getMe);  //get current logged-in user info
authRoutes.get("/logout", Logout);  //logout


export default authRoutes;