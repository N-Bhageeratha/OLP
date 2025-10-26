import { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, Edit, Trash2 } from 'lucide-react';
import { Course } from '../../types';
import { storage } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';
import { CourseCard } from './CourseCard';
import { CreateCourse } from './CreateCourse';
import { CourseDetail } from './CourseDetail';

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = () => {
    const allCourses = storage.getCourses();
    const instructorCourses = allCourses.filter(course => course.instructor === user?.id);
    setMyCourses(instructorCourses);
  };

  const handleDeleteCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this course?')) {
      storage.deleteCourse(courseId);
      loadCourses();
    }
  };

  const handleEditCourse = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCourse(course);
    setShowCreateForm(true);
  };

  const handleCourseCreated = () => {
    setShowCreateForm(false);
    setEditingCourse(null);
    loadCourses();
  };

  if (showCreateForm) {
    return (
      <CreateCourse
        onCancel={() => {
          setShowCreateForm(false);
          setEditingCourse(null);
        }}
        onSuccess={handleCourseCreated}
        editingCourse={editingCourse}
      />
    );
  }

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

  const totalEnrollments = myCourses.reduce(
    (acc, course) => acc + course.enrolledStudents.length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Instructor Dashboard</h2>
          <p className="text-gray-600">Manage your courses and track student engagement</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Courses</p>
              <p className="text-3xl font-bold">{myCourses.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Students</p>
              <p className="text-3xl font-bold">{totalEnrollments}</p>
            </div>
            <Users className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">My Courses</h3>

        {myCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
            <p className="text-gray-600 mb-6">Create your first course to start teaching</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map(course => (
              <div key={course.id} className="relative group">
                <CourseCard course={course} onSelect={setSelectedCourse} />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEditCourse(course, e)}
                    className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteCourse(course.id, e)}
                    className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
