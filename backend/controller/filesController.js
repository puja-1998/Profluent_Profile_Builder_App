import Profile from "../model/ProfileModel.js";
import cloudinary from "../config/cloudinary.js";

//Upload and save a profile photo
export const uploadProfilePhoto = async (req, res)=> {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profluent/photos",
    });

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { photoUrl: result.secure_url },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ profile, message: "Photo uploaded successfully" });
  } catch (err) {
    console.error("Cloudinary photo upload error:", err);
    res.status(500).json({ message: "Failed to upload photo" });
  }
}


 //Upload and save a CV (PDF only)

export async function uploadProfileCV(req, res) {
  try {
    if (req.file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ message: "Please upload a valid PDF file" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profluent/cv",
      resource_type: "raw", // needed for non-images
    });

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { cvUrl: result.secure_url },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ profile, message: "CV uploaded successfully" });
  } catch (err) {
    console.error("Cloudinary CV upload error:", err);
    res.status(500).json({ message: "Failed to upload CV" });
  }
}
