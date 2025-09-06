import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Validation for a single project
const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  link: z.string().url("Invalid URL").optional(),
  description: z.string().max(500, "Description too long").optional(),
});

// Full section schema
const ProjectsSectionSchema = z.object({
  projects: z.array(ProjectSchema).min(1, "At least one project is required"),
});

export default function ProjectsSection({ profileId, initial }) {
  const qc = useQueryClient();
  const wasValid = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(ProjectsSectionSchema),
    defaultValues: {
      projects:
        initial?.projects?.length > 0
          ? initial.projects
          : [{ name: "", link: "", description: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const save = useMutation({
    mutationFn: (data) =>
      api.put(`/profile/${profileId}/section`, {
        sectionType: "projects",
        data,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", profileId] }),
    onError: (err) => {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Save failed");
    },
  });

  const onValid = (values) => {
    save.mutate(values);
  };
  const onInvalid = () => {
    toast.dismiss();
    toast.error("Please fill out required fields correctly");
  };

  // Autosave
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      handleSubmit(onValid, onInvalid)();
    });
    return () => subscription.unsubscribe();
  }, [watch()]);

  // Show success toast only once
  useEffect(() => {
    if (isValid && !wasValid.current) {
      toast.success("Projects section completed");
    }
    wasValid.current = isValid;
  }, [isValid]);

  return (
    <motion.form
      className="space-y-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-semibold text-gray-800">Projects</h3>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-4 p-4 border rounded-lg bg-white shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register(`projects.${index}.name`)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Project Name"
            />
            {errors.projects?.[index]?.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projects[index].name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Link
            </label>
            <input
              {...register(`projects.${index}.link`)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://github.com/username/project"
            />
            {errors.projects?.[index]?.link && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projects[index].link.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register(`projects.${index}.description`)}
              rows="3"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Brief description of the project"
            />
            {errors.projects?.[index]?.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projects[index].description.message}
              </p>
            )}
          </div>

          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ name: "", link: "", description: "" })}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        Add Project
      </button>
    </motion.form>
  );
}
