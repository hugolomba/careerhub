import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getDashboardStats } from '../api/dashboard'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [])

  if (!stats) return <p className="text-sm text-slate-500">Loading...</p>

  // Alternate flow A1 (UC-06): no applications yet -> empty state
  if (stats.totalApplications === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome, {user?.fullName}</h1>
        <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">You haven't added any applications yet.</p>
          <Link
            to="/applications/new"
            className="mt-4 inline-block rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            + Add your first application
          </Link>
        </div>
      </div>
    )
  }

  const byStatusData = Object.entries(stats.applicationsByStatus).map(([status, count]) => ({ status, count }))

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome, {user?.fullName}</h1>
        <Link to="/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View all applications &rarr;
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total applications" value={stats.totalApplications} />
        <StatCard label="Response rate" value={`${stats.responseRatePercent}%`} />
        <StatCard label="Interview conversion" value={`${stats.interviewConversionRatePercent}%`} />
        <StatCard label="Offer rate" value={`${stats.offerRatePercent}%`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Applications by status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Activity over time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats.activityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  )
}
