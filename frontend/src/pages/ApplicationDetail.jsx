import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApplication, updateApplication } from '../api/applications'
import { listInterviews, createInterview, deleteInterview } from '../api/interviews'
import { downloadCv } from '../api/cv'
import StatusSelect from '../components/StatusSelect'
import { ArrowLeftIcon, DocumentIcon } from '../components/icons'

const TYPE_LABELS = { PHONE: 'Phone', VIDEO: 'Video', ONSITE: 'On-site' }
const INPUT = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30'

export default function ApplicationDetail() {
  const { id } = useParams()
  const [app, setApp] = useState(null)
  const [interviews, setInterviews] = useState([])
  const [form, setForm] = useState({ interviewDate: '', type: 'PHONE', stage: '', notes: '' })
  const [warning, setWarning] = useState('')

  useEffect(() => {
    getApplication(id).then(setApp)
    loadInterviews()
  }, [id])

  async function loadInterviews() {
    setInterviews(await listInterviews(id))
  }

  async function handleStatusChange(status) {
    setApp((prev) => ({ ...prev, status }))
    await updateApplication(id, { ...app, status })
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setWarning('')
    if (new Date(form.interviewDate) < new Date()) {
      // Exceptional flow E1 from UC-04: it gives a warning, but still allows the user to create the interview
      setWarning('Warning: the interview date is in the past. It was still saved below.')
    }
    await createInterview(id, form)
    setForm({ interviewDate: '', type: 'PHONE', stage: '', notes: '' })
    loadInterviews()
    // Scheduling an interview may have auto-advanced the status server-side.
    getApplication(id).then(setApp)
  }

  if (!app) return <p className="text-sm text-slate-500">Loading...</p>

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/applications" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Back to applications
      </Link>

      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{app.jobTitle}</h1>
            <p className="text-slate-500">{app.companyName}</p>
          </div>
          <StatusSelect status={app.status} onChange={handleStatusChange} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-slate-400">Applied on</dt>
            <dd className="text-slate-700">{app.applicationDate}</dd>
          </div>
          {app.jobUrl && (
            <div>
              <dt className="text-slate-400">Listing</dt>
              <dd>
                <a href={app.jobUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-700">
                  Open link
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-slate-400">CV used</dt>
            <dd>
              {app.cvId ? (
                <button
                  onClick={() => downloadCv(app.cvId, app.cvFileName)}
                  className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700"
                >
                  <DocumentIcon className="h-3.5 w-3.5" />
                  {app.cvLabel || app.cvFileName}
                </button>
              ) : (
                <span className="text-slate-400">None linked</span>
              )}
            </dd>
          </div>
        </dl>
        {app.notes && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <dt className="text-sm text-slate-400">Notes</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{app.notes}</dd>
          </div>
        )}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Interviews</h2>
      {interviews.length === 0 ? (
        <p className="text-sm text-slate-400">No interviews logged for this application yet.</p>
      ) : (
        <ul className="space-y-2">
          {interviews.map((iv) => (
            <li
              key={iv.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-soft"
            >
              <div>
                <span className="font-medium text-slate-800">{new Date(iv.interviewDate).toLocaleString()}</span>
                <span className="mx-2 text-slate-300">|</span>
                <span className="text-slate-600">{TYPE_LABELS[iv.type] || iv.type}</span>
                {iv.stage && <span className="text-slate-500"> &middot; {iv.stage}</span>}
                {iv.pastDate && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">past</span>
                )}
              </div>
              <button
                onClick={() => deleteInterview(iv.id).then(loadInterviews)}
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Add interview</h3>
        {warning && (
          <p role="alert" className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {warning}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date/time</label>
            <input
              type="datetime-local" name="interviewDate" value={form.interviewDate} onChange={handleChange} required
              className={INPUT}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
            <select
              name="type" value={form.type} onChange={handleChange}
              className={INPUT}
            >
              <option value="PHONE">Phone</option>
              <option value="VIDEO">Video</option>
              <option value="ONSITE">Onsite</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Stage</label>
            <input
              name="stage" value={form.stage} onChange={handleChange}
              placeholder="e.g. Technical round"
              className={INPUT}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
            <input
              name="notes" value={form.notes} onChange={handleChange}
              className={INPUT}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
        >
          Save interview
        </button>
      </form>
    </div>
  )
}
