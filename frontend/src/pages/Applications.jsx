import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listApplications, deleteApplication, updateApplication } from '../api/applications'
import { downloadCv } from '../api/cv'
import StatusSelect from '../components/StatusSelect'
import { PlusIcon, PipelineIcon, EditIcon, TrashIcon, DocumentIcon } from '../components/icons'

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

  async function handleStatusChange(app, status) {
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)))
    await updateApplication(app.id, { ...app, status })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Applications</h1>
        <Link
          to="/applications/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
        >
          <PlusIcon className="h-4 w-4" />
          Add Application
        </Link>
      </div>

      <div className="mt-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
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
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-14">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <PipelineIcon className="h-7 w-7" />
          </span>
          <p className="mt-4 text-slate-600">No applications match this filter yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop / tablet: table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft md:block">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2.5">Company</th>
                  <th className="whitespace-nowrap px-4 py-2.5">Role</th>
                  <th className="whitespace-nowrap px-4 py-2.5">Date</th>
                  <th className="whitespace-nowrap px-4 py-2.5">CV used</th>
                  <th className="whitespace-nowrap px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apps.map((app) => (
                  <tr key={app.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link to={`/applications/${app.id}`} className="font-medium text-primary-600 hover:text-primary-700">
                        {app.companyName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div>{app.jobTitle}</div>
                      {app.notes && <div className="mt-0.5 max-w-xs truncate text-xs text-slate-400">{app.notes}</div>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">{app.applicationDate}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <CvCell app={app} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusSelect status={app.status} onChange={(status) => handleStatusChange(app, status)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/applications/${app.id}/edit`}
                          aria-label="Edit application"
                          title="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-primary-700"
                        >
                          <EditIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(app.id)}
                          aria-label="Delete application"
                          title="Delete"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="mt-6 space-y-3 md:hidden">
            {apps.map((app) => (
              <div key={app.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/applications/${app.id}`} className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">{app.companyName}</div>
                    <div className="truncate text-sm text-slate-500">{app.jobTitle}</div>
                  </Link>
                  <StatusSelect status={app.status} onChange={(status) => handleStatusChange(app, status)} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{app.applicationDate}</span>
                  <CvCell app={app} />
                </div>
                {app.notes && <p className="mt-2 truncate text-xs text-slate-400">{app.notes}</p>}
                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                  <Link
                    to={`/applications/${app.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <EditIcon className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CvCell({ app }) {
  if (!app.cvId) return <span className="text-slate-400">—</span>
  return (
    <button
      onClick={() => downloadCv(app.cvId, app.cvFileName)}
      title={`Download ${app.cvFileName}`}
      className="inline-flex max-w-[10rem] items-center gap-1.5 text-primary-600 hover:text-primary-700"
    >
      <DocumentIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{app.cvLabel || app.cvFileName}</span>
    </button>
  )
}
