import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { getPosts, getCategories } from '../services/api'

const PostListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState([])
  
  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery('allPosts', getPosts)
  const { data: categories } = useQuery('categories', getCategories)
  
  useEffect(() => {
    if (posts) {
      let filtered = posts.filter(post => post.is_published)
      
      if (selectedCategory) {
        filtered = filtered.filter(post => post.category.slug === selectedCategory)
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(term) || 
          post.content.toLowerCase().includes(term) ||
          post.excerpt?.toLowerCase().includes(term)
        )
      }
      
      setFilteredPosts(filtered)
    }
  }, [posts, selectedCategory, searchTerm])
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Posts</h1>
        {localStorage.getItem('authToken') && (
          <Link 
            to="/create-post" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Write a Post
          </Link>
        )}
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <input 
            type="text"
            placeholder="Search posts..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories?.map(category => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {postsLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2">Loading posts...</p>
        </div>
      ) : postsError ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Error loading posts: {postsError.message}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No posts found.</p>
              {selectedCategory || searchTerm ? (
                <button 
                  className="mt-4 text-indigo-600 hover:text-indigo-800"
                  onClick={() => {
                    setSelectedCategory('')
                    setSearchTerm('')
                  }}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PostListPage 