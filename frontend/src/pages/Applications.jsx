import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listApplications, deleteApplication } from '../api/applications'

export default function Applications() {
  const [apps, setApps] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [statusFilter])

  async function load() {
    try {
      setApps(await listApplications(statusFilter || undefined))
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
      <h1>Applications</h1>
      <Link to="/applications/new">+ Add Application</Link>

      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All statuses</option>
        <option value="APPLIED">Applied</option>
        <option value="INTERVIEWING">Interviewing</option>
        <option value="OFFER">Offer</option>
        <option value="REJECTED">Rejected</option>
        <option value="WITHDRAWN">Withdrawn</option>
      </select>

      {error && <p role="alert">{error}</p>}

      <table>
        <thead>
          <tr><th>Company</th><th>Role</th><th>Date</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id}>
              <td><Link to={`/applications/${app.id}`}>{app.companyName}</Link></td>
              <td>{app.jobTitle}</td>
              <td>{app.applicationDate}</td>
              <td>{app.status}</td>
              <td>
                <Link to={`/applications/${app.id}/edit`}>Edit</Link>{' '}
                <button onClick={() => handleDelete(app.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}