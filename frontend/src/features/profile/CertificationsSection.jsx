import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Validation schema for each certification
const CertSchema = z.object({
  certifications: z.array(
    z.object({
      name: z.string().min(1, "Certification name is required"),
      issuer: z.string().min(1, "Issuer is required"),
      year: z.string().min(4, "Year is required").max(4, "Enter valid year"),
    })
  ),
});

export default function CertificationsSection({ profileId, initial }) {
  const qc = useQueryClient();
  const wasValid = useRef(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(CertSchema),
    defaultValues: {
      certifications: initial?.certifications || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  // Save mutation
  const save = useMutation({
    mutationFn: (data) =>
      api.put(`/profile/${profileId}/section`, {
        sectionType: "certifications",
        data,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", profileId] }),
    onError: (err) => {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Save failed");
    },
  });

  const onValid = (values) => save.mutate(values);
  const onInvalid = () => {
    toast.dismiss();
    toast.error("Please fill all required fields");
  };

  // Autosave on change
  useEffect(() => {
    const subscription = watch(() => handleSubmit(onValid, onInvalid)());
    return () => subscription.unsubscribe();
  }, [watch()]);

  useEffect(() => {
    if (isValid && !wasValid.current) {
      toast.success("Certifications section completed");
    }
    wasValid.current = isValid;
  }, [isValid]);

  return (
    <motion.form
      className="space-y-5 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-semibold text-gray-800">Certifications</h3>

      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col md:flex-row md:items-end gap-3 border-b border-gray-200 pb-3 mb-3"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certification Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register(`certifications.${index}.name`)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., AWS Certified Solutions Architect"
            />
            {errors.certifications?.[index]?.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.certifications[index].name.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issuer <span className="text-red-500">*</span>
            </label>
            <input
              {...register(`certifications.${index}.issuer`)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Amazon Web Services"
            />
            {errors.certifications?.[index]?.issuer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.certifications[index].issuer.message}
              </p>
            )}
          </div>

          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              {...register(`certifications.${index}.year`)}
              type="number"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="YYYY"
            />
            {errors.certifications?.[index]?.year && (
              <p className="text-red-500 text-sm mt-1">
                {errors.certifications[index].year.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500 hover:text-red-700 font-bold text-xl"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: "", issuer: "", year: "" })}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + Add Certification
      </button>
    </motion.form>
  );
}
