import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Predefined skill suggestions
const SUGGESTIONS = [
  "JavaScript",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "HTML",
  "CSS",
  "TypeScript",
  "Python",
  "Java",
];

// Validation schema
const SkillsSchema = z.object({
  skills: z
    .array(z.string().min(1, "Skill is required"))
    .min(1, "Add at least one skill"),
});

// export default function SkillsSection({ profileId, initial }) {
//   const qc = useQueryClient();
//   const wasValid = useRef(false);
//   const [inputValue, setInputValue] = useState("");

//   // Normalize initial skills
//   const normalized = initial?.skills?.map((s) => s.name) || [];

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors, isDirty, isValid },
//   } = useForm({
//     resolver: zodResolver(SkillsSchema),
//     defaultValues: { skills: normalized },
//     mode: "onChange",
//   });

//   const skills = watch("skills");

//   // Save mutation
//   const save = useMutation({
//     mutationFn: (data) =>
//       api.put(`/profile/${profileId}/section`, {
//         sectionType: "skills",
//         data,
//       }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", profileId] }),
//     onError: (err) => {
//       toast.dismiss();
//       toast.error(err.response?.data?.message || "Save failed");
//     },
//   });

//   const onValid = (values) => save.mutate(values);
//   const onInvalid = () => {
//     toast.dismiss();
//     toast.error("Please add at least one skill");
//   };

//   // Autosave
//   useEffect(() => {
//     const subscription = watch(() => handleSubmit(onValid, onInvalid)());
//     return () => subscription.unsubscribe();
//   }, [watch()]);

//   useEffect(() => {
//     if (isValid && !wasValid.current) {
//       toast.success("Skills section completed");
//     }
//     wasValid.current = isValid;
//   }, [isValid]);

//   const addSkill = (skill) => {
//     if (!skills.includes(skill)) {
//       setValue("skills", [...skills, skill], { shouldDirty: true });
//     }
//     setInputValue("");
//   };

//   const removeSkill = (skill) => {
//     setValue(
//       "skills",
//       skills.filter((s) => s !== skill),
//       { shouldDirty: true }
//     );
//   };

//   const filteredSuggestions = SUGGESTIONS.filter(
//     (s) =>
//       s.toLowerCase().includes(inputValue.toLowerCase()) &&
//       !skills.includes(s)
//   );

//   return (
//     <motion.form
//       className="space-y-5 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <h3 className="text-xl font-semibold text-gray-800">Skills</h3>

//       {/* Skills chips */}
//       <div className="flex flex-wrap gap-2 mb-2">
//         {skills.map((skill) => (
//           <div
//             key={skill}
//             className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
//           >
//             {skill}
//             <button
//               type="button"
//               onClick={() => removeSkill(skill)}
//               className="ml-2 text-blue-600 hover:text-red-500 font-bold"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Input field */}
//       <div className="relative">
//         <input
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               if (inputValue.trim()) addSkill(inputValue.trim());
//             }
//           }}
//           placeholder="Type or select a skill"
//           className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//         />

//         {/* Suggestions dropdown */}
//         {filteredSuggestions.length > 0 && inputValue && (
//           <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto mt-1">
//             {filteredSuggestions.map((s) => (
//               <li
//                 key={s}
//                 className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
//                 onClick={() => addSkill(s)}
//               >
//                 {s}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {errors.skills && (
//         <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
//       )}
//     </motion.form>
//   );
// }

export default function SkillsSection({ profileId, initial }) {
  const qc = useQueryClient();
  const wasValid = useRef(false);
  const [inputValue, setInputValue] = useState("");

  // Normalize: support array of strings or array of {name}
  const normalized = (initial?.skills || []).map((s) =>
    typeof s === "string" ? s : s.name
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(SkillsSchema),
    defaultValues: { skills: normalized },
    mode: "onChange",
  });

  // Update form when initial changes
  useEffect(() => reset({ skills: normalized }), [initial]);

  const skills = watch("skills");

  const save = useMutation({
    mutationFn: (data) =>
      api.put(`/profile/${profileId}/section`, {
        sectionType: "skills",
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
    toast.error("Please add at least one skill");
  };

  // Autosave
  useEffect(() => {
    const sub = watch(() => handleSubmit(onValid)());

    return () => sub.unsubscribe();
  }, [watch()]);

  useEffect(() => {
    if (isValid && !wasValid.current) {
      toast.success("Skills section completed");
    }
    wasValid.current = isValid;
  }, [isValid]);

  const addSkill = (skill) => {
    if (!skills.includes(skill))
      setValue("skills", [...skills, skill], { shouldDirty: true });
    setInputValue("");
  };
  const removeSkill = (skill) =>
    setValue(
      "skills",
      skills.filter((s) => s !== skill),
      { shouldDirty: true }
    );

  return (
    <motion.form className="space-y-5 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-2 text-blue-600 hover:text-red-500 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addSkill(inputValue.trim());
          }
        }}
        placeholder="Type or select a skill"
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
      {errors.skills && (
        <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
      )}
    </motion.form>
  );
}
