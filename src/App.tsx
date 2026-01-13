import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Franchises from "./pages/Franchises";
import CentralHub from "./pages/CentralHub";
import Employees from "./pages/Employees";
import Orders from "./pages/Orders";
import Invoices from "./pages/Invoices";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import Attendance from "./pages/Attendance";
import ProductLaunch from "./pages/ProductLaunch";
import Careers from "./pages/Careers";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/franchises" element={<Franchises />} />
          <Route path="/central-hub" element={<CentralHub />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/new-product-launch" element={<ProductLaunch />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
