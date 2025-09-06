import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Builder from "./pages/Builder.jsx";
import Billing from "./pages/Billing.jsx";
import { Toaster } from "react-hot-toast"; // ✅ Toast provider
import PreviewPage from "./pages/PreviewPage.jsx";

// ✅ Create a QueryClient instance (required for React Query)
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </QueryClientProvider>
  </StrictMode>
);
