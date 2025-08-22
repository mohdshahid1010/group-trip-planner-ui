import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, Star, Users, Calendar, Eye, Share2, Sparkles, 
  Trash2, Plus, ArrowLeft 
} from 'lucide-react'
import { currentUser } from '../data/mockData'
import { getPublishedItineraries, deletePublishedItinerary } from '../utils/itineraryStorage'

const MyTripsPage = () => {
  const [publishedItineraries, setPublishedItineraries] = useState([])
  const [loading, setLoading] = useState(true)

  // Load published itineraries on component mount
  useEffect(() => {
    const loadPublishedItineraries = () => {
      const published = getPublishedItineraries()
      setPublishedItineraries(published)
      setLoading(false)
    }
    
    loadPublishedItineraries()
  }, [])

  // Handle deleting a published itinerary
  const handleDeleteItinerary = (itineraryId) => {
    if (window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      const success = deletePublishedItinerary(itineraryId)
      if (success) {
        // Refresh the list
        const updated = getPublishedItineraries()
        setPublishedItineraries(updated)
        alert('Itinerary deleted successfully.')
      } else {
        alert('Error deleting itinerary. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/profile" 
                className="btn-secondary p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
                <p className="text-gray-600 mt-1">
                  {publishedItineraries.length} published trip{publishedItineraries.length !== 1 ? 's' : ''}
                  {publishedItineraries.filter(trip => trip.isAIGenerated).length > 0 && 
                    ` • ${publishedItineraries.filter(trip => trip.isAIGenerated).length} AI-generated`
                  }
                  {publishedItineraries.filter(trip => trip.isJourneyPlanning).length > 0 && 
                    ` • ${publishedItineraries.filter(trip => trip.isJourneyPlanning).length} journey plan${publishedItineraries.filter(trip => trip.isJourneyPlanning).length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/ai-search" className="btn-secondary flex items-center space-x-2 border-purple-200 text-purple-600 hover:bg-purple-50">
                <Sparkles className="h-4 w-4" />
                <span>AI Generator</span>
              </Link>
              <Link to="/create" className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Trip</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {publishedItineraries.length}
              </div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {publishedItineraries.filter(trip => trip.isAIGenerated).length}
              </div>
              <div className="text-sm text-gray-600">AI Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {publishedItineraries.filter(trip => trip.isJourneyPlanning).length}
              </div>
              <div className="text-sm text-gray-600">Journey Plans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {publishedItineraries.reduce((sum, trip) => sum + (trip.participants?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                ₹{publishedItineraries.reduce((sum, trip) => sum + (trip.price || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {publishedItineraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedItineraries.map((trip) => (
              <div key={trip.id} className="card hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {trip.isAIGenerated ? (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded flex items-center space-x-1">
                        <Sparkles className="h-3 w-3" />
                        <span>AI Generated</span>
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        Sample
                      </span>
                    )}
                    {trip.isJourneyPlanning && (
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>Journey Plan</span>
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Published
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {trip.isJourneyPlanning && trip.source ? 
                          `${trip.source} → ${trip.destination}` : 
                          trip.destination
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{trip.rating || 'New'}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {trip.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3">
                    {trip.duration} • {trip.groupSize} people
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {trip.participants?.length || 0} participants
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      ₹{trip.price?.toLocaleString() || '0'}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created {new Date(trip.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/mytrip/${trip.id}`}
                      className="flex-1 btn-secondary text-center flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                    <button 
                      onClick={() => handleDeleteItinerary(trip.id)}
                      className="flex-1 btn-secondary bg-red-50 border-red-200 text-red-600 hover:bg-red-100 flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No trips published yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create and publish your first trip to share with fellow travelers, or use our AI generator for instant itineraries
            </p>
            <div className="flex justify-center space-x-3">
              <Link to="/ai-search" className="btn-secondary flex items-center space-x-2 border-purple-200 text-purple-600 hover:bg-purple-50">
                <Sparkles className="h-4 w-4" />
                <span>Generate with AI</span>
              </Link>
              <Link to="/create" className="btn-primary">
                Create Manually
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTripsPage
