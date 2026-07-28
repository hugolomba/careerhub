import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createApplication, updateApplication, listApplications } from '../api/applications'

export default function ApplicationForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    companyName: '', jobTitle: '', applicationDate: '', status: 'APPLIED', jobUrl: '', notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEdit) {
      listApplications().then((apps) => {
        const found = apps.find((a) => String(a.id) === id)
        if (found) setForm(found)
      })
    }
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateApplication(id, form)
      } else {
        await createApplication(form)
      }
      navigate('/applications')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700">
        &larr; Back to applications
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">{isEdit ? 'Edit' : 'Add'} Application</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company</label>
            <input
              name="companyName" value={form.companyName} onChange={handleChange} required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Job title</label>
            <input
              name="jobTitle" value={form.jobTitle} onChange={handleChange} required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date" name="applicationDate" value={form.applicationDate} onChange={handleChange} required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              name="status" value={form.status} onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Job URL</label>
          <input
            name="jobUrl" value={form.jobUrl || ''} onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
          <textarea
            name="notes" value={form.notes || ''} onChange={handleChange} rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
