import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  PlusIcon,
  FileEditIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Course {
  id: string;
  name: string;
  description: string;
  schedule: string;
  students: number;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
  status: "active" | "past";
  submissions: number;
  totalStudents: number;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  attendance: number;
  assignments: number;
  grade: string;
}

const TeacherDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);

  // Mock data
  const courses: Course[] = [
    {
      id: "1",
      name: "Introduction to Programming",
      description: "Learn the basics of programming with Python",
      schedule: "Mon, Wed 10:00 AM",
      students: 24,
    },
    {
      id: "2",
      name: "Web Development",
      description: "HTML, CSS, and JavaScript fundamentals",
      schedule: "Tue, Thu 2:00 PM",
      students: 18,
    },
    {
      id: "3",
      name: "Data Structures",
      description: "Advanced programming concepts and data structures",
      schedule: "Mon, Fri 1:00 PM",
      students: 15,
    },
  ];

  const assignments: Assignment[] = [
    {
      id: "1",
      title: "Python Basics Quiz",
      course: "Introduction to Programming",
      dueDate: new Date(2023, 5, 15),
      status: "past",
      submissions: 22,
      totalStudents: 24,
    },
    {
      id: "2",
      title: "HTML Portfolio Project",
      course: "Web Development",
      dueDate: new Date(2023, 5, 20),
      status: "active",
      submissions: 10,
      totalStudents: 18,
    },
    {
      id: "3",
      title: "Linked List Implementation",
      course: "Data Structures",
      dueDate: new Date(2023, 5, 25),
      status: "active",
      submissions: 5,
      totalStudents: 15,
    },
  ];

  const students: Student[] = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      attendance: 90,
      assignments: 8,
      grade: "A",
    },
    {
      id: "2",
      name: "Sam Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
      attendance: 85,
      assignments: 7,
      grade: "B+",
    },
    {
      id: "3",
      name: "Taylor Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor",
      attendance: 95,
      assignments: 9,
      grade: "A+",
    },
    {
      id: "4",
      name: "Jordan Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
      attendance: 75,
      assignments: 6,
      grade: "C+",
    },
  ];

  return (
    <div className="p-6 bg-background w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Dialog
            open={isCreateCourseOpen}
            onOpenChange={setIsCreateCourseOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new course.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="course-name"
                    className="col-span-3"
                    placeholder="Introduction to Programming"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="course-description"
                    className="col-span-3"
                    placeholder="Course description..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course-schedule" className="text-right">
                    Schedule
                  </Label>
                  <Input
                    id="course-schedule"
                    className="col-span-3"
                    placeholder="Mon, Wed 10:00 AM"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateCourseOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateCourseOpen(false)}>
                  Create Course
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Schedule:
                      </span>
                      <span className="text-sm font-medium">
                        {course.schedule}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Students:
                      </span>
                      <span className="text-sm font-medium">
                        {course.students}
                      </span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        <FileEditIcon className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        <TrashIcon className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-between mb-4">
            <div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.title}
                      </TableCell>
                      <TableCell>{assignment.course}</TableCell>
                      <TableCell>
                        {format(assignment.dueDate, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${assignment.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {assignment.status === "active" ? "Active" : "Past"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.submissions} / {assignment.totalStudents}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileEditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between mb-4">
            <Input className="max-w-sm" placeholder="Search students..." />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Assignments Completed</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.attendance}%</TableCell>
                      <TableCell>{student.assignments}/10</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="flex justify-between mb-4">
            <Select defaultValue="1">
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Last 7 days
              </Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>
                  Average attendance rate for selected course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px]">
                  <div className="text-center">
                    <div className="text-5xl font-bold">86%</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Average attendance
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Last 5 class sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - i * 2);
                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">
                            {format(date, "EEEE, MMM dd")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            10:00 AM - 11:30 AM
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {20 - Math.floor(Math.random() * 5)}/24
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Students present
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Attendance Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Overall Attendance</TableHead>
                    <TableHead>Last Session</TableHead>
                    <TableHead>Consecutive Sessions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.attendance}%</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {Math.random() > 0.2 ? (
                            <CheckIcon className="h-5 w-5 text-green-500 mr-1" />
                          ) : (
                            <XIcon className="h-5 w-5 text-red-500 mr-1" />
                          )}
                          {Math.random() > 0.2 ? "Present" : "Absent"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {Math.floor(Math.random() * 10) + 1}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
