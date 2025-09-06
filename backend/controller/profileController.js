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
      return res.json({ profile, message: "Profile already exists" });
    }

    // Create new profile
    const shareSlug = uuidv4();
    profile = await Profile.create({
      userId,
      sections: [],
      shareSlug,
    });

    return res.json({ profile, message: "Profile created successfully" });
  } catch (error) {
    console.error("createProfile Error:", error);
    return res.status(500).json({ message: `createProfile Error` });
  }
};


//  Helper: resolve profile by idParam which can be:
//  - valid Mongo ObjectId => findById
//  - "me" => find by req.user.id
//   - anything else => return null (and handled by caller)
 
const resolveProfile = async (idParam, userId) => {
  if (!idParam || idParam === "me") {
    // find by userId
    return await Profile.findOne({ userId });
  }

  // check if valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(idParam)) {
    return null;
  }
  return await Profile.findById(idParam);
};


//   PUT /api/profile/:id/section
//  Update or create a section in profile.sections
 
export const updateProfileSection = async (req, res) => {
  try {
    const idParam = req.params.id; // may be 'me' or actual profile _id
    const { sectionType, data } = req.body;

    if (!sectionType) {
      return res.status(400).json({ message: "sectionType is required" });
    }

    // disallow undefined/ null data - allow empty objects/arrays
    if (data === undefined || data === null) {
      return res.status(400).json({ message: "data is required (may be {} or [])" });
    }

    // Resolve profile
    const profile = await resolveProfile(idParam, req.user.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Find existing section index
    const idx = profile.sections.findIndex((s) => s.type === sectionType);

    // Build new snapshot BEFORE mutation for versioning (shallow snapshot)
    const beforeSnapshot = profile.sections.reduce((acc, s) => {
      acc[s.type] = s.data;
      return acc;
    }, {});

    // Update or push section
    if (idx !== -1) {
      profile.sections[idx].data = data;
    } else {
      profile.sections.push({ type: sectionType, data });
    }

    // Only add a version if data actually changed (simple JSON compare)
    try {
      const afterSnapshot = profile.sections.reduce((acc, s) => {
        acc[s.type] = s.data;
        return acc;
      }, {});
      const changed = JSON.stringify(beforeSnapshot) !== JSON.stringify(afterSnapshot);
      if (changed) {
        profile.versions.push({
          diff: data,
          snapshot: afterSnapshot,
        });
      }
    } catch (verr) {
      // If serialization fails, still push a version with diff only
      profile.versions.push({
        diff: data,
        snapshot: null,
      });
      console.warn("versioning snapshot serialization failed", verr);
    }

    await profile.save();
    return res.json({ message: `${sectionType} section saved`, profile });
  } catch (err) {
    console.error("updateProfileSection Error:", err);
    // If the error is a CastError for ObjectId or similar, return 400
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};


//  POST /api/profile/:id
//  Get profile details. :id can be 'me' for current user's profile.
 
export const getProfile = async (req, res) => {
  try {
    const idParam = req.params.id; // 'me' or profile _id

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


//  GET /api/profile/:id/export
//  Example export (PDF/DOCX generation would be plugged here).
//  This route is protected by Credits middleware which deducts credits.
 
export const exportResume = async (req, res) => {
  try {
    const idParam = req.params.id;
    const profile = await resolveProfile(idParam, req.user.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // TODO: generate PDF/DOCX from profile data and return file or URL
    // For now respond with success and the user's updated credits (set by requireCredits middleware)
    return res.json({
      message: "Resume exported successfully",
      remainingCredits: req.currentUser?.credits ?? null,
    });
  } catch (err) {
    console.error("exportResume Error:", err);
    return res.status(500).json({ message: "Export failed" });
  }
};
