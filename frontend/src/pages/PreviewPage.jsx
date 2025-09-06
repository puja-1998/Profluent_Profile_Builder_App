import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../components/Navbar.jsx";

export default function PreviewPage() {
  const { id } = useParams();
  const previewRef = useRef();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => api.post(`/profile/${id}`).then((res) => res.data),
  });

  if (isLoading) return <p className="p-6 text-gray-500">Loading preview...</p>;
  if (error || !profile) return <p className="p-6 text-red-500">Failed to load profile</p>;

  const sections = profile.sections || [];

  // Normalize sections to avoid multiple renders
  const normalizedSections = {};
  sections.forEach((section) => {
    const type = section.type;
    const data = section.data;

    if (type === "skills") {
      normalizedSections.skills = Array.isArray(data.skills)
        ? data.skills.map((s) => (typeof s === "string" ? s : s.name || ""))
        : [];
    } else if (type === "work") {
      normalizedSections.work = Array.isArray(data.work)
        ? data.work
        : data.company
        ? [data] // single work object
        : [];
    } else if (type === "education") {
      normalizedSections.education = Array.isArray(data.education)
        ? data.education
        : data.degree
        ? [data]
        : [];
    } else if (type === "certifications") {
      normalizedSections.certifications = Array.isArray(data.certifications)
        ? data.certifications
        : [];
    } else if (type === "projects") {
      normalizedSections.projects = Array.isArray(data.projects)
        ? data.projects
        : [];
    } else if (type === "personal") {
      normalizedSections.personal = data;
    }
  });

  const handleExportPDF = async () => {
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex justify-end mt-12 mb-4">
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Export as PDF
        </button>
      </div>

      <div ref={previewRef} className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        {/* Personal */}
        {normalizedSections.personal && (
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold">{normalizedSections.personal.name}</h1>
            <p className="text-gray-600">
              {normalizedSections.personal.email || ""}{" "}
              {normalizedSections.personal.phone && `| ${normalizedSections.personal.phone}`}
            </p>
            {normalizedSections.personal.summary && (
              <p className="mt-2 text-gray-700">{normalizedSections.personal.summary}</p>
            )}
          </header>
        )}

        {/* Skills */}
        {normalizedSections.skills && normalizedSections.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {normalizedSections.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {normalizedSections.work && normalizedSections.work.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Work Experience</h2>
            {normalizedSections.work.map((job, i) => (
              <div key={i} className="mb-3">
                <p className="font-medium">
                  {job.position} <span className="text-gray-500">at {job.company}</span>
                </p>
                {job.location && <p className="text-gray-600 text-sm">{job.location}</p>}
                <p className="text-gray-500 text-sm">
                  {job.startDate} – {job.endDate || "Present"}
                </p>
                {job.description && <p className="text-gray-700 mt-1">{job.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {normalizedSections.education && normalizedSections.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Education</h2>
            {normalizedSections.education.map((edu, i) => (
              <div key={i} className="mb-2">
                <p className="font-medium">
                  {edu.degree} in {edu.field}
                </p>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-gray-500 text-sm">
                  {edu.startDate} – {edu.endDate || "Present"}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {normalizedSections.certifications && normalizedSections.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Certifications</h2>
            {normalizedSections.certifications.map((c, i) => (
              <div key={i} className="mb-2">
                <p className="font-medium">{c.name}</p>
                <p className="text-gray-600">{c.issuer}</p>
                <p className="text-gray-500 text-sm">{c.year}</p>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {normalizedSections.projects && normalizedSections.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Projects</h2>
            {normalizedSections.projects.map((p, i) => (
              <div key={i} className="mb-2">
                <p className="font-medium">{p.name}</p>
                {p.description && <p className="text-gray-700">{p.description}</p>}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    {p.link}
                  </a>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
