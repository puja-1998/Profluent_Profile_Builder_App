import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import PersonalSection from "../features/profile/PersonalSection";
import EducationSection from "../features/profile/EducationSection";
import WorkSection from "../features/profile/WorkSection";
import ProjectsSection from "../features/profile/ProjectsSection";
import SkillsSection from "../features/profile/SkillsSection";
import CertificationsSection from "../features/profile/CertificationsSection";
import CreditHud from "../components/CreditsHud.jsx";

// const tabs = [
//   { id: "personal", label: "Personal", component: PersonalSection },
//   { id: "education", label: "Education", component: EducationSection },
//   { id: "work", label: "Work", component: WorkSection },
//   { id: "projects", label: "Projects", component: ProjectsSection },
//   { id: "skills", label: "Skills", component: SkillsSection },
//   { id: "certs", label: "Certifications", component: CertificationsSection },
// ];

// export default function Builder() {
//   const [active, setActive] = useState("personal");
//   const navigate = useNavigate();
//   const previewRef = useRef();

//   // Fetch profile
//   // const { data: profile, isLoading, error } = useQuery({
//   //   queryKey: ["profile"],
//   //   queryFn: () => api.post(`/profile/me`).then((res) => res.data),
//   // });

//   const { data: profile, isLoading, error } = useQuery({
//   queryKey: ["profile"],
//   queryFn: async () => {
//     try {
//       const res = await api.get("/profile/me");
//       return res.data;
//     } catch (err) {
//       // If 404 → create a new empty profile
//       if (err.response?.status === 404) {
//         const res = await api.post("/profile", { sections: [] });
//         return res.data;
//       }
//       throw err;
//     }
//   },
// });


//   if (isLoading) return <p className="p-6">Loading profile...</p>;
//   if (error) return <p className="p-6 text-red-500">Failed to load profile</p>;
//   if (!profile) return <p className="p-6 text-red-500">No profile found</p>;

//   const ActiveComp = tabs.find((t) => t.id === active).component;

//   // Normalize section data for Skills
//   const getSectionData = (sectionId) => {
//     const section = profile.sections?.find((s) => s.type === sectionId)?.data || {};
    
//     // Ensure skills are array of strings
//     if (sectionId === "skills") {
//       const skillsArray = section.skills || [];
//       return {
//         skills: skillsArray.map((s) => (typeof s === "string" ? s : s.name || "")).filter(Boolean),
//       };
//     }
//     return section;
//   };

//   // Download handler
//   const handleDownload = async () => {
//     if (!previewRef.current) return;
//     const canvas = await html2canvas(previewRef.current, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save("resume.pdf");
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen">
//       {/* Sidebar */}
//       <aside className="md:col-span-1 border-r p-4 space-y-4">
//         <h2 className="text-xl font-semibold">Profile Builder</h2>
//         <CreditHud />
//         <nav className="space-y-2">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActive(tab.id)}
//               className={`block w-full text-left px-3 py-2 rounded ${
//                 active === tab.id ? "bg-blue-500 text-white" : "hover:bg-gray-100"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="md:col-span-3 p-6 space-y-8">
//         {/* Buttons row */}
//         <div className="flex justify-end gap-4 mb-4">
//           <button
//             onClick={() => navigate(`/preview/${profile._id}`)}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//           >
//             Preview
//           </button>
//           <button
//             onClick={handleDownload}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             Download PDF
//           </button>
//         </div>

//         {/* Active form */}
//         <div ref={previewRef}>
//           <ActiveComp profileId={profile._id} initial={getSectionData(active)} />
//         </div>
//       </main>
//     </div>
//   );
// }


const tabs = [
  { id: "personal", label: "Personal", component: PersonalSection },
  { id: "education", label: "Education", component: EducationSection },
  { id: "work", label: "Work", component: WorkSection },
  { id: "projects", label: "Projects", component: ProjectsSection },
  { id: "skills", label: "Skills", component: SkillsSection },
  { id: "certs", label: "Certifications", component: CertificationsSection },
];

export default function Builder() {
  const [active, setActive] = useState("personal");
  const navigate = useNavigate();
  const previewRef = useRef();

  // Always returns a profile (backend ensures creation if missing)
  // const { data: profile, isLoading, error } = useQuery({
  //   queryKey: ["profile"],
  //   queryFn: async () => {
  //     const res = await api.get(`/profile/${userId}`);
  //     return res.data;
  //   },
  //   retry: false,
  // });

  const { data: profile, isLoading, error } = useQuery({
  queryKey: ["profile"],
  queryFn: async () => {
    try {
      const res = await api.get("/profile/me");
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        const res = await api.post("/profile", { sections: [] });
        return res.data;
      }
      throw err;
    }
  },
});


  if (isLoading) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load profile</p>;

  const ActiveComp = tabs.find((t) => t.id === active)?.component;

  // Normalize section data for Skills
  const getSectionData = (sectionId) => {
    const section = profile.sections?.find((s) => s.type === sectionId)?.data || {};

    if (sectionId === "skills") {
      const skillsArray = section.skills || [];
      return {
        skills: skillsArray
          .map((s) => (typeof s === "string" ? s : s.name || ""))
          .filter(Boolean),
      };
    }
    return section;
  };

  // Download handler
  const handleDownload = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen">
      {/* Sidebar */}
      <aside className="md:col-span-1 border-r p-4 space-y-4">
        <h2 className="text-xl font-semibold">Profile Builder</h2>
        <CreditHud />
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`block w-full text-left px-3 py-2 rounded ${
                active === tab.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-3 p-6 space-y-8">
        {/* Buttons row */}
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={() => navigate(`/preview/${profile._id}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Preview
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>

        {/* Active form */}
        <div ref={previewRef}>
          {ActiveComp && (
            <ActiveComp
              profileId="{profile._id}"
              initial={getSectionData(active)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
