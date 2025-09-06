// components/DownloadButton.jsx
import { api } from "../lib/api";
import toast from "react-hot-toast";

export default function DownloadButton({ profileId }) {
  const downloadResume = async () => {
    try {
      const { data } = await api.get(`/profile/${profileId}/export`);
      toast.success(`Resume downloaded 🎉 Remaining credits: ${data.remainingCredits}`);
    } catch (err) {
      if (err.response?.status === 402) {
        toast.error("Not enough credits to download. Please top up ✨");
      } else {
        toast.error("Download failed ❌");
      }
    }
  };

  return (
    <button
      onClick={downloadResume}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Download Resume
    </button>
  );
}
