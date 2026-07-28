import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listAllInterviews } from '../api/interviews'

const TYPE_LABELS = { PHONE: 'Phone', VIDEO: 'Video', ONSITE: 'On-site' }

export default function Interviews() {
  const [interviews, setInterviews] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listAllInterviews()
      .then(setInterviews)
      .catch(() => setError('Failed to load interviews'))
  }, [])

  if (error) return <p className="text-sm text-rose-600" role="alert">{error}</p>
  if (!interviews) return <p className="text-sm text-slate-500">Loading...</p>

  const sorted = [...interviews].sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
  const upcoming = sorted.filter((iv) => !iv.pastDate)
  const past = sorted.filter((iv) => iv.pastDate)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Interviews</h1>
      <p className="mt-1 text-sm text-slate-500">All interviews across every application, in one place.</p>

      {interviews.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">No interviews logged yet.</p>
          <Link to="/applications" className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
            Go to your applications to add one &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <InterviewGroup title="Upcoming" items={upcoming} emptyLabel="No upcoming interviews." />
          <InterviewGroup title="Past" items={past} emptyLabel="No past interviews yet." />
        </div>
      )}
    </div>
  )
}

function InterviewGroup({ title, items, emptyLabel }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyLabel}</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2.5">Company / Role</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((iv) => (
                <tr key={iv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/applications/${iv.applicationId}`} className="font-medium text-primary-600 hover:text-primary-700">
                      {iv.companyName}
                    </Link>
                    <div className="text-slate-500">{iv.jobTitle}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{new Date(iv.interviewDate).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700">{TYPE_LABELS[iv.type] || iv.type}</td>
                  <td className="px-4 py-3 text-slate-700">{iv.stage || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
