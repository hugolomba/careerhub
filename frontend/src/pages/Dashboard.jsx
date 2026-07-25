import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getDashboardStats } from '../api/dashboard'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [])

  if (!stats) return <p>Loading...</p>

  // Alternate flow A1 (UC-06): no applications yet -> empty state
  if (stats.totalApplications === 0) {
    return (
      <div>
        <h1>Welcome, {user?.fullName}</h1>
        <p>You haven't added any applications yet.</p>
        <Link to="/applications/new">+ Add your first application</Link>
        <button onClick={logout}>Log out</button>
      </div>
    )
  }

  const byStatusData = Object.entries(stats.applicationsByStatus).map(([status, count]) => ({ status, count }))

  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <Link to="/applications">View all applications</Link>{' '}
      <button onClick={logout}>Log out</button>

      <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0' }}>
        <StatCard label="Total applications" value={stats.totalApplications} />
        <StatCard label="Response rate" value={`${stats.responseRatePercent}%`} />
        <StatCard label="Interview conversion" value={`${stats.interviewConversionRatePercent}%`} />
        <StatCard label="Offer rate" value={`${stats.offerRatePercent}%`} />
      </div>

      <h2>Applications by status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={byStatusData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Activity over time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats.activityTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4f46e5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
      <div style={{ fontSize: '0.85rem', color: '#666' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
    </div>
  )
}