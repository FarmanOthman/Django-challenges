import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { getPosts } from '../services/api'

const HomePage = () => {
  const { data: posts, isLoading, error } = useQuery('featuredPosts', () => 
    getPosts().then(data => data.filter(post => post.is_published).slice(0, 3))
  )

  return (
    <div>
      <div className="bg-indigo-700 rounded-lg p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Blog</h1>
        <p className="text-xl mb-6">Discover stories, thinking, and expertise from writers on any topic.</p>
        <Link to="/posts" className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100">
          Explore all posts
        </Link>
      </div>
      
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Posts</h2>
          <Link to="/posts" className="text-indigo-600 hover:text-indigo-800">View all</Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            Error loading posts: {error.message}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {posts?.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">No posts found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage 