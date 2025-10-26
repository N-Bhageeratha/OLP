import { User, Course, Progress } from '../types';

const STORAGE_KEYS = {
  USERS: 'learning_platform_users',
  CURRENT_USER: 'learning_platform_current_user',
  COURSES: 'learning_platform_courses',
  PROGRESS: 'learning_platform_progress',
};

export const storage = {
  // User operations
  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (user: User): void => {
    const users = storage.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);

    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUserByEmail: (email: string): User | undefined => {
    if (!email) return undefined;
    const normalized = email.trim().toLowerCase();
    const users = storage.getUsers();
    return users.find(u => u.email && u.email.trim().toLowerCase() === normalized);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  updateUser: (userId: string, updates: Partial<User>): void => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      const currentUser = storage.getCurrentUser();
      if (currentUser?.id === userId) {
        storage.setCurrentUser(users[userIndex]);
      }
    }
  },

  // Course operations
  getCourses: (): Course[] => {
    const courses = localStorage.getItem(STORAGE_KEYS.COURSES);
    return courses ? JSON.parse(courses) : [];
  },

  saveCourse: (course: Course): void => {
    const courses = storage.getCourses();
    const existingIndex = courses.findIndex(c => c.id === course.id);

    if (existingIndex >= 0) {
      courses[existingIndex] = course;
    } else {
      courses.push(course);
    }

    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  getCourseById: (courseId: string): Course | undefined => {
    const courses = storage.getCourses();
    return courses.find(c => c.id === courseId);
  },

  deleteCourse: (courseId: string): void => {
    const courses = storage.getCourses().filter(c => c.id !== courseId);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  // Progress operations
  getProgress: (): Progress[] => {
    const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return progress ? JSON.parse(progress) : [];
  },

  getUserProgress: (userId: string, courseId: string): Progress | undefined => {
    const allProgress = storage.getProgress();
    return allProgress.find(p => p.userId === userId && p.courseId === courseId);
  },

  saveProgress: (progress: Progress): void => {
    const allProgress = storage.getProgress();
    const existingIndex = allProgress.findIndex(
      p => p.userId === progress.userId && p.courseId === progress.courseId
    );

    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
  },

  // Clear all data
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  },

  // Initialize with sample data
  initializeSampleData: (): void => {
    // Clear existing data first
    storage.clearAll();
    
      const sampleCourses: Course[] = [
        {
          id: '1',
          title: 'Web Development Fundamentals',
          description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites. Perfect for beginners!',
          instructor: 'instructor1',
          instructorName: 'Sarah Johnson',
          thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Web Development',
          level: 'beginner',
          enrolledStudents: [],
          createdAt: new Date().toISOString(),
          lessons: [
            {
              id: 'l1',
              title: 'Introduction to HTML',
              content: 'HTML is the standard markup language for creating web pages. In this lesson, you will learn the basic structure of HTML documents, common tags, and how to create your first webpage.',
              duration: 30,
              order: 1,
            },
            {
              id: 'l2',
              title: 'Styling with CSS',
              content: 'CSS is used to style and layout web pages. Learn about selectors, properties, the box model, and responsive design principles.',
              duration: 45,
              order: 2,
            },
            {
              id: 'l3',
              title: 'JavaScript Basics',
              content: 'JavaScript adds interactivity to websites. Discover variables, functions, events, and DOM manipulation.',
              duration: 60,
              order: 3,
            },
          ],
        },
        {
          id: '2',
          title: 'Advanced React Patterns',
          description: 'Master advanced React concepts including hooks, context, and performance optimization.',
          instructor: 'instructor1',
          instructorName: 'Sarah Johnson',
          thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Frontend',
          level: 'advanced',
          enrolledStudents: [],
          createdAt: new Date().toISOString(),
          lessons: [
            {
              id: 'l4',
              title: 'Custom Hooks',
              content: 'Learn how to create reusable custom hooks to encapsulate complex logic and state management.',
              duration: 40,
              order: 1,
            },
            {
              id: 'l5',
              title: 'Context API Deep Dive',
              content: 'Master the Context API for efficient state management across your React application.',
              duration: 50,
              order: 2,
            },
          ],
        },
        {
          id: '3',
          title: 'Data Science with Python',
          description: 'Introduction to data analysis, visualization, and machine learning using Python. Become a data expert!',
          instructor: 'instructor2',
          instructorName: 'Dr. Michael Chen',
          thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Data Science',
          level: 'intermediate',
          enrolledStudents: [],
          createdAt: new Date().toISOString(),
          lessons: [
            {
              id: 'l6',
              title: 'Python for Data Analysis',
              content: 'Introduction to NumPy and Pandas for data manipulation and analysis.',
              duration: 55,
              order: 1,
            },
            {
              id: 'l7',
              title: 'Data Visualization',
              content: 'Create compelling visualizations using Matplotlib and Seaborn.',
              duration: 45,
              order: 2,
            },
          ],
        },
        {
          id: '4',
          title: 'Mobile App Development with React Native',
          description: 'Build cross-platform mobile apps using React Native. Create amazing mobile experiences!',
          instructor: 'instructor3',
          instructorName: 'Alex Turner',
          thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Mobile Development',
          level: 'intermediate',
          enrolledStudents: [],
          createdAt: new Date().toISOString(),
          lessons: [
            {
              id: 'l8',
              title: 'React Native Basics',
              content: 'Introduction to React Native components and styling.',
              duration: 45,
              order: 1,
            },
            {
              id: 'l9',
              title: 'Navigation and State Management',
              content: 'Learn about React Navigation and state management in React Native.',
              duration: 50,
              order: 2,
            }
          ],
        },
        {
          id: '5',
          title: 'UI/UX Design Fundamentals',
          description: 'Master the principles of user interface and user experience design.',
          instructor: 'instructor4',
          instructorName: 'Emma Davis',
          thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Design',
          level: 'beginner',
          enrolledStudents: [],
          createdAt: new Date().toISOString(),
          lessons: [
            {
              id: 'l10',
              title: 'Design Principles',
              content: 'Learn about color theory, typography, and layout principles.',
              duration: 40,
              order: 1,
            },
            {
              id: 'l11',
              title: 'User Research',
              content: 'Understanding user needs and creating user personas.',
              duration: 45,
              order: 2,
            }
          ],
        }
      ];

      // Add sample instructor users so courses reference valid instructors
      const sampleUsers: User[] = [
        {
          id: 'instructor1',
          email: 'sarah.johnson@example.com',
          name: 'Sarah Johnson',
          role: 'instructor',
          enrolledCourses: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'instructor2',
          email: 'michael.chen@example.com',
          name: 'Dr. Michael Chen',
          role: 'instructor',
          enrolledCourses: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'instructor3',
          email: 'alex.turner@example.com',
          name: 'Alex Turner',
          role: 'instructor',
          enrolledCourses: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'instructor4',
          email: 'emma.davis@example.com',
          name: 'Emma Davis',
          role: 'instructor',
          enrolledCourses: [],
          createdAt: new Date().toISOString(),
        },
      ];

      sampleUsers.forEach(u => storage.saveUser(u));

      sampleCourses.forEach(course => storage.saveCourse(course));
    },

  };