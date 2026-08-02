import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AzaBotWidget from "@/components/AzaBot/AzaBotWidget";
import Index from "./pages/Index.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import AuthLoginPage from "./pages/auth/AuthLoginPage.tsx";
import CheckEmailPage from "./pages/auth/CheckEmailPage.tsx";
import VerifyPage from "./pages/auth/VerifyPage.tsx";
import SuccessPage from "./pages/auth/SuccessPage.tsx";
import SettingsPage from "./pages/auth/SettingsPage.tsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage.tsx";
import AuthAdminPage from "./pages/admin/AuthAdminPage.tsx";
import WebhooksAdminPage from "./pages/admin/WebhooksAdminPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup/:type" element={<SignupPage />} />
              <Route path="/auth/login" element={<AuthLoginPage />} />
              <Route path="/auth/check-email" element={<CheckEmailPage />} />
              <Route path="/auth/verify" element={<VerifyPage />} />
              <Route path="/auth/success" element={<SuccessPage />} />
              <Route path="/auth/settings" element={<SettingsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverviewPage />} />
                <Route path="auth" element={<AuthAdminPage />} />
                <Route path="webhooks" element={<WebhooksAdminPage />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <AzaBotWidget />
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
