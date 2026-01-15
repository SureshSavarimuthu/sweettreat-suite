import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductCreate from "./pages/products/ProductCreate";
import ProductEdit from "./pages/products/ProductEdit";
import ProductView from "./pages/products/ProductView";
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
import EmployeeReports from "./pages/reports/EmployeeReports";
import FranchiseReports from "./pages/reports/FranchiseReports";
import ProductReports from "./pages/reports/ProductReports";
import OrderReports from "./pages/reports/OrderReports";
import SalesReports from "./pages/reports/SalesReports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/create" element={<ProductCreate />} />
                <Route path="/products/:slug" element={<ProductView />} />
                <Route path="/products/:slug/edit" element={<ProductEdit />} />
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
                <Route path="/reports/employees" element={<EmployeeReports />} />
                <Route path="/reports/franchises" element={<FranchiseReports />} />
                <Route path="/reports/products" element={<ProductReports />} />
                <Route path="/reports/orders" element={<OrderReports />} />
                <Route path="/reports/sales" element={<SalesReports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
