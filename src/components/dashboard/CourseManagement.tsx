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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  PlusCircle,
  Edit,
  Trash2,
  Users,
  Clock,
  Calendar as CalendarIcon2,
} from "lucide-react";

interface Course {
  id: string;
  name: string;
  description: string;
  schedule: string;
  startDate: Date;
  endDate: Date;
  studentCount: number;
  discordChannel: string;
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      name: "Introduction to Computer Science",
      description:
        "A foundational course covering basic programming concepts and computer science principles.",
      schedule: "Mon, Wed, Fri 10:00 AM - 11:30 AM",
      startDate: new Date(2023, 8, 1),
      endDate: new Date(2023, 11, 15),
      studentCount: 32,
      discordChannel: "intro-cs",
    },
    {
      id: "2",
      name: "Web Development Fundamentals",
      description:
        "Learn HTML, CSS, and JavaScript to build responsive websites.",
      schedule: "Tue, Thu 1:00 PM - 3:00 PM",
      startDate: new Date(2023, 8, 2),
      endDate: new Date(2023, 11, 14),
      studentCount: 28,
      discordChannel: "web-dev",
    },
    {
      id: "3",
      name: "Data Structures and Algorithms",
      description:
        "Advanced course covering essential data structures and algorithm design techniques.",
      schedule: "Mon, Wed 2:00 PM - 4:00 PM",
      startDate: new Date(2023, 8, 1),
      endDate: new Date(2023, 11, 13),
      studentCount: 24,
      discordChannel: "dsa-course",
    },
  ]);

  const [isNewCourseDialogOpen, setIsNewCourseDialogOpen] = useState(false);
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const handleAddCourse = () => {
    // In a real app, this would send data to an API
    const newCourse: Course = {
      id: Math.random().toString(36).substring(7),
      name: "New Course",
      description: "Course description",
      schedule: "TBD",
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      studentCount: 0,
      discordChannel: "new-course",
    };

    setCourses([...courses, newCourse]);
    setIsNewCourseDialogOpen(false);
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;

    // In a real app, this would update data via an API
    const updatedCourses = courses.map((course) =>
      course.id === selectedCourse.id ? selectedCourse : course,
    );

    setCourses(updatedCourses);
    setIsEditCourseDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    // In a real app, this would delete data via an API
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
  };

  const openEditDialog = (course: Course) => {
    setSelectedCourse({ ...course });
    setStartDate(course.startDate);
    setEndDate(course.endDate);
    setIsEditCourseDialogOpen(true);
  };

  return (
    <div className="bg-background p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <Dialog
          open={isNewCourseDialogOpen}
          onOpenChange={setIsNewCourseDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Add a new course that will be synced with Discord channels.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Course name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Course description"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule" className="text-right">
                  Schedule
                </Label>
                <Input
                  id="schedule"
                  placeholder="e.g. Mon, Wed, Fri 10:00 AM - 11:30 AM"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discordChannel" className="text-right">
                  Discord Channel
                </Label>
                <Input
                  id="discordChannel"
                  placeholder="Channel name"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewCourseDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCourse}>Create Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="active">Active Courses</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Courses</TabsTrigger>
          <TabsTrigger value="archived">Archived Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {format(course.startDate, "MMM d, yyyy")} -{" "}
                        {format(course.endDate, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{course.studentCount} Students</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(course)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the course "{course.name}
                          " and remove the associated Discord channel. This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex flex-col items-center justify-center h-40 bg-muted rounded-lg">
            <p className="text-muted-foreground">No upcoming courses</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsNewCourseDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Schedule New Course
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <div className="flex flex-col items-center justify-center h-40 bg-muted rounded-lg">
            <p className="text-muted-foreground">No archived courses</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Course Dialog */}
      {selectedCourse && (
        <Dialog
          open={isEditCourseDialogOpen}
          onOpenChange={setIsEditCourseDialogOpen}
        >
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update course details and Discord channel settings.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={selectedCourse.name}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedCourse.description}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-schedule" className="text-right">
                  Schedule
                </Label>
                <Input
                  id="edit-schedule"
                  value={selectedCourse.schedule}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      schedule: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-startDate" className="text-right">
                  Start Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          if (date)
                            setSelectedCourse({
                              ...selectedCourse,
                              startDate: date,
                            });
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-endDate" className="text-right">
                  End Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          if (date)
                            setSelectedCourse({
                              ...selectedCourse,
                              endDate: date,
                            });
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-discordChannel" className="text-right">
                  Discord Channel
                </Label>
                <Input
                  id="edit-discordChannel"
                  value={selectedCourse.discordChannel}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      discordChannel: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditCourseDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditCourse}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CourseManagement;
