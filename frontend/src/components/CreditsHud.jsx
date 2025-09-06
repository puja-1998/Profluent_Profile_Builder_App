import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export default function CreditsHud() {
  // Fetch user info from backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    refetchInterval: 30_000, // refresh credits every 30s
  });

  if (isLoading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (isError) return <div className="text-sm text-red-500">Error</div>;

  return (
    <div className="px-3 py-1 bg-white border rounded-lg shadow-sm text-sm font-medium text-gray-700">
      Credits: <span className="font-bold">{data?.credits ?? 0}</span>
    </div>
  );
}
