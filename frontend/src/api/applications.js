import apiClient from './client'

export async function listApplications(status) {
  const { data } = await apiClient.get('/applications', { params: status ? { status } : {} })
  return data
}

export async function createApplication(payload) {
  const { data } = await apiClient.post('/applications', payload)
  return data
}

export async function updateApplication(id, payload) {
  const { data } = await apiClient.put(`/applications/${id}`, payload)
  return data
}

export async function deleteApplication(id) {
  await apiClient.delete(`/applications/${id}`)
}

export async function getApplication(id) {
  const { data } = await apiClient.get(`/applications/${id}`)
  return data
}