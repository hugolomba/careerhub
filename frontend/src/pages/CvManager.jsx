import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCvs, uploadCv, downloadCv, deleteCv } from '../api/cv'
import { listApplications } from '../api/applications'

export default function CvManager() {
  const [cvs, setCvs] = useState(null)
  const [applications, setApplications] = useState([])
  const [file, setFile] = useState(null)
  const [label, setLabel] = useState('')
  const [applicationId, setApplicationId] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    load()
    listApplications().then(setApplications).catch(() => {})
  }, [])

  async function load() {
    try {
      setCvs(await listCvs())
    } catch {
      setError('Failed to load your CVs')
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setError('')
    setUploading(true)
    try {
      await uploadCv(file, label || undefined, applicationId || undefined)
      setFile(null)
      setLabel('')
      setApplicationId('')
      e.target.reset()
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Only PDF or DOCX files up to 5MB are allowed.')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id) {
    await deleteCv(id)
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">CV Manager</h1>
      <p className="mt-1 text-sm text-slate-500">Upload and manage the different versions of your CV.</p>

      <form onSubmit={handleUpload} className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Upload a new CV</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">File (PDF or DOCX)</label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Label</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Backend-focused CV"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Linked application (optional)</label>
            <select
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">None</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} — {app.jobTitle}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-rose-600" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload CV'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Your CVs</h2>
        {!cvs ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : cvs.length === 0 ? (
          <p className="text-sm text-slate-400">No CVs uploaded yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">File</th>
                  <th className="px-4 py-2.5">Label</th>
                  <th className="px-4 py-2.5">Linked application</th>
                  <th className="px-4 py-2.5">Uploaded</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cvs.map((cv) => (
                  <tr key={cv.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{cv.fileName}</td>
                    <td className="px-4 py-3 text-slate-600">{cv.label || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {cv.applicationId ? (
                        <Link to={`/applications/${cv.applicationId}`} className="text-primary-600 hover:text-primary-700">
                          View application
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(cv.uploadedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => downloadCv(cv.id, cv.fileName)}
                        className="mr-3 font-medium text-primary-600 hover:text-primary-700"
                      >
                        Download
                      </button>
                      <button onClick={() => handleDelete(cv.id)} className="font-medium text-rose-600 hover:text-rose-700">
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
    </div>
  )
}
