import { Clock, Users, BookOpen } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  isEnrolled?: boolean;
  progress?: number;
}

export const CourseCard = ({ course, onSelect, isEnrolled, progress }: CourseCardProps) => {
  const totalDuration = course.lessons.reduce((acc, lesson) => acc + lesson.duration, 0);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      onClick={() => onSelect(course)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{course.category}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons.length} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{totalDuration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrolledStudents.length}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">By {course.instructorName}</p>
        </div>

        {isEnrolled && progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
