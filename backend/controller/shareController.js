import Profile from "../model/ProfileModel.js";


export const getPublicProfileBySlug =  async (req, res)=> {
  try {
    const profile = await Profile.findOne({ shareSlug: req.params.slug }).lean();

    if (!profile) {
      return res.status(404).json({ message: "Shared profile not found" });
    }

    res.json({
      sections: profile.sections,
      photoUrl: profile.photoUrl,
      message: "Shared profile fetched",
    });
  } catch (err) {
    console.error("Share fetch error:", err);
    res.status(500).json({ message: "Failed to fetch shared profile" });
  }
}
