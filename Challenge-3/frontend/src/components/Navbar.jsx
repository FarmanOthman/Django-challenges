import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../services/api'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <nav className="bg-indigo-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white text-xl font-bold">Blog App</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/" className="px-3 py-2 text-white hover:text-indigo-200">Home</Link>
              <Link to="/posts" className="px-3 py-2 text-white hover:text-indigo-200">Posts</Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-white hover:text-indigo-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-white hover:text-indigo-200">Login</Link>
                <Link to="/register" className="ml-4 px-3 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-100">
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-indigo-200 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-white hover:text-indigo-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/posts"
              className="block px-3 py-2 text-white hover:text-indigo-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Posts
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-white hover:text-indigo-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-white hover:text-indigo-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-white hover:text-indigo-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 