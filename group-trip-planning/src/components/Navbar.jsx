import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, Plus, MessageCircle, User, Sparkles } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/ai-search', icon: Sparkles, label: 'AI Search' },
    { path: '/create', icon: Plus, label: 'Create' },
    { path: '/inbox', icon: MessageCircle, label: 'Inbox' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TravelMate</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Profile */}
          <div className="flex items-center">
            <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex justify-around py-2 border-t">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-md text-xs font-medium ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
