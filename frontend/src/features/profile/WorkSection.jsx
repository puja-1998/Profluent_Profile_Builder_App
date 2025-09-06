import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Validation schema
const WorkSectionSchema = z.object({
  company: z.string().min(1, "Comapny is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  description: z.string().max(500, "Description too long").optional(),
});

// Normalize YYYY-MM-DD → YYYY-MM
function normalizeMonth(dateStr) {
  if (!dateStr) return "";
  return dateStr.slice(0, 7); // take only YYYY-MM
}

export default function WorkSection({ profileId, initial }) {
  const qc = useQueryClient();
  const wasValid = useRef(false);

  const normalizedInitial = {
    ...initial,
    startDate: normalizeMonth(initial?.startDate),
    endDate: normalizeMonth(initial?.endDate),
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(WorkSectionSchema),
    defaultValues: normalizedInitial,
    mode: "onChange",
  });

  // Save mutation
  const save = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        startDate: data.startDate ? `${data.startDate}-01` : null, // save as YYYY-MM-01
        endDate: data.endDate ? `${data.endDate}-01` : null,
      };
      return api.put(`/profile/${profileId}/section`, {
        sectionType: "work",
        data: payload,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", profileId] });
    },
    onError: (err) => {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Save failed");
    },
  });

  const onValid = (values) => {
    if (isDirty) save.mutate(values);
  };
  const onInvalid = () => {
    toast.dismiss();
    toast.error("Please fill out required fields correctly");
  };

  // Autosave with debounce
  useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(() => {
      handleSubmit(onValid, onInvalid)();
    }, 1500);
    return () => clearTimeout(t);
  }, [watch(), isDirty]);

  // Show success once
  useEffect(() => {
    if (isValid && !wasValid.current) {
      toast.success("Work section completed");
    }
    wasValid.current = isValid;
  }, [isValid]);

  return (
    <motion.form
      className="space-y-5 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company <span className="text-red-500">*</span>
        </label>
        <input
          {...register("company")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., Google"
        />
        {errors.company && (
          <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
        )}
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Position <span className="text-red-500">*</span>
        </label>
        <input
          {...register("position")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., Software Engineer"
        />
        {errors.position && (
          <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          {...register("location")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="City, Country"
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          {...register("startDate")}
          type="month"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.startDate && (
          <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
        )}
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>
        <input
          {...register("endDate")}
          type="month"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows="4"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="Brief summary of your role"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>
    </motion.form>

  );
}
