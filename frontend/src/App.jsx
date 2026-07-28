import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

import Applications from './pages/Applications'
import ApplicationForm from './pages/ApplicationForm'
import ApplicationDetail from './pages/ApplicationDetail'
import Interviews from './pages/Interviews'
import CvManager from './pages/CvManager'

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/applications" element={<Protected><Applications /></Protected>} />
          <Route path="/applications/new" element={<Protected><ApplicationForm /></Protected>} />
          <Route path="/applications/:id/edit" element={<Protected><ApplicationForm /></Protected>} />
          <Route path="/applications/:id" element={<Protected><ApplicationDetail /></Protected>} />
          <Route path="/interviews" element={<Protected><Interviews /></Protected>} />
          <Route path="/cvs" element={<Protected><CvManager /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
