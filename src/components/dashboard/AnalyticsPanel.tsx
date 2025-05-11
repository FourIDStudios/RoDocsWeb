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
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AnalyticsPanelProps {
  courseId?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

const AnalyticsPanel = ({
  courseId = "1",
  dateRange = { from: new Date(), to: new Date() },
}: AnalyticsPanelProps) => {
  return (
    <div className="w-full h-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Analytics</h2>
        <div className="flex items-center gap-4">
          <Select defaultValue="all-courses">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-courses">All Courses</SelectItem>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="data-science">Data Science</SelectItem>
              <SelectItem value="mobile-dev">Mobile Development</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
          <Button>Export Report</Button>
        </div>
      </div>

      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Patterns</TabsTrigger>
          <TabsTrigger value="completion">Assignment Completion</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EngagementCard
              title="Average Participation"
              value="78%"
              change="+12%"
            />
            <EngagementCard
              title="Discussion Posts"
              value="156"
              change="+23%"
            />
            <EngagementCard title="Resource Views" value="2,345" change="+5%" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
              <CardDescription>
                Student participation across all activities
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Placeholder for chart */}
              <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">
                  Engagement Chart Visualization
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EngagementCard
              title="Average Attendance"
              value="85%"
              change="+3%"
            />
            <EngagementCard
              title="On-time Arrival"
              value="72%"
              change="-5%"
              isNegative
            />
            <EngagementCard title="Full Session" value="68%" change="+7%" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Patterns</CardTitle>
              <CardDescription>Weekly attendance trends</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Placeholder for chart */}
              <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">
                  Attendance Chart Visualization
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Attendees</CardTitle>
              <CardDescription>
                Students with highest attendance rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Alex Johnson",
                  "Maria Garcia",
                  "James Smith",
                  "Sarah Williams",
                  "David Lee",
                ].map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {student
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>
                      <span>{student}</span>
                    </div>
                    <div className="flex items-center gap-2 w-1/3">
                      <Progress value={95 - index * 5} className="h-2" />
                      <span className="text-sm text-muted-foreground w-10 text-right">
                        {95 - index * 5}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completion" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EngagementCard title="Completion Rate" value="76%" change="+8%" />
            <EngagementCard
              title="On-time Submission"
              value="64%"
              change="-3%"
              isNegative
            />
            <EngagementCard title="Average Grade" value="B+" change="+" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assignment Completion Rates</CardTitle>
              <CardDescription>
                Completion rates by assignment type
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Placeholder for chart */}
              <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">
                  Assignment Completion Chart
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Completed Assignments</CardTitle>
                <CardDescription>
                  Assignments with highest completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Project Proposal",
                    "Weekly Quiz",
                    "Reading Response",
                    "Group Discussion",
                  ].map((assignment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{assignment}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92 - index * 7} className="h-2 w-24" />
                        <span className="text-sm text-muted-foreground w-10 text-right">
                          {92 - index * 7}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Least Completed Assignments</CardTitle>
                <CardDescription>
                  Assignments with lowest completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Final Project",
                    "Research Paper",
                    "Midterm Exam",
                    "Coding Challenge",
                  ].map((assignment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{assignment}</span>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={60 - index * 10}
                          className="h-2 w-24"
                        />
                        <span className="text-sm text-muted-foreground w-10 text-right">
                          {60 - index * 10}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface EngagementCardProps {
  title: string;
  value: string;
  change: string;
  isNegative?: boolean;
}

const EngagementCard = ({
  title,
  value,
  change,
  isNegative = false,
}: EngagementCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold">{value}</h3>
            <span
              className={`text-sm ${isNegative ? "text-destructive" : "text-green-500"}`}
            >
              {change}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPanel;
