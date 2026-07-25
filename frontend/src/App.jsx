import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

import Applications from './pages/Applications'
import ApplicationForm from './pages/ApplicationForm'
import ApplicationDetail from './pages/ApplicationDetail'


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/applications/new" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
          <Route path="/applications/:id/edit" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
          <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
