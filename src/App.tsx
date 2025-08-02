import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Discovery from "./pages/Discovery";
import Integration from "./pages/Integration";
import Community from "./pages/Community";
import KeyManager from "./pages/KeyManager";
import Comparison from "./pages/Comparison";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile"; // ✅ import the page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home onSectionChange={() => {}} />} />
          <Route path="/discovery" element={<Discovery onSectionChange={() => {}} />} />
          <Route path="/integration" element={<Integration onSectionChange={() => {}} />} />
          <Route path="/community" element={<Community />} />
          <Route path="/keys" element={<KeyManager />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/profile" element={<Profile />} /> {/* ✅ add this line */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
