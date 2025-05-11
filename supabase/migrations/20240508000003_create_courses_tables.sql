-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id),
  schedule TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  discord_channel TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_courses table for enrollments
CREATE TABLE IF NOT EXISTS student_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Create teacher_courses table for teaching assignments
CREATE TABLE IF NOT EXISTS teacher_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  assignment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_courses ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Teachers can view courses" ON courses;
CREATE POLICY "Teachers can view courses"
  ON courses FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Teachers can insert courses" ON courses;
CREATE POLICY "Teachers can insert courses"
  ON courses FOR INSERT
  WITH CHECK (auth.uid() = instructor_id);

DROP POLICY IF EXISTS "Teachers can update their courses" ON courses;
CREATE POLICY "Teachers can update their courses"
  ON courses FOR UPDATE
  USING (auth.uid() = instructor_id);

DROP POLICY IF EXISTS "Students can view their enrollments" ON student_courses;
CREATE POLICY "Students can view their enrollments"
  ON student_courses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can view their teaching assignments" ON teacher_courses;
CREATE POLICY "Teachers can view their teaching assignments"
  ON teacher_courses FOR SELECT
  USING (auth.uid() = user_id);
