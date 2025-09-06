import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      toast.success("Login successful ");
      nav("/builder");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sign in to your account
        </h1>
        <form onSubmit={submit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            type="submit"
          >
            Sign In
          </button>
          <p className="text-center text-gray-600 text-sm mt-4">You have not any account? <span onClick={()=>nav("/register")} className="text-blue-600 font-semibold cursor-pointer hover:underline"> Create New Account</span></p>
        </form>
      </motion.div>
    </div>
  );
}
