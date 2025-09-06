import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; 
import CreditsHud from "./CreditsHud";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-gray-300 border-b shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / App Name */}
        <button
          onClick={() => navigate("/")}
          className="text-xl font-bold text-blue-600 focus:outline-none"
        >
          Profluent
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/builder"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Builder
          </Link>
          <Link
            to="/billing"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Billing
          </Link>
          <CreditsHud />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white border-t shadow-lg flex flex-col gap-4 px-6 py-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/builder"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
              onClick={() => setIsOpen(false)}
            >
              Builder
            </Link>
            <Link
              to="/billing"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
              onClick={() => setIsOpen(false)}
            >
              Billing
            </Link>
            <CreditsHud />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
