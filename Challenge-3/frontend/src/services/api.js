import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add authentication token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Token ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const getPosts = async () => {
  const response = await api.get('/posts/')
  return response.data
}

export const getPost = async (slug) => {
  const response = await api.get(`/posts/${slug}/`)
  return response.data
}

export const getCategories = async () => {
  const response = await api.get('/categories/')
  return response.data
}

export const createPost = async (postData) => {
  const response = await api.post('/posts/', postData)
  return response.data
}

export const updatePost = async (slug, postData) => {
  const response = await api.put(`/posts/${slug}/`, postData)
  return response.data
}

export const deletePost = async (slug) => {
  const response = await api.delete(`/posts/${slug}/`)
  return response.data
}

export const publishPost = async (slug) => {
  const response = await api.post(`/posts/${slug}/publish/`)
  return response.data
}

export const addComment = async (slug, comment) => {
  const response = await api.post(`/posts/${slug}/add_comment/`, { text: comment })
  return response.data
}

export const login = async (credentials) => {
  const response = await api.post('/auth/login/', credentials)
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token)
  }
  return response.data
}

export const register = async (userData) => {
  const response = await api.post('/auth/register/', userData)
  return response.data
}

export const logout = () => {
  localStorage.removeItem('authToken')
}

export default api 