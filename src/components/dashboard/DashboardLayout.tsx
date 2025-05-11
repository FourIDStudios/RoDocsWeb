import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

interface DashboardLayoutProps {
  userType?: "student" | "teacher";
  userName?: string;
  userAvatar?: string;
  children?: React.ReactNode;
}

const DashboardLayout = ({
  userType = "student",
  userName = "John Doe",
  userAvatar = "",
  children,
}: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const studentNavItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    { icon: <BookOpen size={20} />, label: "Courses", path: "/courses" },
    {
      icon: <ClipboardList size={20} />,
      label: "Assignments",
      path: "/assignments",
    },
    { icon: <LineChart size={20} />, label: "Grades", path: "/grades" },
    { icon: <Calendar size={20} />, label: "Schedule", path: "/schedule" },
    {
      icon: <MessageSquare size={20} />,
      label: "Messages",
      path: "/messages",
      badge: 3,
    },
  ];

  const teacherNavItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <BookOpen size={20} />,
      label: "Course Management",
      path: "/courses",
    },
    { icon: <Users size={20} />, label: "Attendance", path: "/attendance" },
    {
      icon: <ClipboardList size={20} />,
      label: "Assignments",
      path: "/assignments",
    },
    { icon: <LineChart size={20} />, label: "Analytics", path: "/analytics" },
    {
      icon: <MessageSquare size={20} />,
      label: "Messages",
      path: "/messages",
      badge: 5,
    },
  ];

  const navItems = userType === "student" ? studentNavItems : teacherNavItems;

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-40 h-full bg-card border-r transition-all duration-300 ${sidebarCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div
              className={`flex items-center gap-3 ${sidebarCollapsed && "lg:hidden"}`}
            >
              <GraduationCap size={24} className="text-primary" />
              <h1
                className={`font-bold text-xl ${sidebarCollapsed ? "lg:hidden" : ""}`}
              >
                EduBot
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <TooltipProvider
                    delayDuration={0}
                    disableHoverableContent={!sidebarCollapsed}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive(item.path) ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                        >
                          <span className="flex-shrink-0">{item.icon}</span>
                          <span
                            className={`${sidebarCollapsed ? "lg:hidden" : ""}`}
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={`ml-auto ${sidebarCollapsed ? "lg:hidden" : ""}`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right" className="lg:flex hidden">
                          {item.label}
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2">
                              {item.badge}
                            </Badge>
                          )}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className={`${sidebarCollapsed ? "lg:hidden" : ""}`}>
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userType}
                </p>
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <Settings size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <LogOut size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Logout</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
          <h2 className="text-xl font-semibold">
            {userType === "student" ? "Student Dashboard" : "Teacher Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <MessageSquare size={16} className="mr-2" />
              Support
            </Button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
