import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Course, Lesson } from '../../types';
import { storage } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';

interface CreateCourseProps {
  onCancel: () => void;
  onSuccess: () => void;
  editingCourse?: Course | null;
}

export const CreateCourse = ({ onCancel, onSuccess, editingCourse }: CreateCourseProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(editingCourse?.title || '');
  const [description, setDescription] = useState(editingCourse?.description || '');
  const [category, setCategory] = useState(editingCourse?.category || '');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    editingCourse?.level || 'beginner'
  );
  const [thumbnail, setThumbnail] = useState(editingCourse?.thumbnail || '');
  const [lessons, setLessons] = useState<Lesson[]>(editingCourse?.lessons || []);

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: '',
      content: '',
      duration: 0,
      order: lessons.length + 1,
    };
    setLessons([...lessons, newLesson]);
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setLessons(lessons.map(lesson =>
      lesson.id === id ? { ...lesson, ...updates } : lesson
    ));
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !thumbnail || lessons.length === 0) {
      alert('Please fill in all required fields and add at least one lesson');
      return;
    }

    const course: Course = {
      id: editingCourse?.id || Date.now().toString(),
      title,
      description,
      category,
      level,
      thumbnail,
      instructor: user!.id,
      instructorName: user!.name,
      lessons: lessons.map((lesson, index) => ({ ...lesson, order: index + 1 })),
      enrolledStudents: editingCourse?.enrolledStudents || [],
      createdAt: editingCourse?.createdAt || new Date().toISOString(),
    };

    storage.saveCourse(course);
    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {editingCourse ? 'Edit Course' : 'Create New Course'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Introduction to Web Development"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Describe what students will learn..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Web Development"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL (from Pexels)
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://images.pexels.com/..."
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Lessons</label>
              <button
                type="button"
                onClick={addLesson}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Lesson
              </button>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">Lesson {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeLesson(lesson.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Lesson title"
                      required
                    />
                    <textarea
                      value={lesson.content}
                      onChange={(e) => updateLesson(lesson.id, { content: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Lesson content"
                      required
                    />
                    <input
                      type="number"
                      value={lesson.duration}
                      onChange={(e) => updateLesson(lesson.id, { duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Duration (minutes)"
                      min="0"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {editingCourse ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
