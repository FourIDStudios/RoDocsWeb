import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  Star,
  Trophy,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
  status: "pending" | "submitted" | "graded";
  grade?: number;
}

interface Course {
  id: string;
  name: string;
  instructor: string;
  progress: number;
}

interface ScheduleEvent {
  id: string;
  title: string;
  course: string;
  startTime: Date;
  endTime: Date;
  location: string;
}

interface StudentDashboardProps {
  studentName?: string;
  studentAvatar?: string;
  level?: number;
  xp?: number;
  nextLevelXp?: number;
  assignments?: Assignment[];
  courses?: Course[];
  schedule?: ScheduleEvent[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentName = "Alex Johnson",
  studentAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  level = 5,
  xp = 350,
  nextLevelXp = 500,
  assignments = [
    {
      id: "1",
      title: "Introduction to React Hooks",
      course: "Web Development",
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      status: "pending",
    },
    {
      id: "2",
      title: "Database Design Project",
      course: "Database Systems",
      dueDate: new Date(Date.now() + 172800000), // day after tomorrow
      status: "pending",
    },
    {
      id: "3",
      title: "Algorithm Analysis",
      course: "Data Structures",
      dueDate: new Date(Date.now() - 86400000), // yesterday
      status: "submitted",
    },
    {
      id: "4",
      title: "UI/UX Case Study",
      course: "User Interface Design",
      dueDate: new Date(Date.now() - 172800000), // two days ago
      status: "graded",
      grade: 92,
    },
  ],
  courses = [
    {
      id: "1",
      name: "Web Development",
      instructor: "Dr. Smith",
      progress: 65,
    },
    {
      id: "2",
      name: "Database Systems",
      instructor: "Prof. Johnson",
      progress: 42,
    },
    {
      id: "3",
      name: "Data Structures",
      instructor: "Dr. Williams",
      progress: 78,
    },
    {
      id: "4",
      name: "User Interface Design",
      instructor: "Prof. Davis",
      progress: 90,
    },
  ],
  schedule = [
    {
      id: "1",
      title: "Web Development Lecture",
      course: "Web Development",
      startTime: new Date(new Date().setHours(10, 0, 0, 0)),
      endTime: new Date(new Date().setHours(11, 30, 0, 0)),
      location: "Room 301",
    },
    {
      id: "2",
      title: "Database Lab",
      course: "Database Systems",
      startTime: new Date(new Date().setHours(13, 0, 0, 0)),
      endTime: new Date(new Date().setHours(14, 30, 0, 0)),
      location: "Computer Lab 2",
    },
    {
      id: "3",
      title: "Data Structures Office Hours",
      course: "Data Structures",
      startTime: new Date(new Date().setHours(15, 0, 0, 0)),
      endTime: new Date(new Date().setHours(16, 0, 0, 0)),
      location: "Professor's Office",
    },
  ],
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter assignments by status
  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const submittedAssignments = assignments.filter(
    (a) => a.status === "submitted",
  );
  const gradedAssignments = assignments.filter((a) => a.status === "graded");

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Format time for display
  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="bg-background p-6 min-h-screen">
      {/* Student Profile and XP Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={studentAvatar} alt={studentName} />
            <AvatarFallback>
              {studentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{studentName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Level {level}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {xp}/{nextLevelXp} XP
              </span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to Level {level + 1}</span>
            <span>{Math.round((xp / nextLevelXp) * 100)}%</span>
          </div>
          <Progress value={(xp / nextLevelXp) * 100} className="h-2" />
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pending Assignments */}
            <Card>
              <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Pending
                </CardTitle>
                <CardDescription>Assignments due soon</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {pendingAssignments.length > 0 ? (
                  <div className="space-y-4">
                    {pendingAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.course}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">
                            Due: {formatDate(assignment.dueDate)}
                          </span>
                          <Button size="sm" variant="outline">
                            Submit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No pending assignments
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submitted Assignments */}
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  Submitted
                </CardTitle>
                <CardDescription>Waiting for grades</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {submittedAssignments.length > 0 ? (
                  <div className="space-y-4">
                    {submittedAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.course}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">
                            Submitted on {formatDate(assignment.dueDate)}
                          </span>
                          <Badge variant="outline">Pending Review</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No submitted assignments
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Graded Assignments */}
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-950/20">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-500" />
                  Graded
                </CardTitle>
                <CardDescription>Completed assignments</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {gradedAssignments.length > 0 ? (
                  <div className="space-y-4">
                    {gradedAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.course}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">
                            Graded on {formatDate(assignment.dueDate)}
                          </span>
                          <Badge
                            className={
                              assignment.grade && assignment.grade >= 90
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }
                          >
                            {assignment.grade}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No graded assignments
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>
                    Instructor: {course.instructor}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Materials
                  </Button>
                  <Button size="sm">Go to Course</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view events</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>{formatDate(new Date())}</CardDescription>
              </CardHeader>
              <CardContent>
                {schedule.length > 0 ? (
                  <div className="space-y-4">
                    {schedule.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="bg-primary/10 p-2 rounded-md text-center min-w-[80px]">
                          <div className="text-sm font-medium">
                            {formatTime(event.startTime)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            to {formatTime(event.endTime)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.course}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Bell className="h-3 w-3" />
                            <span>Location: {event.location}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No events scheduled for today
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
