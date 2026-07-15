import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:9090/api',
})

/* ------------------------------
   OLD APIs (keep these for backup)
--------------------------------*/

export const analyzeProjectApi = async (payload) => {
  const response = await API.post('/analyze', payload)
  return response.data
}

export const analyzeZipApi = async (file) => {

  const formData = new FormData()

  formData.append('file', file)

  const response = await API.post(
    '/analyzeZip',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}


// Start analysis from GitHub URL
export const startAnalysis = async (payload) => {

  const response = await API.post(
    '/analyze',
    payload
  )

  return response.data
}


// Start analysis from ZIP
export const startZipAnalysis = async (file) => {

  const formData = new FormData()

  formData.append('file', file)

  const response = await API.post(
    '/analyzeZip',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}


// Poll backend for job status
export const getJobStatus = async (jobId) => {

  const response = await API.get(
    `/status/${jobId}`
  )

  return response.data
}