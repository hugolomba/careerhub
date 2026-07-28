import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listApplications, deleteApplication } from '../api/applications'
import StatusBadge from '../components/StatusBadge'

export default function Applications() {
  const [apps, setApps] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [statusFilter])

  async function load() {
    try {
      setApps(await listApplications(statusFilter || undefined))
      setLoaded(true)
    } catch (err) {
      setError('Failed to load applications')
    }
  }

  async function handleDelete(id) {
    await deleteApplication(id)
    load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
        <Link
          to="/applications/new"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + Add Application
        </Link>
      </div>

      <div className="mt-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      {loaded && apps.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">No applications match this filter yet.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2.5">Company</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/applications/${app.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                      {app.companyName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{app.jobTitle}</td>
                  <td className="px-4 py-3 text-slate-500">{app.applicationDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/applications/${app.id}/edit`} className="mr-3 font-medium text-primary-600 hover:text-primary-700">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(app.id)} className="font-medium text-rose-600 hover:text-rose-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
