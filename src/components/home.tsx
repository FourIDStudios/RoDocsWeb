import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  GraduationCap,
  LineChart,
  LogIn,
  MessageSquare,
  Users,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"student" | "teacher" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Auth check:", session);

        if (session) {
          setIsAuthenticated(true);
          // Get user profile from database
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", session.user.id)
            .single();

          console.log("Profile data:", profile, "Error:", profileError);

          if (profile) {
            setUserType(profile.user_type as "student" | "teacher");
            navigate("/dashboard");
          } else {
            // If profile doesn't exist yet, create one based on stored user type
            const storedUserType = localStorage.getItem("userType") as
              | "student"
              | "teacher"
              | null;
            if (storedUserType) {
              console.log("Creating new profile with type:", storedUserType);
              await supabase.from("profiles").insert({
                id: session.user.id,
                user_type: storedUserType,
                created_at: new Date().toISOString(),
              });
              setUserType(storedUserType);
              navigate("/dashboard");
            }
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      }
    };

    checkAuth();
  }, [navigate]);

  // Discord OAuth login function
  const handleLogin = async (type: "student" | "teacher") => {
    try {
      setLoading(true);
      setError(null);

      // Store the user type in local storage to retrieve after OAuth redirect
      localStorage.setItem("userType", type);

      // Use a simpler approach with fewer options
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (data?.url) {
        console.log("Redirecting to:", data.url);
        window.location.href = data.url;
      } else {
        console.error("No redirect URL provided");
      }

      console.log("OAuth initiation result:", data, error);

      if (error) throw error;
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login with Discord. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Course Management Dashboard
            </CardTitle>
            <CardDescription>
              Connect with Discord to manage your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Required</AlertTitle>
                <AlertDescription>
                  Please login with Discord to access the dashboard.
                </AlertDescription>
              </Alert>
              <Tabs defaultValue="student">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher</TabsTrigger>
                </TabsList>
                <TabsContent value="student" className="mt-4">
                  <div className="text-center space-y-4">
                    <p>Access your assignments, grades, and schedule</p>
                    <Button
                      onClick={() => handleLogin("student")}
                      className="w-full bg-[#5865F2] hover:bg-[#4752C4]"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <img
                          src="/discord-logo.svg"
                          className="mr-2 h-4 w-4"
                          alt="Discord"
                        />
                      )}
                      {loading
                        ? "Connecting..."
                        : "Login with Discord as Student"}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="teacher" className="mt-4">
                  <div className="text-center space-y-4">
                    <p>Manage courses, track attendance, and view analytics</p>
                    <Button
                      onClick={() => handleLogin("teacher")}
                      className="w-full bg-[#5865F2] hover:bg-[#4752C4]"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <img
                          src="/discord-logo.svg"
                          className="mr-2 h-4 w-4"
                          alt="Discord"
                        />
                      )}
                      {loading
                        ? "Connecting..."
                        : "Login with Discord as Teacher"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col justify-center text-sm text-gray-500">
            <p>Powered by Discord OAuth</p>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Course Management Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">
                {userType === "student" ? "Student" : "Teacher"} Account
              </p>
              <p className="text-sm text-gray-500">Discord Username</p>
            </div>
            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-lg shadow-sm p-4">
          <nav className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Dashboard</h3>
              <ul className="space-y-1">
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" /> Courses
                  </Button>
                </li>
                {userType === "student" ? (
                  <>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        <CheckCircle className="mr-2 h-4 w-4" /> Assignments
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        <GraduationCap className="mr-2 h-4 w-4" /> Grades
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" /> Attendance
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        <LineChart className="mr-2 h-4 w-4" /> Analytics
                      </Button>
                    </li>
                  </>
                )}
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" /> Schedule
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" /> Discord Bot
                  </Button>
                </li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">My Courses</h3>
              <ul className="space-y-1">
                <li>
                  <Button variant="ghost" className="w-full justify-between">
                    <span>Web Development</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-between">
                    <span>Data Structures</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-between">
                    <span>UI/UX Design</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <Card className="bg-white mb-6">
            <CardHeader>
              <CardTitle>
                Welcome to your {userType === "student" ? "Student" : "Teacher"}{" "}
                Dashboard
              </CardTitle>
              <CardDescription>
                {userType === "student"
                  ? "Track your assignments, check grades, and view your schedule"
                  : "Manage courses, track attendance, and view student analytics"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {userType === "student"
                        ? "Upcoming Assignments"
                        : "Active Courses"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {userType === "student" ? "5" : "3"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {userType === "student"
                        ? "Current XP Level"
                        : "Students Enrolled"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {userType === "student" ? "Level 12" : "87"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {userType === "student"
                        ? "Attendance Rate"
                        : "Avg. Attendance Rate"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">92%</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>
                  {userType === "student"
                    ? "Recent Assignments"
                    : "Recent Activities"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <li
                      key={item}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">
                          {userType === "student"
                            ? `Assignment ${item}`
                            : `Course Update ${item}`}
                        </p>
                        <p className="text-sm text-gray-500">Due in 3 days</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {userType === "student" ? "View" : "Manage"}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <li
                      key={item}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">Web Development Class</p>
                        <p className="text-sm text-gray-500">
                          Tomorrow, 10:00 AM
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
