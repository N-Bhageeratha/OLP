import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Award } from 'lucide-react';
import { Course } from '../../types';
import { storage } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';
import { CourseCard } from './CourseCard';
import { CourseDetail } from './CourseDetail';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    const courses = storage.getCourses();
    setAllCourses(courses);
  };

  const enrolledCourses = allCourses.filter(course =>
    user?.enrolledCourses.includes(course.id)
  );

  const availableCourses = allCourses.filter(
    course => !user?.enrolledCourses.includes(course.id)
  );

  const getProgress = (courseId: string): number => {
    if (!user) return 0;
    const progress = storage.getUserProgress(user.id, courseId);
    const course = storage.getCourseById(courseId);

    if (!progress || !course) return 0;

    return Math.round((progress.completedLessons.length / course.lessons.length) * 100);
  };

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => {
          setSelectedCourse(null);
          loadCourses();
        }}
      />
    );
  }

  const displayedCourses = activeTab === 'enrolled' ? enrolledCourses : availableCourses;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Learning Dashboard</h2>
        <p className="text-gray-600">Track your progress and explore new courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Enrolled Courses</p>
              <p className="text-3xl font-bold">{enrolledCourses.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold">
                {enrolledCourses.filter(c => getProgress(c.id) === 100).length}
              </p>
            </div>
            <Award className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">In Progress</p>
              <p className="text-3xl font-bold">
                {enrolledCourses.filter(c => {
                  const prog = getProgress(c.id);
                  return prog > 0 && prog < 100;
                }).length}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === 'enrolled'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Courses ({enrolledCourses.length})
          </button>
        </div>

        {displayedCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'enrolled' ? 'No Enrolled Courses' : 'No Courses Available'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'enrolled'
                ? 'Start learning by enrolling in a course'
                : 'Check back later for new courses'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={setSelectedCourse}
                isEnrolled={activeTab === 'enrolled'}
                progress={activeTab === 'enrolled' ? getProgress(course.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
