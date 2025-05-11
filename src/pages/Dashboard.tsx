import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  LogOut,
  Settings,
  User,
  BookOpen,
  Calendar,
  BarChart2,
  Award,
  Loader2,
} from "lucide-react";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [userRole, setUserRole] = useState<"student" | "teacher">("student");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    id: string;
    name: string;
    avatar: string;
    level: number | null;
    xp: number | null;
    courses: Array<any>;
  }>({
    id: "",
    name: "",
    avatar: "",
    level: null,
    xp: null,
    courses: [],
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Dashboard: Checking authentication");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Dashboard: Session check result:", session);

        if (!session) {
          console.log("Dashboard: No session, redirecting to login");
          navigate("/");
          return;
        }

        setIsAuthenticated(true);

        // Get user profile from database
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        console.log(
          "Dashboard: Profile data:",
          profile,
          "Error:",
          profileError,
        );

        if (profile) {
          setUserRole(profile.user_type as "student" | "teacher");

          // Get Discord user details
          const discordUser = session.user.user_metadata;
          console.log("Dashboard: Discord user metadata:", discordUser);

          // Get courses data - handle case where tables might not exist yet
          let courses = [];
          try {
            const { data: coursesData } = await supabase
              .from(
                profile.user_type === "student"
                  ? "student_courses"
                  : "teacher_courses",
              )
              .select("*")
              .eq("user_id", session.user.id);

            if (coursesData) courses = coursesData;
          } catch (err) {
            console.log("Dashboard: Courses tables may not exist yet:", err);
          }

          setUserData({
            id: session.user.id,
            name:
              discordUser?.full_name ||
              discordUser?.name ||
              discordUser?.global_name ||
              "Discord User",
            avatar:
              discordUser?.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            level: profile.user_type === "student" ? profile.level || 1 : null,
            xp: profile.user_type === "student" ? profile.xp || 0 : null,
            courses: courses || [],
          });
        } else {
          // If profile doesn't exist, create one
          const userType =
            (localStorage.getItem("userType") as "student" | "teacher") ||
            "student";

          console.log("Dashboard: Creating new profile with type:", userType);

          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: session.user.id,
              user_type: userType,
              level: userType === "student" ? 1 : null,
              xp: userType === "student" ? 0 : null,
              created_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error("Dashboard: Error creating profile:", insertError);
            throw insertError;
          }

          setUserRole(userType);

          // Get Discord user details
          const discordUser = session.user.user_metadata;

          setUserData({
            id: session.user.id,
            name:
              discordUser?.full_name ||
              discordUser?.name ||
              discordUser?.global_name ||
              "Discord User",
            avatar:
              discordUser?.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            level: userType === "student" ? 1 : null,
            xp: userType === "student" ? 0 : null,
            courses: [],
          });
        }
      } catch (error) {
        console.error("Dashboard: Error loading user data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data. Please try again.",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  // Logout function
  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      localStorage.removeItem("userType");
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle between student and teacher views
  const toggleUserRole = async () => {
    try {
      setLoading(true);
      const newRole = userRole === "student" ? "teacher" : "student";

      // Update user profile in database
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await supabase
          .from("profiles")
          .update({
            user_type: newRole,
            level: newRole === "student" ? 1 : null,
            xp: newRole === "student" ? 0 : null,
          })
          .eq("id", session.user.id);
      }

      setUserRole(newRole);
      setUserData((prev) => ({
        ...prev,
        level: newRole === "student" ? 1 : null,
        xp: newRole === "student" ? 0 : null,
      }));

      toast({
        title: "View Changed",
        description: `Switched to ${newRole} view`,
      });
    } catch (error) {
      console.error("Error toggling user role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change user role. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-[400px] p-6">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl font-bold">Course Management Dashboard</h1>
            <p className="text-muted-foreground text-center">
              Log in with Discord to access your courses, assignments, and more.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2">
                <path
                  fill="currentColor"
                  d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.03.09.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"
                />
              </svg>
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center justify-center mb-8 mt-4">
          <h1 className="text-xl font-bold">CourseBot</h1>
        </div>

        {/* User profile section */}
        <div className="flex flex-col items-center mb-8 p-4 border rounded-lg">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>
              {userData.name ? userData.name.charAt(0) : "U"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-medium">
            {userData.name || "Discord User"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </p>

          {userRole === "student" && (
            <div className="mt-2 w-full">
              <div className="flex justify-between text-xs mb-1">
                <span>Level {userData.level}</span>
                <span>{userData.xp} XP</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(userData.xp! % 1000) / 10}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start">
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <BarChart2 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          {userRole === "student" && (
            <Button variant="ghost" className="w-full justify-start">
              <Award className="mr-2 h-4 w-4" />
              Achievements
            </Button>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="mt-auto space-y-2 pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={toggleUserRole}
          >
            <User className="mr-2 h-4 w-4" />
            Switch to {userRole === "student" ? "Teacher" : "Student"} View
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {userRole === "student" ? "Student Dashboard" : "Teacher Dashboard"}
          </h1>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Dashboard content based on user role */}
        {userRole === "student" ? <StudentDashboard /> : <TeacherDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
