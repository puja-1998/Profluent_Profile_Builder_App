import mongoose from "mongoose";
import Profile from "../model/ProfileModel.js";
import { v4 as uuidv4 } from "uuid";

// Create profile for the logged-in user if it doesn't exist.
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // If a profile already exists for this user return it
    let profile = await Profile.findOne({ userId });
    if (profile) {
      return res.json(profile);
    }

    // Create new profile
    const shareSlug = uuidv4();
    profile = await Profile.create({
      userId,
      sections: [],
      shareSlug,
    });

    return res.json(profile);
  } catch (error) {
    console.error("createProfile Error:", error);
    return res.status(500).json({ message: "createProfile Error" });
  }
};

// Helper: resolve profile by idParam ("me" or ObjectId)
const resolveProfile = async (idParam, userId) => {
  if (!idParam || idParam === "me") {
    return await Profile.findOne({ userId });
  }
  if (!mongoose.Types.ObjectId.isValid(idParam)) {
    return null;
  }
  return await Profile.findById(idParam);
};

// NEW: Get logged-in user's profile
export const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      // Auto-create profile if missing
      const shareSlug = uuidv4();
      profile = await Profile.create({
        userId: req.user.id,
        sections: [],
        shareSlug,
      });
    }

    return res.json(profile);
  } catch (error) {
    console.error("getMyProfile Error:", error);
    return res.status(500).json({ message: "getMyProfile Error" });
  }
};

// GET /api/profile/:id
export const getProfile = async (req, res) => {
  try {
    const idParam = req.params.id;
    const profile = await resolveProfile(idParam, req.user.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.json(profile);
  } catch (error) {
    console.error("getProfile Error:", error);
    return res.status(500).json({ message: "getProfile Error" });
  }
};

// PUT /api/profile/:id/section
export const updateProfileSection = async (req, res) => {
  try {
    const idParam = req.params.id;
    const { sectionType, data } = req.body;

    if (!sectionType) {
      return res.status(400).json({ message: "sectionType is required" });
    }
    if (data === undefined || data === null) {
      return res.status(400).json({ message: "data is required" });
    }

    const profile = await resolveProfile(idParam, req.user.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const idx = profile.sections.findIndex((s) => s.type === sectionType);
    const beforeSnapshot = profile.sections.reduce((acc, s) => {
      acc[s.type] = s.data;
      return acc;
    }, {});

    if (idx !== -1) {
      profile.sections[idx].data = data;
    } else {
      profile.sections.push({ type: sectionType, data });
    }

    try {
      const afterSnapshot = profile.sections.reduce((acc, s) => {
        acc[s.type] = s.data;
        return acc;
      }, {});
      const changed = JSON.stringify(beforeSnapshot) !== JSON.stringify(afterSnapshot);
      if (changed) {
        profile.versions.push({ diff: data, snapshot: afterSnapshot });
      }
    } catch (verr) {
      profile.versions.push({ diff: data, snapshot: null });
      console.warn("versioning snapshot serialization failed", verr);
    }

    await profile.save();
    return res.json({ message: `${sectionType} section saved`, profile });
  } catch (err) {
    console.error("updateProfileSection Error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/profile/:id/export
export const exportResume = async (req, res) => {
  try {
    const idParam = req.params.id;
    const profile = await resolveProfile(idParam, req.user.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({
      message: "Resume exported successfully",
      remainingCredits: req.currentUser?.credits ?? null,
    });
  } catch (err) {
    console.error("exportResume Error:", err);
    return res.status(500).json({ message: "Export failed" });
  }
};
