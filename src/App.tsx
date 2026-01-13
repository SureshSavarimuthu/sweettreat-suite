import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ComingSoon from "./pages/ComingSoon";
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
          <Route path="/franchises" element={<ComingSoon title="Franchise Management" />} />
          <Route path="/central-hub" element={<ComingSoon title="Central Hub" />} />
          <Route path="/employees" element={<ComingSoon title="Employee Management" />} />
          <Route path="/reports" element={<ComingSoon title="Reports" />} />
          <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
          <Route path="/attendance" element={<ComingSoon title="Attendance" />} />
          <Route path="/new-product-launch" element={<ComingSoon title="Product Launch" />} />
          <Route path="/invoices" element={<ComingSoon title="Invoices" />} />
          <Route path="/orders" element={<ComingSoon title="Orders" />} />
          <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
          <Route path="/careers" element={<ComingSoon title="Careers" />} />
          <Route path="/profile" element={<ComingSoon title="Profile" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
