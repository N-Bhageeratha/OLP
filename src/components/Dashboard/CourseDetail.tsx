import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, BookOpen, CheckCircle, Circle } from 'lucide-react';
import { Course, Progress } from '../../types';
import { storage } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

export const CourseDetail = ({ course, onBack }: CourseDetailProps) => {
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const enrolled = user.enrolledCourses.includes(course.id);
      setIsEnrolled(enrolled);

      if (enrolled) {
        const userProgress = storage.getUserProgress(user.id, course.id);
        setProgress(userProgress || {
          userId: user.id,
          courseId: course.id,
          completedLessons: [],
          lastAccessed: new Date().toISOString(),
        });
      }
    }
  }, [user, course.id]);

  const handleEnroll = () => {
    if (user) {
      const updatedCourses = [...user.enrolledCourses, course.id];
      storage.updateUser(user.id, { enrolledCourses: updatedCourses });

      const updatedCourse = { ...course, enrolledStudents: [...course.enrolledStudents, user.id] };
      storage.saveCourse(updatedCourse);

      const newProgress: Progress = {
        userId: user.id,
        courseId: course.id,
        completedLessons: [],
        lastAccessed: new Date().toISOString(),
      };
      storage.saveProgress(newProgress);

      setIsEnrolled(true);
      setProgress(newProgress);
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    if (user && progress) {
      const isCompleted = progress.completedLessons.includes(lessonId);
      const updatedCompletedLessons = isCompleted
        ? progress.completedLessons.filter(id => id !== lessonId)
        : [...progress.completedLessons, lessonId];

      const updatedProgress: Progress = {
        ...progress,
        completedLessons: updatedCompletedLessons,
        lastAccessed: new Date().toISOString(),
      };

      storage.saveProgress(updatedProgress);
      setProgress(updatedProgress);
    }
  };

  const selectedLesson = selectedLessonId
    ? course.lessons.find(l => l.id === selectedLessonId)
    : null;

  const progressPercentage = progress
    ? Math.round((progress.completedLessons.length / course.lessons.length) * 100)
    : 0;

  const totalDuration = course.lessons.reduce((acc, lesson) => acc + lesson.duration, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {course.category}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{totalDuration} minutes</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-600">
                  <span className="font-semibold">Instructor:</span> {course.instructorName}
                </p>
              </div>

              {isEnrolled && progress && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                    <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedLesson && (
            <div className="bg-white rounded-xl shadow-sm p-8 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedLesson.title}</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedLesson.content}</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-6"
              >
                Enroll Now
              </button>
            ) : null}

            <h3 className="text-lg font-bold text-gray-900 mb-4">Course Content</h3>
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => {
                const isCompleted = progress?.completedLessons.includes(lesson.id);
                const isSelected = selectedLessonId === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedLessonId(lesson.id)}
                  >
                    <div className="flex items-start gap-3">
                      {isEnrolled && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLessonComplete(lesson.id);
                          }}
                          className="mt-1"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {index + 1}. {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{lesson.duration} min</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
