import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  MapPin, Calendar, Users, Star, Share2, Heart, 
  CheckCircle, Clock, ArrowLeft, 
  Sparkles, Lock, CreditCard, Info, X, Download,
  MessageCircle, Facebook, Instagram, Copy, Link as LinkIcon
} from 'lucide-react'
import { itineraries, reviews, users } from '../data/mockData'
import { getPublishedItineraries } from '../utils/itineraryStorage'

const TripDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedActivities, setSelectedActivities] = useState(new Set())
  const [totalSelectedPrice, setTotalSelectedPrice] = useState(0)
  const [showLockInModal, setShowLockInModal] = useState(false)
  const [showSharingModal, setShowSharingModal] = useState(false)
  const [showOptOutModal, setShowOptOutModal] = useState(false)
  const [hasJoinedTrip, setHasJoinedTrip] = useState(false)

  // Check if user has joined this trip
  const checkIfUserJoinedTrip = (tripId) => {
    try {
      const joinedTrips = JSON.parse(localStorage.getItem('joined_trips') || '[]')
      const hasJoined = joinedTrips.includes(parseInt(tripId))
      console.log('Checking joined status for trip:', tripId, 'Joined trips:', joinedTrips, 'Has joined:', hasJoined)
      return hasJoined
    } catch (error) {
      console.error('Error checking joined trips:', error)
      return false
    }
  }

  // Load trip data from both mock data and published itineraries
  useEffect(() => {
    const tripId = parseInt(id)
    
    // Check if user has already joined this trip
    const hasAlreadyJoined = checkIfUserJoinedTrip(tripId)
    console.log('Setting hasJoinedTrip to:', hasAlreadyJoined, 'for trip:', tripId)
    setHasJoinedTrip(hasAlreadyJoined)
    
    // First check mock data
    let foundTrip = itineraries.find(t => t.id === tripId)
    let published = false
    
    if (!foundTrip) {
      // Check published itineraries
      const publishedTrips = getPublishedItineraries()
      foundTrip = publishedTrips.find(t => t.id === tripId)
      
      if (foundTrip) {
        published = true
        // Convert published trip format to display format with enhanced data
        foundTrip = {
          ...foundTrip,

          reviewCount: foundTrip.reviewCount || 0,
          compatibilityScore: 95,
          availableSlots: foundTrip.groupSize ? parseInt(foundTrip.groupSize.split('-')[1]) - (foundTrip.participants?.length || 0) : 3,
          participants: foundTrip.participants || [],
          // Enhanced itinerary with pricing
          itinerary: foundTrip.days ? foundTrip.days.map((day, index) => ({
            day: day.day,
            title: day.title || `Day ${day.day}`,
            activities: day.activities || [],
            detailedActivities: generateDetailedActivities(day, index), // Generate detailed activities with pricing
            accommodation: day.highlights || 'Local accommodation',
            meals: ['Breakfast', 'Lunch']
          })) : [],
          lockInAmount: Math.round((foundTrip.price || 12000) * 0.1), // 10% lock-in
          totalMembers: 5,
          spotsLeft: 3
        }
      }
    } else {
      // For mock data, add enhanced fields
      foundTrip = {
        ...foundTrip,
        lockInAmount: Math.round(foundTrip.price * 0.1),
        totalMembers: foundTrip.groupSize,
        spotsLeft: foundTrip.availableSlots,
        // Add detailed activities with pricing to existing itinerary
        itinerary: foundTrip.itinerary?.map((day, index) => ({
          ...day,
          detailedActivities: generateDetailedActivities(day, index)
        })) || []
      }
    }
    
    setTrip(foundTrip)
    setIsPublished(published)
    setLoading(false)
  }, [id])

  // Generate detailed activities with pricing based on day content
  const generateDetailedActivities = (day, dayIndex) => {
    const activities = []
    
    if (dayIndex === 0) {
      activities.push(
        {
          id: `day${dayIndex}-1`,
          name: "Journey to Destination",
          description: "Essential transport to base camp with safety equipment",
          duration: "480 minutes",
          price: 3500,
          type: "essential", // essential, free, optional, paid_essential
          transport: "VEHICLE: ₹3,500",
          included: true,
          modifiable: false // Cannot be deselected
        },
        {
          id: `day${dayIndex}-2`,
          name: "Welcome Ceremony",
          description: "Traditional local welcome and safety briefing",
          duration: "60 minutes",
          price: 0,
          type: "free",
          included: true,
          modifiable: false
        }
      )
    } else if (dayIndex === 1) {
      activities.push(
        {
          id: `day${dayIndex}-1`,
          name: "Professional Trekking Guide Service",
          description: "Certified mountain guide for entire expedition - essential for safety",
          duration: "1440 minutes",
          price: 4000,
          type: "paid_essential", // Pre-selected paid activity, unmodifiable
          included: true,
          modifiable: false,
          preSelected: true
        },
        {
          id: `day${dayIndex}-2`,
          name: "Group Morning Meditation",
          description: "Start your day with peaceful mountain meditation",
          duration: "30 minutes",
          price: 0,
          type: "free",
          included: true,
          modifiable: false
        },
        {
          id: `day${dayIndex}-3`,
          name: "Himalaya Pass Trek Experience",
          description: "Challenging trek through stunning alpine meadows",
          duration: "480 minutes",
          price: 1000,
          type: "optional",
          included: false,
          modifiable: true,
          recommended: true // Suggested but optional
        }
      )
    } else {
      activities.push(
        {
          id: `day${dayIndex}-1`,
          name: "Local Cultural Experience",
          description: "Authentic cultural activities and interactions with local communities",
          duration: "240 minutes",
          price: 0,
          type: "free",
          included: true,
          modifiable: false
        },
        {
          id: `day${dayIndex}-2`,
          name: "Premium Adventure Activity",
          description: "Exciting outdoor adventure activity with professional equipment",
          duration: "180 minutes",
          price: 1500,
          type: "optional",
          included: false,
          modifiable: true,
          popular: true // Popular add-on
        },
        {
          id: `day${dayIndex}-3`,
          name: "Photography Workshop",
          description: "Learn landscape photography with a professional photographer",
          duration: "120 minutes",
          price: 800,
          type: "optional",
          included: false,
          modifiable: true
        },
        {
          id: `day${dayIndex}-4`,
          name: "Evening Campfire Stories",
          description: "Join fellow travelers for stories and songs around the campfire",
          duration: "90 minutes",
          price: 0,
          type: "optional",
          included: true,
          modifiable: false
        }
      )
    }
    
    return activities
  }

  // Handle activity selection
  const handleActivityToggle = (activityId, price, isSelected) => {
    const newSelected = new Set(selectedActivities)
    if (isSelected) {
      newSelected.add(activityId)
      setTotalSelectedPrice(prev => prev + price)
    } else {
      newSelected.delete(activityId)
      setTotalSelectedPrice(prev => prev - price)
    }
    setSelectedActivities(newSelected)
  }

  // Initialize selected activities when trip loads
  useEffect(() => {
    if (trip?.itinerary) {
      const initialSelected = new Set()
      let initialPrice = 0
      
      trip.itinerary.forEach(day => {
        day.detailedActivities?.forEach(activity => {
          if ((activity.included && activity.type === 'optional') || activity.recommended) {
            initialSelected.add(activity.id)
            initialPrice += activity.price
          }
        })
      })
      
      setSelectedActivities(initialSelected)
      setTotalSelectedPrice(initialPrice)
    }
  }, [trip])

  const handleJoinTrip = () => {
    navigate(`/booking/${trip.id}`)
  }

  // Mock participants data for "Who's Joining" section
  const mockParticipants = [
    { id: 1, name: "Sarah Johnson", location: "Mumbai, India", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", joined: "15/09/2023" },
    { id: 2, name: "Raj Patel", location: "Delhi, India", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", joined: "20/08/2023" },
    { id: 3, name: "Priya Singh", location: "Bangalore, India", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", joined: "10/09/2023" },
    { id: 4, name: "Arjun Mehta", location: "Pune, India", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", joined: "18/09/2023" },
    { id: 5, name: "Kavya Reddy", location: "Hyderabad, India", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", joined: "12/09/2023" }
  ]

  const handleLockInClick = () => {
    setShowLockInModal(true)
  }

  const handlePayment = () => {
    // Demo payment - in real app, this would integrate with payment gateway
    setShowLockInModal(false)
    setHasJoinedTrip(true)
    
    // Save to joined trips in localStorage
    try {
      const joinedTrips = JSON.parse(localStorage.getItem('joined_trips') || '[]')
      const tripId = parseInt(id)
      console.log('Saving joined trip:', tripId, 'Current joined trips:', joinedTrips)
      if (!joinedTrips.includes(tripId)) {
        joinedTrips.push(tripId)
        localStorage.setItem('joined_trips', JSON.stringify(joinedTrips))
        console.log('Updated joined trips:', joinedTrips)
      }
    } catch (error) {
      console.error('Error saving joined trip:', error)
    }
    
    setShowSharingModal(true)
    // Here you would typically update trip status and reduce available slots
  }

  const handleOptOut = () => {
    setShowOptOutModal(true)
  }

  const confirmOptOut = () => {
    // In a real app, this would handle the opt-out process, refunds, etc.
    setHasJoinedTrip(false)
    setShowOptOutModal(false)
    
    // Remove from joined trips in localStorage
    try {
      const joinedTrips = JSON.parse(localStorage.getItem('joined_trips') || '[]')
      const tripId = parseInt(id)
      const updatedTrips = joinedTrips.filter(id => id !== tripId)
      localStorage.setItem('joined_trips', JSON.stringify(updatedTrips))
      console.log('Removed trip', tripId, 'from joined trips. Updated list:', updatedTrips)
    } catch (error) {
      console.error('Error removing joined trip:', error)
    }
    
    alert('You have successfully opted out of this trip. Refund processing may take 3-5 business days.')
  }

  // Debug function - can be called from browser console
  window.debugJoinedTrips = () => {
    const joinedTrips = JSON.parse(localStorage.getItem('joined_trips') || '[]')
    console.log('Current joined trips:', joinedTrips)
    console.log('Current trip ID:', parseInt(id))
    console.log('Has joined this trip:', joinedTrips.includes(parseInt(id)))
    return { joinedTrips, currentTripId: parseInt(id), hasJoined: joinedTrips.includes(parseInt(id)) }
  }

  const generateShareableUrl = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/trip/${trip.id}?ref=shared`
  }

  const generateTripCardData = () => {
    const shareableUrl = generateShareableUrl()
    const finalPrice = (trip.price || 12000) + totalSelectedPrice
    
    return {
      title: trip.title,
      destination: trip.destination,
      duration: trip.duration,

      spotsLeft: Math.max(0, (trip.spotsLeft || 3) - 1), // Reduce by 1 since user just joined
      startDate: trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short' 
      }) : 'Aug 22',
      endDate: trip.endDate ? new Date(trip.endDate).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }) : 'Aug 29, 2025',
      price: finalPrice,
      url: shareableUrl
    }
  }

  const handleWhatsAppShare = () => {
    const tripData = generateTripCardData()
    const message = `🎉 Just booked an amazing trip to ${tripData.destination}!\n\n${tripData.title}\n📅 ${tripData.startDate} - ${tripData.endDate}\n👥 Only ${tripData.spotsLeft} spots left!\n\nJoin me on this adventure: ${tripData.url}`
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleFacebookShare = () => {
    const tripData = generateTripCardData()
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tripData.url)}&quote=${encodeURIComponent(`Just booked ${tripData.title}! Join me on this amazing ${tripData.duration} adventure to ${tripData.destination}. Only ${tripData.spotsLeft} spots left!`)}`
    
    window.open(facebookUrl, '_blank')
  }

  const handleInstagramShare = () => {
    // For Instagram, we'll copy the link and message for manual sharing
    const tripData = generateTripCardData()
    const message = `Just booked ${tripData.title}! 🎉\n${tripData.destination} • ${tripData.duration}\n${tripData.spotsLeft} spots left\n\nLink: ${tripData.url}`
    
    navigator.clipboard.writeText(message).then(() => {
      alert('Trip details copied to clipboard! Open Instagram and paste in your story.')
    })
  }

  const handleCopyLink = () => {
    const tripData = generateTripCardData()
    navigator.clipboard.writeText(tripData.url).then(() => {
      alert('Trip link copied to clipboard!')
    })
  }

  const downloadTripCard = () => {
    // In a real app, this would generate and download an image
    alert('Trip card download feature would generate a beautiful image with trip details for sharing!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h2>
          <Link to={isPublished ? "/profile" : "/explore"} className="btn-primary">
            {isPublished ? 'Back to Profile' : 'Back to Explore'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          </div>

          {/* Trip Title and Details */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{trip.title}</h1>
            <div className="flex items-center space-x-6 text-gray-600 mb-4">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {trip.destination}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {trip.startDate && trip.endDate ? 
                  `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}` :
                  trip.duration
                }
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {trip.duration || '2 days'}
                  </span>
              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm font-medium">
                    {trip.compatibilityScore}% match
                  </span>
                </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium mb-1">Total Trip Cost</div>
                <div className="text-2xl font-bold text-blue-900">₹{trip.price?.toLocaleString() || '12,000'}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium mb-1">Lock-in Amount (10%)</div>
                <div className="text-2xl font-bold text-purple-900">₹{trip.lockInAmount?.toLocaleString() || '1,200'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Who's Joining Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Who's Joining</h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{trip.totalMembers || 5}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
          </div>
          <p className="text-gray-600 mb-6">Meet your fellow travelers for this trip</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {mockParticipants.slice(0, 5).map((participant) => (
              <div key={participant.id} className="text-center">
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="h-12 w-12 rounded-full mx-auto mb-2"
                />
                <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                <div className="text-xs text-gray-500">{participant.location}</div>
                <div className="text-xs text-gray-400">Joined {participant.joined}</div>
                        </div>
            ))}
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-gray-400" />
                          </div>
              <div className="text-sm font-medium text-gray-500">This could be you!</div>
              <div className="text-xs text-gray-400">Join this amazing trip</div>
                          </div>
                        </div>
                      </div>

        {/* Group Insights */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Group Insights</h2>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{trip.totalMembers || 5}</div>
              <div className="text-sm text-gray-600">Total Members</div>
                    </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{trip.spotsLeft || 3}</div>
              <div className="text-sm text-gray-600">Spots Left</div>
                </div>
                  <div>
              <div className="text-2xl font-bold text-purple-600">63%</div>
              <div className="text-sm text-gray-600">Full</div>
                  </div>
                    <div>
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-gray-600">Close</div>
            </div>
          </div>
                    </div>

        {/* Day-wise Itinerary */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Day-wise Itinerary</h2>
          <p className="text-gray-600 mb-6">
            Free events are automatically included. Essential services are included in the base price. You can select
            additional optional paid events.
          </p>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Free - Included</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Essential - Included in Price</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Pre-selected - Paid & Included</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Optional - You Choose</span>
                    </div>
                  </div>

          {/* Itinerary Days */}
          <div className="space-y-6">
            {trip.itinerary?.map((day) => (
              <div key={day.day}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                    {day.day}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Day {day.day}</h3>
                </div>

                <div className="space-y-3 ml-11">
                  {day.detailedActivities?.map((activity, actIndex) => {
                    const isSelected = selectedActivities.has(activity.id)
                    const isModifiable = activity.modifiable && !isPublished
                    
                    return (
                      <div
                        key={actIndex}
                        className={`border rounded-lg p-4 ${
                          activity.type === 'free' 
                            ? 'border-green-200 bg-green-50' 
                            : activity.type === 'essential'
                            ? 'border-orange-200 bg-orange-50'
                            : activity.type === 'paid_essential'
                            ? 'border-purple-200 bg-purple-50'
                            : isSelected
                            ? 'border-blue-300 bg-blue-100'
                            : 'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-3 flex-1">
                            {/* Checkbox for modifiable paid activities only */}
                            {isModifiable && activity.type === 'optional' && activity.price > 0 && (
                              <div className="pt-1">
                                <input
                                  type="checkbox"
                                  id={activity.id}
                                  checked={isSelected}
                                  onChange={(e) => handleActivityToggle(activity.id, activity.price, e.target.checked)}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {activity.name}
                                {activity.recommended && (
                                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    Recommended
                                  </span>
                                )}
                                {activity.popular && (
                                  <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                                    Popular
                                  </span>
                                )}
                                {activity.preSelected && (
                                  <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                    Pre-selected
                                  </span>
                                )}
                              </h4>
                              <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                              <div className="flex items-center text-xs text-gray-500 space-x-4">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {activity.duration}
                                </span>
                                {activity.transport && (
                                  <span>Travel: {activity.transport}</span>
                                )}
                    </div>
                  </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium px-2 py-1 rounded ${
                              activity.type === 'free' 
                                ? 'bg-green-100 text-green-800' 
                                : activity.type === 'essential'
                                ? 'bg-orange-100 text-orange-800'
                                : activity.type === 'paid_essential'
                                ? 'bg-purple-100 text-purple-800'
                                : isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {activity.type === 'free' 
                                ? 'FREE - INCLUDED' 
                                : activity.type === 'essential'
                                ? 'INCLUDED IN PRICE'
                                : activity.type === 'paid_essential'
                                ? 'PRE-SELECTED'
                                : isSelected
                                ? `₹${activity.price?.toLocaleString()} - SELECTED`
                                : `₹${activity.price?.toLocaleString()}`
                              }
                        </div>
                                                        {activity.type === 'optional' && activity.price === 0 && (
                              <div className="text-xs text-gray-500 mt-1">Free Activity</div>
                            )}
                            {activity.type === 'optional' && activity.price > 0 && !activity.modifiable && (
                              <div className="text-xs text-gray-500 mt-1">Fixed</div>
                            )}
                            {activity.type === 'optional' && activity.price > 0 && activity.modifiable && (
                              <div className="text-xs text-gray-500 mt-1">
                                {isSelected ? 'Selected' : 'Optional'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                        </div>
                      </div>
                      ))}
                    </div>
        </div>

        {/* Ready to Join Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to Join?</h2>
          <p className="text-gray-600 mb-6">
            Secure your spot with just 10% payment. You can pay the remaining amount closer to the trip date.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium mb-1">Lock-in Amount (10%)</div>
              <div className="text-2xl font-bold text-purple-900">₹{trip.lockInAmount?.toLocaleString() || '1,200'}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 font-medium mb-1">Remaining Amount</div>
              <div className="text-2xl font-bold text-gray-900">₹{((trip.price || 12000) + totalSelectedPrice - (trip.lockInAmount || 1200)).toLocaleString()}</div>
            </div>
          </div>

          {totalSelectedPrice > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-600 font-medium">Selected Optional Activities</div>
                  <div className="text-xs text-blue-500">These will be added to your final trip cost</div>
                </div>
                <div className="text-lg font-bold text-blue-900">+₹{totalSelectedPrice.toLocaleString()}</div>
              </div>
                    </div>
                  )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                        <div>
                <div className="text-sm text-gray-600 font-medium">Total Trip Cost</div>
                <div className="text-xs text-gray-500">Base price + selected activities</div>
              </div>
              <div className="text-xl font-bold text-gray-900">₹{((trip.price || 12000) + totalSelectedPrice).toLocaleString()}</div>
                        </div>
                      </div>

          <div className="text-center mb-6">
            <div className="text-sm text-primary-600 font-medium flex items-center justify-center">
              <Users className="h-4 w-4 mr-1" />
              {trip.spotsLeft || 3} spots left
                        </div>
          </div>

                    {/* Debug info */}
          {console.log('Render states:', { isPublished, hasJoinedTrip, tripId: trip?.id })}
          
          {!isPublished && !hasJoinedTrip && (
            <button
              onClick={handleLockInClick}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Lock className="h-5 w-5" />
              <span>Lock-in Your Spot - ₹{trip.lockInAmount?.toLocaleString() || '1,200'}</span>
            </button>
          )}

          {!isPublished && hasJoinedTrip && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-green-800 text-center mb-2">
                You've already joined this trip!
              </h3>
              <p className="text-green-700 text-center mb-6">
                Check your profile to see all your joined trips.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/mytrips"
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  View My Trips →
                </Link>
                <button
                  onClick={handleOptOut}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Opt Out</span>
                </button>
                <button
                  onClick={() => setShowSharingModal(true)}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Trip</span>
                </button>
              </div>
            </div>
          )}

          {isPublished && (
            <div className="text-center">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block">
                This is your published trip
              </div>
            </div>
          )}
        </div>

        {/* Lock-in Payment Modal */}
        {showLockInModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lock-in Payment</h2>
                <p className="text-gray-600">Secure your spot for this amazing trip!</p>
              </div>

              {/* Trip Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trip</span>
                  <span className="font-semibold text-gray-900">{trip.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Cost</span>
                  <span className="font-semibold text-gray-900">₹{((trip.price || 12000) + totalSelectedPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-primary-600 font-medium">Lock-in Amount (10%)</span>
                  <span className="font-bold text-primary-600 text-xl">₹{Math.round(((trip.price || 12000) + totalSelectedPrice) * 0.1).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  Pay ₹{Math.round(((trip.price || 12000) + totalSelectedPrice) * 0.1).toLocaleString()} Now
                </button>
                <button
                  onClick={() => setShowLockInModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Demo Disclaimer */}
              <p className="text-xs text-gray-500 text-center mt-4">
                This is a demo payment. No actual payment will be processed.
              </p>
            </div>
                </div>
              )}

        {/* Trip Sharing Modal */}
        {showSharingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🎉</span>
                  <h2 className="text-xl font-bold text-gray-900">Trip Confirmed!</h2>
                </div>
                <button
                  onClick={() => setShowSharingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-green-600 mb-2">Your spot is locked in!</h3>
                <p className="text-gray-600">Share this amazing trip with friends and family</p>
                        </div>

              {/* Beautiful Trip Card */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{trip.title}</h3>

                  </div>

                  <div className="flex items-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.destination}</span>
                    </div>
                                <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{trip.duration}</span>
                                </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{Math.max(0, (trip.spotsLeft || 3) - 1)} spots left</span>
                            </div>
                          </div>

                  <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                    <div className="text-sm opacity-90 mb-1">Travel Dates</div>
                    <div className="font-semibold">
                      {trip.startDate && trip.endDate ? 
                        `${new Date(trip.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${new Date(trip.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` :
                        'Aug 22 - Aug 29, 2025'
                      }
                    </div>
                </div>

                  <div className="text-center">
                    <div className="text-lg font-bold mb-1">Join the adventure!</div>
                    <div className="text-sm bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full inline-block">
                      Limited spots available ⚡
            </div>
          </div>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
              </div>

              {/* Download Trip Card */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Download className="h-5 w-5 text-purple-600" />
                </div>
                    <div>
                      <div className="font-semibold text-gray-900">Share as Image</div>
                      <div className="text-sm text-gray-600">Download beautiful trip card</div>
                </div>
                </div>
                  <button
                    onClick={downloadTripCard}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Social Media Sharing */}
              <div className="mb-6">
                <div className="text-center text-gray-600 mb-4">Share with image + link:</div>
                
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <button
                    onClick={handleWhatsAppShare}
                    className="bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </button>
                  
                  <button
                    onClick={handleFacebookShare}
                    className="bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Facebook className="h-5 w-5" />
                    <span>Facebook</span>
                  </button>
                  
                  <button
                    onClick={handleInstagramShare}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>Instagram Story</span>
                  </button>
                </div>

                <div className="text-center text-gray-500 text-sm mb-3">OR</div>
                
                <button
                  onClick={handleCopyLink}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Link Only</span>
                </button>
                <div className="text-center text-xs text-gray-500 mt-1">For text-only sharing</div>
              </div>

              {/* Direct Link Info */}
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <LinkIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Direct Link</div>
                    <div className="text-sm text-blue-700">Friends can join directly using your shared link</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
              <button
                  onClick={() => setShowSharingModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                  Maybe Later
              </button>
              <button
                  onClick={downloadTripCard}
                  className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                  <Download className="h-4 w-4" />
                  <span>Get Image</span>
              </button>
                          </div>
            </div>
          </div>
        )}

        {/* Opt Out Confirmation Modal */}
        {showOptOutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              {/* Warning Header */}
              <div className="text-center mb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Opt Out of Trip?</h2>
                <p className="text-gray-600">Are you sure you want to cancel your participation?</p>
              </div>

              {/* Warning Details */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-800 mb-2">⚠️ Important Information</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Refunds may be subject to cancellation policies</li>
                  <li>• Processing may take 3-5 business days</li>
                  <li>• You won't be able to rejoin if the trip fills up</li>
                  <li>• Other participants will be notified</li>
                </ul>
              </div>

              {/* Trip Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Trip Details</h3>
                <div className="text-sm space-y-1">
                  <div><strong>Trip:</strong> {trip.title}</div>
                  <div><strong>Amount Paid:</strong> ₹{Math.round(((trip.price || 12000) + totalSelectedPrice) * 0.1).toLocaleString()}</div>
                  <div><strong>Total Cost:</strong> ₹{((trip.price || 12000) + totalSelectedPrice).toLocaleString()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowOptOutModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Keep My Spot
                </button>
                <button
                  onClick={confirmOptOut}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Yes, Opt Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripDetailsPage