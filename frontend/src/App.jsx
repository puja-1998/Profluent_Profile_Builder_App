import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-1 items-center justify-center pt-20">
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-200 text-center max-w-lg p-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
            Profluent Profile Builder
          </h1>
          <p className="text-gray-600 mb-6">
            Build and share your professional profile with ease.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <button className="cursor-pointer px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
            <Link to="/builder">
              <button className="cursor-pointer px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
                Start Building
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
