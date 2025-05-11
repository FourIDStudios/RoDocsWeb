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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  FileText,
  Filter,
  Plus,
  Search,
  Upload,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  course: string;
  status: "upcoming" | "submitted" | "graded" | "overdue";
  grade?: number;
  feedback?: string;
}

interface AssignmentPanelProps {
  userRole?: "student" | "teacher";
  assignments?: Assignment[];
}

const AssignmentPanel = ({
  userRole = "student",
  assignments: propAssignments = [],
}: AssignmentPanelProps) => {
  const [assignments] = useState<Assignment[]>(
    propAssignments.length > 0
      ? propAssignments
      : [
          {
            id: "1",
            title: "Introduction to React Hooks",
            description:
              "Create a simple application demonstrating the use of useState, useEffect, and useContext hooks.",
            dueDate: new Date(2023, 5, 15),
            course: "Web Development",
            status: "upcoming",
          },
          {
            id: "2",
            title: "Database Schema Design",
            description:
              "Design a normalized database schema for an e-commerce platform.",
            dueDate: new Date(2023, 4, 30),
            course: "Database Systems",
            status: "submitted",
          },
          {
            id: "3",
            title: "Algorithm Efficiency Analysis",
            description:
              "Analyze the time and space complexity of the provided sorting algorithms.",
            dueDate: new Date(2023, 4, 20),
            course: "Data Structures & Algorithms",
            status: "graded",
            grade: 85,
            feedback:
              "Good analysis, but missed some edge cases in the merge sort discussion.",
          },
        ],
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  // For teacher's assignment creation
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentDescription, setNewAssignmentDescription] = useState("");
  const [newAssignmentCourse, setNewAssignmentCourse] = useState("");
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState<
    Date | undefined
  >(new Date());

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse
      ? assignment.course === selectedCourse
      : true;
    return matchesSearch && matchesCourse;
  });

  const courses = [...new Set(assignments.map((a) => a.course))];

  // getStatusBadge function moved outside components

  return (
    <div className="bg-background w-full p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Filter by Course</h4>
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Filter by Date</h4>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs
        defaultValue={userRole === "teacher" ? "manage" : "upcoming"}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {userRole === "student" ? (
            <>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="manage">Manage</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="grade">Grade</TabsTrigger>
            </>
          )}
        </TabsList>

        {userRole === "student" ? (
          <>
            <TabsContent value="upcoming" className="space-y-4">
              {filteredAssignments
                .filter((a) => a.status === "upcoming")
                .map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    userRole={userRole}
                  />
                ))}
            </TabsContent>
            <TabsContent value="submitted" className="space-y-4">
              {filteredAssignments
                .filter((a) => a.status === "submitted")
                .map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    userRole={userRole}
                  />
                ))}
            </TabsContent>
            <TabsContent value="graded" className="space-y-4">
              {filteredAssignments
                .filter((a) => a.status === "graded")
                .map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    userRole={userRole}
                  />
                ))}
            </TabsContent>
          </>
        ) : (
          <>
            <TabsContent value="manage" className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  userRole={userRole}
                />
              ))}
            </TabsContent>
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Assignment</CardTitle>
                  <CardDescription>
                    Create a new assignment for your students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      placeholder="Assignment title"
                      value={newAssignmentTitle}
                      onChange={(e) => setNewAssignmentTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Assignment description and instructions"
                      rows={5}
                      value={newAssignmentDescription}
                      onChange={(e) =>
                        setNewAssignmentDescription(e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="course" className="text-sm font-medium">
                        Course
                      </label>
                      <Select
                        value={newAssignmentCourse}
                        onValueChange={setNewAssignmentCourse}
                      >
                        <SelectTrigger id="course">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="dueDate" className="text-sm font-medium">
                        Due Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="dueDate"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newAssignmentDueDate ? (
                              format(newAssignmentDueDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newAssignmentDueDate}
                            onSelect={setNewAssignmentDueDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto">
                    <Plus className="mr-2 h-4 w-4" /> Create Assignment
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="grade" className="space-y-4">
              {filteredAssignments
                .filter((a) => a.status === "submitted")
                .map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    userRole={userRole}
                    grading
                  />
                ))}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

// Helper function moved outside of components to be accessible by both
const getStatusBadge = (status: string) => {
  switch (status) {
    case "upcoming":
      return <Badge variant="secondary">Upcoming</Badge>;
    case "submitted":
      return <Badge variant="outline">Submitted</Badge>;
    case "graded":
      return <Badge variant="default">Graded</Badge>;
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>;
    default:
      return null;
  }
};

interface AssignmentCardProps {
  assignment: Assignment;
  userRole: "student" | "teacher";
  grading?: boolean;
}

const AssignmentCard = ({
  assignment,
  userRole,
  grading,
}: AssignmentCardProps) => {
  const [grade, setGrade] = useState<string>(
    assignment.grade?.toString() || "",
  );
  const [feedback, setFeedback] = useState<string>(assignment.feedback || "");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>{assignment.course}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(assignment.status)}
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {format(assignment.dueDate, "PPP")}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{assignment.description}</p>

        {assignment.status === "graded" && userRole === "student" && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Grade:</span>
              <span className="font-bold">{assignment.grade}%</span>
            </div>
            <div>
              <span className="font-medium">Feedback:</span>
              <p className="mt-1 text-sm">{assignment.feedback}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {userRole === "student" ? (
          assignment.status === "upcoming" ? (
            <>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" /> View Details
              </Button>
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Submit
              </Button>
            </>
          ) : (
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> View Details
            </Button>
          )
        ) : grading ? (
          <>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="grade"
                  className="text-sm font-medium block mb-1"
                >
                  Grade (%)
                </label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="feedback"
                  className="text-sm font-medium block mb-1"
                >
                  Feedback
                </label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            <Button>Submit Grade</Button>
          </>
        ) : (
          <>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> View Submissions
            </Button>
            <Button variant="outline">Edit</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AssignmentPanel;
