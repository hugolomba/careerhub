import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getDashboardStats } from '../api/dashboard'
import { listApplications } from '../api/applications'
import StatusBadge from '../components/StatusBadge'
import {
  PipelineIcon, ChartIcon, CalendarIcon, CheckCircleIcon, ArrowRightIcon,
  PlusIcon, DocumentIcon,
} from '../components/icons'

const STAT_CARDS = [
  { key: 'totalApplications', label: 'Total applications', icon: PipelineIcon, format: (v) => v },
  { key: 'responseRatePercent', label: 'Response rate', icon: ChartIcon, format: (v) => `${v}%` },
  { key: 'interviewConversionRatePercent', label: 'Interview conversion', icon: CalendarIcon, format: (v) => `${v}%` },
  { key: 'offerRatePercent', label: 'Offer rate', icon: CheckCircleIcon, format: (v) => `${v}%` },
]

const QUICK_ACTIONS = [
  { to: '/applications/new', label: 'Add application', description: 'Log a new role you applied to', icon: PlusIcon, primary: true },
  { to: '/interviews', label: 'Interviews', description: 'See upcoming and past rounds', icon: CalendarIcon },
  { to: '/cvs', label: 'My CVs', description: 'Upload or manage resume versions', icon: DocumentIcon },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentApps, setRecentApps] = useState(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
    listApplications().then((apps) => {
      const sorted = [...apps].sort((a, b) => b.id - a.id)
      setRecentApps(sorted.slice(0, 5))
    })
  }, [])

  if (!stats) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((c) => (
          <div key={c.key} className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-soft" />
        ))}
      </div>
    )
  }

  // Alternate flow A1 (UC-06): no applications yet -> empty state
  if (stats.totalApplications === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome, {user?.fullName}</h1>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-14">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <PipelineIcon className="h-7 w-7" />
          </span>
          <p className="mt-4 text-slate-600">You haven't added any applications yet.</p>
          <Link
            to="/applications/new"
            className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4" />
            Add your first application
          </Link>
        </div>
      </div>
    )
  }

  const byStatusData = Object.entries(stats.applicationsByStatus).map(([status, count]) => ({ status, count }))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome, {user?.fullName}</h1>
        <Link to="/applications" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
          View all applications
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((c) => (
          <StatCard key={c.key} label={c.label} value={c.format(stats[c.key])} icon={c.icon} />
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`group flex items-center gap-3 rounded-2xl border p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow ${
              action.primary
                ? 'border-primary-900 bg-primary-900 text-white'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                action.primary ? 'bg-white/10 text-amber-400' : 'bg-primary-50 text-primary-700'
              }`}
            >
              <action.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{action.label}</div>
              <div className={`truncate text-xs ${action.primary ? 'text-primary-100' : 'text-slate-500'}`}>
                {action.description}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Applications by status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#263349" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Recent applications</h2>
            <Link to="/applications" className="text-xs font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          {!recentApps ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : recentApps.length === 0 ? (
            <p className="text-sm text-slate-400">No applications yet.</p>
          ) : (
            <ul className="space-y-1">
              {recentApps.map((app) => (
                <li key={app.id}>
                  <Link
                    to={`/applications/${app.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-900">{app.companyName}</div>
                      <div className="truncate text-xs text-slate-500">{app.jobTitle}</div>
                    </div>
                    <StatusBadge status={app.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow sm:p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-900 text-amber-400">
        <Icon className="h-4 w-4" />
      </span>
      <div className="mt-2.5 truncate text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">{label}</div>
      <div className="mt-0.5 text-xl font-bold text-slate-900 sm:text-2xl">{value}</div>
    </div>
  )
}
