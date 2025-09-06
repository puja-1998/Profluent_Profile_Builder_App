import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Validation schema
const PersonalSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone is required"),
  summary: z.string().min(1, "Summary is required").max(500, "Summary too long"),
});

export default function PersonalSection({ profileId, initial }) {
  const qc = useQueryClient();
  const wasValid = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(PersonalSchema),
    defaultValues: initial,
    mode: "onChange",
  });

  // Save mutation
  const save = useMutation({
    mutationFn: (data) =>
      api.put(`/profile/${profileId}/section`, {
        sectionType: "personal",
        data,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", profileId] });
    },
    onError: (err) => {
      toast.dismiss();
      if (err.response?.status === 402) {
        toast.error("Not enough credits. Please top up");
      } else {
        toast.error(err.response?.data?.message || "Save failed");
      }
    },
  });

  // Handlers
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

  // Show success only once when section first becomes valid
  useEffect(() => {
    if (isValid && !wasValid.current) {
      toast.success("Personal section completed");
    }
    wasValid.current = isValid;
  }, [isValid]);

  return (
    <motion.form
      className="space-y-5 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-semibold text-gray-800">
        Personal Information
      </h3>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., John Doe"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          {...register("phone")}
          type="tel"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="+91 98765 43210"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("summary")}
          rows="4"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="Brief introduction about yourself"
        />
        {errors.summary && (
          <p className="text-red-500 text-sm mt-1">{errors.summary.message}</p>
        )}
      </div>
    </motion.form>
  );
}
