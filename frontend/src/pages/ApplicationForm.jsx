import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createApplication, updateApplication, listApplications } from '../api/applications'

export default function ApplicationForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    companyName: '', jobTitle: '', applicationDate: '', status: 'APPLIED', jobUrl: '', notes: ''
  })

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
    if (isEdit) {
      await updateApplication(id, form)
    } else {
      await createApplication(form)
    }
    navigate('/applications')
  }

  return (
    <div>
      <h1>{isEdit ? 'Edit' : 'Add'} Application</h1>
      <form onSubmit={handleSubmit}>
        <label>Company <input name="companyName" value={form.companyName} onChange={handleChange} required /></label>
        <label>Job title <input name="jobTitle" value={form.jobTitle} onChange={handleChange} required /></label>
        <label>Date <input type="date" name="applicationDate" value={form.applicationDate} onChange={handleChange} required /></label>
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </label>
        <label>Job URL <input name="jobUrl" value={form.jobUrl || ''} onChange={handleChange} /></label>
        <label>Notes <textarea name="notes" value={form.notes || ''} onChange={handleChange} /></label>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}