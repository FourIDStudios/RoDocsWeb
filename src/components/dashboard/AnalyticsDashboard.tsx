import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DownloadIcon, FilterIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface AnalyticsDashboardProps {
  userRole?: "student" | "teacher";
  courseId?: string;
  studentId?: string;
  dateRange?: [Date, Date];
}

const AnalyticsDashboard = ({
  userRole = "teacher",
  courseId,
  studentId,
  dateRange = [
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date(),
  ],
}: AnalyticsDashboardProps) => {
  const [selectedCourse, setSelectedCourse] = React.useState<string>(
    courseId || "all",
  );
  const [selectedStudent, setSelectedStudent] = React.useState<string>(
    studentId || "all",
  );
  const [selectedDateRange, setSelectedDateRange] =
    React.useState<[Date, Date]>(dateRange);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Mock data for charts
  const attendanceData = [
    { name: "Week 1", present: 85, absent: 15 },
    { name: "Week 2", present: 78, absent: 22 },
    { name: "Week 3", present: 92, absent: 8 },
    { name: "Week 4", present: 88, absent: 12 },
    { name: "Week 5", present: 95, absent: 5 },
    { name: "Week 6", present: 80, absent: 20 },
  ];

  const assignmentCompletionData = [
    { name: "Assignment 1", onTime: 75, late: 20, missing: 5 },
    { name: "Assignment 2", onTime: 65, late: 25, missing: 10 },
    { name: "Assignment 3", onTime: 80, late: 15, missing: 5 },
    { name: "Assignment 4", onTime: 70, late: 20, missing: 10 },
  ];

  const engagementData = [
    { name: "Mon", value: 65 },
    { name: "Tue", value: 75 },
    { name: "Wed", value: 85 },
    { name: "Thu", value: 70 },
    { name: "Fri", value: 60 },
    { name: "Sat", value: 40 },
    { name: "Sun", value: 30 },
  ];

  const gradeDistributionData = [
    { name: "A", value: 30 },
    { name: "B", value: 40 },
    { name: "C", value: 20 },
    { name: "D", value: 7 },
    { name: "F", value: 3 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Mock courses and students for filters
  const courses = [
    { id: "course1", name: "Introduction to Programming" },
    { id: "course2", name: "Data Structures" },
    { id: "course3", name: "Algorithms" },
  ];

  const students = [
    { id: "student1", name: "John Doe" },
    { id: "student2", name: "Jane Smith" },
    { id: "student3", name: "Bob Johnson" },
  ];

  return (
    <div className="bg-background p-6 rounded-lg w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-muted/50 p-4 rounded-lg">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Course</span>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select course" />
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

          {userRole === "teacher" && (
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium">Student</span>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Date Range</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDateRange[0], "PPP")} -{" "}
                  {format(selectedDateRange[1], "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Dashboard Content */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
          </TabsList>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Overview</CardTitle>
                  <CardDescription>
                    Weekly attendance rates for the selected course
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#4ade80" name="Present" />
                      <Bar dataKey="absent" fill="#f87171" name="Absent" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Statistics</CardTitle>
                  <CardDescription>
                    Summary of attendance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Attendance Rate:</span>
                      <span className="font-bold">86%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Perfect Attendance:</span>
                      <span className="font-bold">12 students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>At Risk Students:</span>
                      <span className="font-bold text-red-500">3 students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Most Attended Day:</span>
                      <span className="font-bold">Wednesday</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Least Attended Day:</span>
                      <span className="font-bold">Friday</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Completion</CardTitle>
                  <CardDescription>
                    Submission status for each assignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assignmentCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="onTime"
                        stackId="a"
                        fill="#4ade80"
                        name="On Time"
                      />
                      <Bar
                        dataKey="late"
                        stackId="a"
                        fill="#facc15"
                        name="Late"
                      />
                      <Bar
                        dataKey="missing"
                        stackId="a"
                        fill="#f87171"
                        name="Missing"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assignment Statistics</CardTitle>
                  <CardDescription>
                    Summary of assignment metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Completion Rate:</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>On-Time Submission Rate:</span>
                      <span className="font-bold">72%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Late Submission Rate:</span>
                      <span className="font-bold text-yellow-500">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Missing Submission Rate:</span>
                      <span className="font-bold text-red-500">8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Most Challenging Assignment:</span>
                      <span className="font-bold">Assignment 2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Engagement</CardTitle>
                  <CardDescription>
                    Student participation throughout the week
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        name="Engagement Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Statistics</CardTitle>
                  <CardDescription>
                    Summary of student engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Engagement Score:</span>
                      <span className="font-bold">65/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Most Active Day:</span>
                      <span className="font-bold">Wednesday</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Least Active Day:</span>
                      <span className="font-bold">Sunday</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Voice Channel Participation:</span>
                      <span className="font-bold">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Discussion Participation:</span>
                      <span className="font-bold">62%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>
                    Overall grade distribution for the course
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {gradeDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grade Statistics</CardTitle>
                  <CardDescription>Summary of grade metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Class Average:</span>
                      <span className="font-bold">B (85%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Highest Grade:</span>
                      <span className="font-bold text-green-500">A+ (98%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lowest Grade:</span>
                      <span className="font-bold text-red-500">F (55%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Students Above Average:</span>
                      <span className="font-bold">18 students</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Students Below Average:</span>
                      <span className="font-bold">12 students</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
