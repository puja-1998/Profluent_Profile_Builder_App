import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";
import { z } from "zod";

const personalSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
});

export default function PersonalSection({ profileId }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // ✅ Load existing data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.post(`/api/profile/${profileId}`);
        const section = res.data.sections?.find((s) => s.type === "personal");
        if (section?.data) setFormData(section.data);
      } catch (err) {
        console.error("Failed to fetch personal info", err);
      }
    }
    fetchData();
  }, [profileId]);

  // ✅ Autosave (debounced 2s)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const validation = personalSchema.safeParse(formData);
      if (!validation.success) {
        const fieldErrors = {};
        validation.error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      try {
        setSaving(true);
        await axios.put(`/api/profile/${profileId}/section`, {
          sectionType: "personal",
          data: formData,
        });
        toast.success("Personal details saved!", { id: "personalSaved" });
      } catch (err) {
        toast.error("Failed to autosave.", { id: "personalError" });
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [formData, profileId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center justify-between">
        Personal Information
        {saving && <span className="text-sm text-blue-500">Saving...</span>}
      </h2>
      <form className="grid gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </form>
    </div>
  );
}
