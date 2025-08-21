import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, Calendar, Users, Star, Share2, Heart, 
  CheckCircle, XCircle, Clock, DollarSign, Utensils, 
  Bed, Navigation, Camera, ArrowLeft
} from 'lucide-react'
import { itineraries, reviews } from '../data/mockData'

const TripDetailsPage = () => {
  const { id } = useParams()
  const trip = itineraries.find(t => t.id === parseInt(id))
  const [activeTab, setActiveTab] = useState('itinerary')
  const [showJoinModal, setShowJoinModal] = useState(false)

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h2>
          <Link to="/explore" className="btn-primary">
            Back to Explore
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: Navigation },
    { id: 'details', label: 'Details', icon: Clock },
    { id: 'participants', label: 'Travelers', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ]

  const handleJoinTrip = () => {
    // Navigate to booking page
    window.location.href = `/booking/${trip.id}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Back Button */}
        <Link
          to="/explore"
          className="absolute top-6 left-6 bg-white bg-opacity-90 text-gray-900 p-2 rounded-full hover:bg-opacity-100 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Hero Content */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-start justify-between">
            <div className="text-white">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-primary-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {trip.compatibilityScore}% match
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{trip.rating}</span>
                  <span className="text-gray-300">({trip.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  {trip.destination}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  {trip.duration}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-all">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-all">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-t-xl border-b">
              <nav className="flex space-x-8 px-6 py-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-xl p-6">
              {activeTab === 'itinerary' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Day-by-Day Itinerary
                  </h3>
                  {trip.itinerary.length > 0 ? (
                    trip.itinerary.map((day) => (
                      <div key={day.day} className="border-l-4 border-primary-500 pl-6 pb-6">
                        <div className="bg-primary-50 rounded-lg p-4 mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            Day {day.day}: {day.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">{day.accommodation}</p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Activities</h5>
                            <ul className="space-y-1">
                              {day.activities.map((activity, index) => (
                                <li key={index} className="flex items-start space-x-2 text-gray-600">
                                  <Camera className="h-4 w-4 mt-1 text-primary-500" />
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Utensils className="h-4 w-4 mr-1" />
                              {day.meals.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Detailed itinerary coming soon!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Highlights</h3>
                    <ul className="space-y-2">
                      {trip.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                      <ul className="space-y-2">
                        {trip.inclusions.map((inclusion, index) => (
                          <li key={index} className="flex items-start space-x-2 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>{inclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">What's Not Included</h4>
                      <ul className="space-y-2">
                        {trip.exclusions.map((exclusion, index) => (
                          <li key={index} className="flex items-start space-x-2 text-gray-700">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <span>{exclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Cancellation Policy</h4>
                    <p className="text-yellow-700 text-sm">
                      Free cancellation up to 30 days before departure. 50% refund for cancellations 
                      between 30-7 days. No refund for cancellations within 7 days of departure.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'participants' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      Current Travelers ({trip.participants.length}/{trip.groupSize})
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{trip.availableSlots} spots remaining</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trip.participants.map((participant) => (
                      <div key={participant.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="h-12 w-12 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{participant.name}</h4>
                            <p className="text-sm text-gray-600">{participant.location}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{participant.bio}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {participant.interests.slice(0, 3).map((interest) => (
                              <span
                                key={interest}
                                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            {participant.rating}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trip Creator */}
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={trip.createdBy.avatar}
                        alt={trip.createdBy.name}
                        className="h-12 w-12 rounded-full ring-2 ring-primary-500"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center">
                          {trip.createdBy.name}
                          <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                            Trip Organizer
                          </span>
                        </h4>
                        <p className="text-sm text-gray-600">{trip.createdBy.location}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{trip.createdBy.bio}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {trip.createdBy.interests.slice(0, 3).map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {trip.createdBy.tripCount} trips organized
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Reviews ({trip.reviewCount})
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{trip.rating}</div>
                        <div className="flex items-center justify-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(trip.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No reviews yet. Be the first to join and review this trip!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <img
                              src="https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt="Reviewer"
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">Traveler</span>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  ${trip.price}
                </div>
                <p className="text-gray-600">per person</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{trip.duration}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Group Size</span>
                  <span className="font-medium">{trip.groupSize} people</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Available Spots</span>
                  <span className="font-medium text-green-600">{trip.availableSlots} left</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Departure</span>
                  <span className="font-medium">{new Date(trip.startDate).toLocaleDateString()}</span>
                </div>
              </div>

              {trip.availableSlots > 0 ? (
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full btn-primary text-lg py-3 mb-4"
                >
                  Join This Trip
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed mb-4"
                >
                  Fully Booked
                </button>
              )}

              <p className="text-xs text-gray-500 text-center">
                Secure your spot with a ${Math.round(trip.price * 0.2)} deposit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Join {trip.title}</h3>
            <p className="text-gray-600 mb-6">
              You're about to join an amazing adventure! By clicking continue, you'll be taken 
              to the booking page where you can secure your spot with a deposit.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowJoinModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinTrip}
                className="btn-primary flex-1"
              >
                Continue to Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripDetailsPage
