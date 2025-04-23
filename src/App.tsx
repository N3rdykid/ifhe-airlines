
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import BookingPage from "./pages/BookingPage";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/auth" 
                element={
                  session ? <Navigate to="/" replace /> : <Auth />
                } 
              />
              <Route 
                path="/login" 
                element={
                  session ? <Navigate to="/" replace /> : <Navigate to="/auth" replace state={{ initialView: "login" }} />
                } 
              />
              <Route 
                path="/signup" 
                element={
                  session ? <Navigate to="/" replace /> : <Navigate to="/auth" replace state={{ initialView: "signup" }} />
                } 
              />
              <Route 
                path="/booking/:flightId" 
                element={
                  session ? <BookingPage /> : <Navigate to="/auth" replace />
                } 
              />
              <Route 
                path="/bookings" 
                element={
                  session ? <Bookings /> : <Navigate to="/auth" replace />
                } 
              />
              <Route 
                path="/admin" 
                element={
                  session ? <AdminDashboard /> : <Navigate to="/auth" replace />
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
