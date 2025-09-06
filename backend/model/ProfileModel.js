import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    type: { 
        type: String, 
        required: true 
    },
    data: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },
  },
  { _id: false }
);

const versionSchema = new mongoose.Schema(
  {
    at: { 
        type: Date, 
        default: Date.now 
    },
    diff: mongoose.Schema.Types.Mixed,
    snapshot: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Types.ObjectId, 
        ref: "User", 
        index: true, 
        required: true 
    },
    sections: [sectionSchema],
    photoUrl: String,
    cvUrl: String,
    versions: [versionSchema],
    shareSlug: {
         type: String, 
         unique: true 
        },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
