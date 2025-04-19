import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { createPost, getCategories } from '../services/api'
import ReactMarkdown from 'react-markdown'
import { useToast } from '../context/ToastContext'

const CreatePostPage = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    excerpt: '',
    slug: '',
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [error, setError] = useState('')
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery('categories', getCategories, {
    onError: (error) => {
      showToast(`Error loading categories: ${error.message}`, 'error')
    }
  })
  
  // Create post mutation
  const createPostMutation = useMutation(createPost, {
    onSuccess: (data) => {
      showToast('Post created successfully!', 'success')
      navigate(`/posts/${data.slug}`)
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.detail || 'Failed to create post. Please try again.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    }
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-generate slug from title if slug field hasn't been manually edited
    if (name === 'title' && !formData.userEditedSlug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }
  
  const handleSlugChange = (e) => {
    setFormData(prev => ({
      ...prev,
      slug: e.target.value,
      userEditedSlug: true
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category_id) {
      setError('Title, content, and category are required')
      showToast('Please fill in all required fields', 'error')
      return
    }
    
    createPostMutation.mutate({
      ...formData,
      author_id: localStorage.getItem('userId')
    })
  }
  
  // Check if user is logged in
  if (!localStorage.getItem('authToken')) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">You must be logged in to create a post</h2>
        <p>Please <a href="/login" className="text-indigo-600 hover:text-indigo-800">log in</a> to continue.</p>
      </div>
    )
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-4 flex">
        <button
          className={`px-4 py-2 ${!previewMode ? 'bg-indigo-600 text-white' : 'bg-gray-200'} rounded-l-lg`}
          onClick={() => setPreviewMode(false)}
        >
          Write
        </button>
        <button
          className={`px-4 py-2 ${previewMode ? 'bg-indigo-600 text-white' : 'bg-gray-200'} rounded-r-lg`}
          onClick={() => setPreviewMode(true)}
        >
          Preview
        </button>
      </div>
      
      {/* Categories loading state */}
      {categoriesLoading && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
          Loading categories...
        </div>
      )}
      
      {/* Categories error state */}
      {categoriesError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          Error loading categories: {categoriesError.message}
        </div>
      )}
      
      {!previewMode ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-gray-700 mb-2">Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="post-url-slug"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL-friendly version of the title. Leave empty to auto-generate.
            </p>
          </div>
          
          <div>
            <label htmlFor="category_id" className="block text-gray-700 mb-2">Category *</label>
            <select
              id="category_id"
              name="category_id"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.category_id}
              onChange={handleChange}
              required
              disabled={categoriesLoading}
            >
              <option value="">Select a category</option>
              {categories?.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="excerpt" className="block text-gray-700 mb-2">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Short description of your post (optional)"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-gray-700 mb-2">Content *</label>
            <textarea
              id="content"
              name="content"
              rows="12"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here using Markdown"
              required
            ></textarea>
            <p className="mt-1 text-sm text-gray-500">
              Supports Markdown formatting
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={createPostMutation.isLoading}
            >
              {createPostMutation.isLoading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300"
              onClick={() => navigate('/posts')}
              disabled={createPostMutation.isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="border border-gray-300 rounded-lg p-6">
          {formData.title ? (
            <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
          ) : (
            <div className="text-gray-400 text-3xl font-bold mb-4">Post Title</div>
          )}
          
          <div className="prose max-w-none">
            {formData.content ? (
              <ReactMarkdown>{formData.content}</ReactMarkdown>
            ) : (
              <p className="text-gray-400">Your content preview will appear here...</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatePostPage 