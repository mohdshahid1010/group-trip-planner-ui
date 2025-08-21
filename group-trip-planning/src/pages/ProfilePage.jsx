import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, Star, Users, Calendar, Edit3, Settings, 
  Camera, Heart, Plus, Eye, Share2 
} from 'lucide-react'
import { currentUser, itineraries } from '../data/mockData'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('trips')
  const [isEditing, setIsEditing] = useState(false)

  const userTrips = itineraries.filter(trip => trip.createdBy.id === currentUser.id)
  const joinedTrips = itineraries.filter(trip => 
    trip.participants.some(p => p.id === currentUser.id) && trip.createdBy.id !== currentUser.id
  )

  const tabs = [
    { id: 'trips', label: 'My Trips', count: userTrips.length },
    { id: 'joined', label: 'Joined Trips', count: joinedTrips.length },
    { id: 'wishlist', label: 'Wishlist', count: 0 },
    { id: 'reviews', label: 'Reviews', count: 2 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg"
              />
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full shadow-lg hover:bg-primary-600">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-900">{currentUser.rating}</span>
                  <span className="text-gray-500">({currentUser.tripCount} trips)</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {currentUser.location}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Travel Style: {currentUser.travelStyle}
                </span>
              </div>

              <p className="text-gray-700 mb-4 max-w-2xl">{currentUser.bio}</p>

              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 btn-secondary"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
              </button>
              <button className="btn-secondary p-2">
                <Settings className="h-4 w-4" />
              </button>
              <button className="btn-secondary p-2">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{userTrips.length}</div>
              <div className="text-sm text-gray-600">Trips Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{joinedTrips.length}</div>
              <div className="text-sm text-gray-600">Trips Joined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{currentUser.rating}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {userTrips.reduce((sum, trip) => sum + trip.participants.length, 0)}
              </div>
              <div className="text-sm text-gray-600">People Connected</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'trips' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Created Trips</h2>
              <Link to="/create" className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create New Trip</span>
              </Link>
            </div>

            {userTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTrips.map((trip) => (
                  <div key={trip.id} className="card">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          Active
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{trip.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {trip.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {trip.destination} • {trip.duration}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          {trip.participants.length}/{trip.groupSize} joined
                        </span>
                        <span className="text-lg font-bold text-primary-600">
                          ${trip.price}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/trip/${trip.id}`}
                          className="flex-1 btn-secondary text-center flex items-center justify-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Link>
                        <button className="flex-1 btn-primary">
                          Edit
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
                  No trips created yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Share your travel dreams with fellow adventurers
                </p>
                <Link to="/create" className="btn-primary">
                  Create Your First Trip
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'joined' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Trips I've Joined</h2>
            {joinedTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedTrips.map((trip) => (
                  <div key={trip.id} className="card">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          Upcoming
                        </span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {new Date(trip.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {trip.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {trip.destination} • {trip.duration}
                      </p>

                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={trip.createdBy.avatar}
                          alt={trip.createdBy.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600">
                          Organized by {trip.createdBy.name}
                        </span>
                      </div>

                      <Link
                        to={`/trip/${trip.id}`}
                        className="w-full btn-primary text-center block"
                      >
                        View Trip Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No trips joined yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Discover amazing adventures created by other travelers
                </p>
                <Link to="/explore" className="btn-primary">
                  Explore Trips
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Save trips you're interested in for later
            </p>
            <Link to="/explore" className="btn-primary">
              Browse Trips
            </Link>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">{currentUser.rating}</div>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(currentUser.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Average rating from {currentUser.tripCount} trips</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Reviewer"
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">Sarah M.</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">2 months ago</span>
                    </div>
                    <p className="text-gray-700">
                      "Olivia was an amazing trip organizer! Her attention to detail and passion 
                      for travel made our Morocco adventure unforgettable. Highly recommend!"
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Reviewer"
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">Marcus L.</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">3 months ago</span>
                    </div>
                    <p className="text-gray-700">
                      "Great travel companion with excellent local knowledge. Made our Patagonia 
                      trek both challenging and enjoyable. Would definitely travel with again!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
