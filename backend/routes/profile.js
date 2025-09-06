import express from "express";
import { createProfile, exportResume, getProfile, updateProfileSection } from "../controller/profileController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireCredits } from "../middleware/credit.js";

const profileRoutes = express.Router();

// Create profile if not exists
profileRoutes.post("/", requireAuth, createProfile);

// Update a section
profileRoutes.put("/:id/section", requireAuth, updateProfileSection);

// Get profile details
// You can change to GET if preferred (then update frontend).
profileRoutes.post("/:id", requireAuth, getProfile);

// Export resume 
profileRoutes.get("/:id/export", requireAuth, requireCredits, exportResume);

export default profileRoutes;
