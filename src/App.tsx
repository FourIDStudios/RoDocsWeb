import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./pages/Dashboard";
import routes from "tempo-routes";
import { supabase } from "./lib/supabase";

// Auth callback handler component
const AuthCallback = () => {
  useEffect(() => {
    // Use auth state change listener instead of immediate session check
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log("Auth state changed:", event, session);

        if (event === "SIGNED_IN" && session) {
          // Get user type from localStorage
          const userType = localStorage.getItem("userType") as
            | "student"
            | "teacher"
            | null;
          console.log("User type from localStorage:", userType);

          if (userType) {
            // Check if profile exists
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            console.log("Profile check:", profile, "Error:", profileError);

            // Create profile if missing
            if (!profile) {
              console.log("Creating new profile");
              const { error: insertError } = await supabase
                .from("profiles")
                .insert({
                  id: session.user.id,
                  user_type: userType,
                  created_at: new Date().toISOString(),
                });

              if (insertError) {
                console.error("Error creating profile:", insertError);
              }
            }
          }

          console.log("Redirecting to dashboard");
          window.location.href = "/dashboard";
        } else {
          console.log("No valid session, redirecting to home");
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Auth callback processing error:", err);
        window.location.href = "/";
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array ensures this runs once

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg">Processing login...</p>
      </div>
    </div>
  );
};

function App() {
  // Set up auth state listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in:", session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* Render tempo routes if in tempo environment */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<div />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
