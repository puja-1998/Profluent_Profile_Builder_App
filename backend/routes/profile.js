import express from "express";
import {
  createProfile,
  exportResume,
  getProfile,
  updateProfileSection,
  getMyProfile,
} from "../controller/profileController.js";

import { requireCredits } from "../middleware/credit.js";
import { requireAuth } from "../middleware/auth.js";

const profileRoutes = express.Router();

// Create profile if not exists
profileRoutes.post("/", requireAuth, createProfile);

// Get logged-in user's profile (shortcut for /:id with "me")
// profileRoutes.get("/me", requireAuth, getMyProfile);
profileRoutes.get("/me", requireAuth, (req, res) => {
  console.log("Logged in user:", req.user);
  getMyProfile(req, res);
});

// Get profile by id (for admins or share)
profileRoutes.get("/:id", requireAuth, getProfile);

// Update a section
profileRoutes.put("/:id/section", requireAuth, updateProfileSection);

// Export resume
profileRoutes.get("/:id/export", requireAuth, requireCredits, exportResume);

export default profileRoutes;
