import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {post.category.name}
          </span>
          <span className="text-gray-500 text-sm ml-2">{formattedDate}</span>
        </div>
        <Link to={`/posts/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600">{post.title}</h2>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt || post.content.substring(0, 150)}...</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-sm">
              <span className="text-gray-700">By {post.author.username}</span>
            </div>
          </div>
          <Link 
            to={`/posts/${post.slug}`} 
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PostCard 