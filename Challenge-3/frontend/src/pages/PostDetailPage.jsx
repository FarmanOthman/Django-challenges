import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import ReactMarkdown from 'react-markdown'
import { getPost, addComment, deletePost } from '../services/api'
import { useToast } from '../context/ToastContext'

const PostDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [comment, setComment] = useState('')
  const isLoggedIn = !!localStorage.getItem('authToken')
  const userId = parseInt(localStorage.getItem('userId') || '0')
  const username = localStorage.getItem('username') || 'User'
  
  const { data: post, isLoading, error } = useQuery(['post', slug], () => getPost(slug), {
    onError: (error) => {
      showToast(`Error loading post: ${error.message}`, 'error')
    }
  })
  
  const commentMutation = useMutation(
    (commentText) => addComment(slug, commentText),
    {
      // Optimistic update
      onMutate: async (newCommentText) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries(['post', slug])
        
        // Snapshot the previous value
        const previousPost = queryClient.getQueryData(['post', slug])
        
        // Optimistically update the cache with the new comment
        queryClient.setQueryData(['post', slug], old => {
          // Create an optimistic comment
          const optimisticComment = {
            id: 'temp-id-' + Date.now(),
            text: newCommentText,
            author: {
              id: userId,
              username: username
            },
            created_at: new Date().toISOString(),
            approved: false,
            isOptimistic: true  // Flag to identify optimistic comments
          }
          
          return {
            ...old,
            comments: [...(old.comments || []), optimisticComment]
          }
        })
        
        // Return a context with the previous value
        return { previousPost }
      },
      onSuccess: () => {
        showToast('Comment added successfully', 'success')
        setComment('')
        queryClient.invalidateQueries(['post', slug])
      },
      onError: (error, _, context) => {
        showToast(`Error adding comment: ${error.message}`, 'error')
        // Rollback to the previous value if there was an error
        if (context?.previousPost) {
          queryClient.setQueryData(['post', slug], context.previousPost)
        }
      }
    }
  )
  
  const deleteMutation = useMutation(
    () => deletePost(slug),
    {
      onSuccess: () => {
        showToast('Post deleted successfully', 'success')
        navigate('/posts')
      },
      onError: (error) => {
        showToast(`Error deleting post: ${error.message}`, 'error')
      }
    }
  )
  
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      commentMutation.mutate(comment)
    }
  }
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p className="mt-2">Loading post...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        Error loading post: {error.message}
      </div>
    )
  }
  
  if (!post) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p>The post you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }
  
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const isAuthor = isLoggedIn && post.author.id === userId
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {post.category.name}
          </span>
          <span className="text-gray-500">{formattedDate}</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center mb-8">
          <div className="text-gray-700">
            By <span className="font-medium">{post.author.username}</span>
          </div>
        </div>
        
        {isAuthor && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => navigate(`/edit-post/${slug}`)}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this post?')) {
                  deleteMutation.mutate()
                }
              }}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
        
        <div className="prose max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
      
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Comments ({post.comments?.length || 0})</h2>
        
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 mb-2">Add a comment</label>
              <textarea
                id="comment"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this post..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              disabled={commentMutation.isLoading || !comment.trim()}
            >
              {commentMutation.isLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg mb-8">
            <p>Please <a href="/login" className="text-indigo-600 hover:text-indigo-800">log in</a> to leave a comment.</p>
          </div>
        )}
        
        <div className="space-y-6">
          {post.comments?.length ? (
            post.comments.map(comment => (
              <div 
                key={comment.id} 
                className={`${comment.isOptimistic ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'} p-4 rounded-lg transition-all`}
              >
                <div className="flex justify-between mb-2">
                  <div className="font-medium">{comment.author.username}</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(comment.created_at).toLocaleDateString()}
                    {comment.isOptimistic && <span className="ml-2 text-blue-500">(Sending...)</span>}
                  </div>
                </div>
                <p>{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage 