import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { InstructorDashboard } from './components/Dashboard/InstructorDashboard';
import { CourseDetail } from './components/Dashboard/CourseDetail';
import { CreateCourse } from './components/Dashboard/CreateCourse';
import { useAuth } from './contexts/AuthContext';
import { storage } from './utils/storage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AuthLayout() {
  const [isLogin, setIsLogin] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div>
        {isLogin ? (
          <Login onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <Register onSwitchToLogin={() => setIsLogin(true)} />
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-gray-500 underline"
            onClick={() => {
              // clear stored data and reload so user can start fresh
              storage.clearAll();
              window.location.reload();
            }}
          >
            Reset demo data
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseDetailWrapper() {
  const navigate = useNavigate();
  const { id } = useParams();
  const course = storage.getCourseById(id || '');

  if (!course) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <CourseDetail
      course={course}
      onBack={() => navigate(-1)}
    />
  );
}

function CreateCourseWrapper() {
  const navigate = useNavigate();
  
  return (
    <CreateCourse
      onCancel={() => navigate('/instructor/dashboard')}
      onSuccess={() => {
        navigate('/instructor/dashboard');
      }}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<AuthLayout />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/dashboard"
              element={
                <PrivateRoute>
                  <InstructorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/course/:id"
              element={
                <PrivateRoute>
                  <CourseDetailWrapper />
                </PrivateRoute>
              }
            />
            <Route
              path="/instructor/create-course"
              element={
                <PrivateRoute>
                  <CreateCourseWrapper />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
