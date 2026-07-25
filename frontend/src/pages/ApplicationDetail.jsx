import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApplication } from '../api/applications'
import { listInterviews, createInterview, deleteInterview } from '../api/interviews'

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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setWarning('')
    if (new Date(form.interviewDate) < new Date()) {
      // Exceptional flow E1 from UC-04: it gives a warning, but still allows the user to create the interview
      setWarning('Warning: The interview date is in the past. Are you sure you want to create it?')
    }
    await createInterview(id, form)
    setForm({ interviewDate: '', type: 'PHONE', stage: '', notes: '' })
    loadInterviews()
  }

  if (!app) return <p>Loading...</p>

  return (
    <div>
      <Link to="/applications">&larr; Back to applications</Link>
      <h1>{app.jobTitle} @ {app.companyName}</h1>
      <p>Status: {app.status} | Date: {app.applicationDate}</p>
      {app.notes && <p>Notes: {app.notes}</p>}

      <h2>Interviews</h2>
      <ul>
        {interviews.map((iv) => (
          <li key={iv.id}>
            {iv.interviewDate} — {iv.type} — {iv.stage}
            {iv.pastDate && ' (past)'}{' '}
            <button onClick={() => deleteInterview(iv.id).then(loadInterviews)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Add interview</h3>
      {warning && <p role="alert">{warning}</p>}
      <form onSubmit={handleSubmit}>
        <label>Date/time
          <input type="datetime-local" name="interviewDate" value={form.interviewDate} onChange={handleChange} required />
        </label>
        <label>Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="PHONE">Phone</option>
            <option value="VIDEO">Video</option>
            <option value="ONSITE">Onsite</option>
          </select>
        </label>
        <label>Stage <input name="stage" value={form.stage} onChange={handleChange} /></label>
        <label>Notes <textarea name="notes" value={form.notes} onChange={handleChange} /></label>
        <button type="submit">Save interview</button>
      </form>
    </div>
  )
}