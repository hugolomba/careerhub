import apiClient from './client'

export async function listCvs() {
  const { data } = await apiClient.get('/cv')
  return data
}

export async function uploadCv(file, label, applicationId) {
  const formData = new FormData()
  formData.append('file', file)
  if (label) formData.append('label', label)
  if (applicationId) formData.append('applicationId', applicationId)

  const { data } = await apiClient.post('/cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function downloadCv(id, fileName) {
  const { data } = await apiClient.get(`/cv/${id}/download`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.URL.revokeObjectURL(url)
}

export async function deleteCv(id) {
  await apiClient.delete(`/cv/${id}`)
}
