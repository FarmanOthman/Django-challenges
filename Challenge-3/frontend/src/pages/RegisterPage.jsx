import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from 'react-query'
import { register } from '../services/api'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  })
  const [error, setError] = useState('')
  
  const registerMutation = useMutation(register, {
    onSuccess: () => {
      navigate('/login')
    },
    onError: (error) => {
      const errorData = error.response?.data
      if (errorData) {
        // Format Django REST Framework validation errors
        const errorMessages = []
        Object.keys(errorData).forEach(key => {
          const messages = errorData[key]
          if (Array.isArray(messages)) {
            errorMessages.push(`${key}: ${messages.join(', ')}`)
          } else {
            errorMessages.push(`${key}: ${messages}`)
          }
        })
        setError(errorMessages.join('\n'))
      } else {
        setError('Registration failed. Please try again.')
      }
    }
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.password2) {
      setError('Passwords do not match')
      return
    }
    
    const { password2, ...registrationData } = formData
    registerMutation.mutate(registrationData)
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 whitespace-pre-line">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        
        <div>
          <label htmlFor="password2" className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.password2}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={registerMutation.isLoading}
        >
          {registerMutation.isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage 