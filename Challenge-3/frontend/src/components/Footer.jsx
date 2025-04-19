const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Blog App</h2>
            <p className="text-gray-400 mt-1">Share your thoughts with the world</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-indigo-400">About</a>
            <a href="#" className="hover:text-indigo-400">Contact</a>
            <a href="#" className="hover:text-indigo-400">Privacy Policy</a>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Blog App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 