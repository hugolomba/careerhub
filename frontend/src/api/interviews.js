import apiClient from './client'

export async function listInterviews(applicationId) {
  const { data } = await apiClient.get(`/applications/${applicationId}/interviews`)
  return data
}

export async function createInterview(applicationId, payload) {
  const { data } = await apiClient.post(`/applications/${applicationId}/interviews`, payload)
  return data
}

export async function deleteInterview(id) {
  await apiClient.delete(`/interviews/${id}`)
}