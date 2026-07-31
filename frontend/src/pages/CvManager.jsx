import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCvs, uploadCv, downloadCv, deleteCv } from '../api/cv'
import { DocumentIcon, UploadIcon, TrashIcon } from '../components/icons'

export default function CvManager() {
  const [cvs, setCvs] = useState(null)
  const [file, setFile] = useState(null)
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    load()
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
      await uploadCv(file, label || undefined)
      setFile(null)
      setLabel('')
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
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">My CVs</h1>
      <p className="mt-1 text-sm text-slate-500">Upload and manage the different versions of your CV. Each one can be reused across as many applications as you like.</p>

      <form onSubmit={handleUpload} className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <UploadIcon className="h-4 w-4 text-primary-600" />
          Upload a new CV
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
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
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
        </div>
        {error && <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload CV'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Your CVs</h2>
        {!cvs ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : cvs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-14">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <DocumentIcon className="h-7 w-7" />
            </span>
            <p className="mt-4 text-slate-600">No CVs uploaded yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop / tablet: table */}
            <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft md:block">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2.5">File</th>
                    <th className="whitespace-nowrap px-4 py-2.5">Label</th>
                    <th className="whitespace-nowrap px-4 py-2.5">Used in</th>
                    <th className="whitespace-nowrap px-4 py-2.5">Uploaded</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cvs.map((cv) => (
                    <tr key={cv.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{cv.fileName}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{cv.label || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <UsageList usages={cv.usedInApplications} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">{new Date(cv.uploadedAt).toLocaleDateString()}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => downloadCv(cv.id, cv.fileName)}
                            aria-label="Download CV"
                            title="Download"
                            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-primary-700"
                          >
                            <DocumentIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cv.id)}
                            aria-label="Delete CV"
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
            <div className="space-y-3 md:hidden">
              {cvs.map((cv) => (
                <div key={cv.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900">{cv.fileName}</div>
                      <div className="text-sm text-slate-500">{cv.label || 'No label'}</div>
                    </div>
                    <span className="whitespace-nowrap text-xs text-slate-400">{new Date(cv.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    <UsageList usages={cv.usedInApplications} />
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => downloadCv(cv.id, cv.fileName)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <DocumentIcon className="h-3.5 w-3.5" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(cv.id)}
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
    </div>
  )
}

function UsageList({ usages }) {
  if (!usages || usages.length === 0) {
    return <span className="text-slate-400">Not used yet</span>
  }
  if (usages.length === 1) {
    const u = usages[0]
    return (
      <Link to={`/applications/${u.applicationId}`} className="text-primary-600 hover:text-primary-700">
        {u.companyName} — {u.jobTitle}
      </Link>
    )
  }
  return (
    <div className="flex flex-wrap gap-1">
      {usages.map((u) => (
        <Link
          key={u.applicationId}
          to={`/applications/${u.applicationId}`}
          title={`${u.companyName} — ${u.jobTitle}`}
          className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 hover:bg-primary-100"
        >
          {u.companyName}
        </Link>
      ))}
    </div>
  )
}
