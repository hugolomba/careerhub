import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createApplication, updateApplication, listApplications } from '../api/applications'
import { listCvs, uploadCv } from '../api/cv'
import { ArrowLeftIcon, UploadIcon } from '../components/icons'

const INPUT = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30'

export default function ApplicationForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    companyName: '', jobTitle: '', applicationDate: '', status: 'APPLIED', jobUrl: '', notes: '', cvId: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const [cvs, setCvs] = useState([])
  const [cvMode, setCvMode] = useState('existing') // 'existing' | 'upload' | 'none'
  const [newCvFile, setNewCvFile] = useState(null)
  const [newCvLabel, setNewCvLabel] = useState('')
  const [cvError, setCvError] = useState('')

  useEffect(() => {
    listCvs().then(setCvs).catch(() => {})
    if (isEdit) {
      listApplications().then((apps) => {
        const found = apps.find((a) => String(a.id) === id)
        if (found) {
          setForm({ ...found, cvId: found.cvId || '' })
          setCvMode(found.cvId ? 'existing' : 'none')
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setCvError('')
    setSubmitting(true)
    try {
      let cvId = cvMode === 'existing' ? (form.cvId || null) : null

      if (cvMode === 'upload' && newCvFile) {
        try {
          const uploaded = await uploadCv(newCvFile, newCvLabel || undefined)
          cvId = uploaded.id
        } catch (err) {
          setCvError(err.response?.data?.error || 'CV upload failed. Only PDF or DOCX files up to 5MB are allowed.')
          setSubmitting(false)
          return
        }
      }

      const payload = { ...form, cvId }
      if (isEdit) {
        await updateApplication(id, payload)
      } else {
        await createApplication(payload)
      }
      navigate('/applications')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCv = cvs.find((c) => String(c.id) === String(form.cvId))
  const otherUsages = selectedCv?.usedInApplications?.filter((u) => String(u.applicationId) !== id) || []

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/applications" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Back to applications
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{isEdit ? 'Edit' : 'Add'} Application</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company</label>
            <input
              name="companyName" value={form.companyName} onChange={handleChange} required
              className={INPUT}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Job title</label>
            <input
              name="jobTitle" value={form.jobTitle} onChange={handleChange} required
              className={INPUT}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date" name="applicationDate" value={form.applicationDate} onChange={handleChange} required
              className={INPUT}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              name="status" value={form.status} onChange={handleChange}
              className={INPUT}
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
            className={INPUT}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
          <textarea
            name="notes" value={form.notes || ''} onChange={handleChange} rows={4}
            className={INPUT}
          />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">CV used for this application</label>
          <div className="mb-3 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-sm">
            <button
              type="button"
              onClick={() => setCvMode('existing')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${cvMode === 'existing' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'}`}
            >
              Choose existing
            </button>
            <button
              type="button"
              onClick={() => setCvMode('upload')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${cvMode === 'upload' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'}`}
            >
              Upload new
            </button>
            <button
              type="button"
              onClick={() => setCvMode('none')}
              className={`rounded-md px-3 py-1.5 font-medium transition ${cvMode === 'none' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'}`}
            >
              None
            </button>
          </div>

          {cvMode === 'existing' && (
            <div>
              {cvs.length === 0 ? (
                <p className="text-sm text-slate-400">
                  You don't have any CVs uploaded yet. Switch to "Upload new" to add one.
                </p>
              ) : (
                <select
                  name="cvId" value={form.cvId || ''} onChange={handleChange}
                  className={INPUT}
                >
                  <option value="">Select a CV...</option>
                  {cvs.map((cv) => (
                    <option key={cv.id} value={cv.id}>
                      {cv.label || cv.fileName}
                    </option>
                  ))}
                </select>
              )}
              {otherUsages.length > 0 && (
                <p className="mt-1.5 text-xs text-slate-400">
                  Also used in: {otherUsages.map((u) => `${u.companyName} — ${u.jobTitle}`).join(', ')}
                </p>
              )}
            </div>
          )}

          {cvMode === 'upload' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => setNewCvFile(e.target.files[0])}
                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              <div>
                <input
                  value={newCvLabel}
                  onChange={(e) => setNewCvLabel(e.target.value)}
                  placeholder="Label (e.g. Backend-focused CV)"
                  className={INPUT}
                />
              </div>
            </div>
          )}

          {cvError && <p className="mt-2 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{cvError}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700 disabled:opacity-50"
          >
            {cvMode === 'upload' && newCvFile && <UploadIcon className="h-4 w-4" />}
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
