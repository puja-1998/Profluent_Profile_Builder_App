import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function CreditHud() {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const { data } = await api.get("/auth/me");
        setCredits(data.credits);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCredits();
  }, []);

  return (
    <div className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-1 text-sm font-medium text-gray-700">
      Credits: <span className="font-bold text-blue-600">{credits}</span>
    </div>
  );
}
