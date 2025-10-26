export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor';
  enrolledCourses: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorName: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: Lesson[];
  enrolledStudents: string[];
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

export interface Progress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastAccessed: string;
}
