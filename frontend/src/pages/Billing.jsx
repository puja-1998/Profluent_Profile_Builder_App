import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import toast from "react-hot-toast";

export default function Billing() {
  async function go(kind) {
    try {
      const { data } = await api.post("/payments/checkout", { kind });
      window.location.href = data.url;
    } catch (err) {
      toast.error("Failed to start checkout");
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
          {/* Navbar */}
          <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Choose a Plan
        </h1>
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            className="rounded-lg bg-blue-600 text-white px-4 py-3 font-semibold hover:bg-blue-700 transition"
            onClick={() => go("basic")}
          >
            Basic <br /> ₹1,999 <br /> 500 credits
          </button>
          <button
            className="rounded-lg bg-green-600 text-white px-4 py-3 font-semibold hover:bg-green-700 transition"
            onClick={() => go("premium")}
          >
            Premium <br /> ₹2,999 <br /> 1,000 credits
          </button>
          <button
            className="rounded-lg bg-yellow-500 text-white px-4 py-3 font-semibold hover:bg-yellow-600 transition"
            onClick={() => go("topup")}
          >
            Top-up <br /> ₹500 <br /> 100 credits
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
