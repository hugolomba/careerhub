import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

// Placeholder for Requirement 6 (Analytics Dashboard).
// Once the /api/applications and /api/interviews endpoints exist, fetch
// aggregated stats here (response rate, interview conversion rate, etc.)
// and render them with Recharts.
export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <p>This is where the analytics dashboard (Requirement 6) will go.</p>
      <button onClick={logout}>Log out</button>

      <Link to="/applications">View Applications</Link>
    </div>
  )
}
