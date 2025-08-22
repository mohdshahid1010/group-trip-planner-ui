import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Filter, MapPin, Calendar, Users, Star, Heart, Share2, SlidersHorizontal, Loader, AlertCircle, Trophy, Clock, ArrowLeft, Plus } from 'lucide-react'
import { searchItineraries } from '../services/api'
import { getPublishedItineraries } from '../utils/itineraryStorage'
import { itineraries as mockItineraries } from '../data/mockData'

const SearchResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('matchingScore')
  const [searchCriteria, setSearchCriteria] = useState({})

  // Function to get appropriate image based on destination and vibe
  const getImageForDestination = (destination, vibe) => {
    const imageMap = {
      'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'Japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'Morocco': 'https://images.unsplash.com/photo-1539650116574-75c0c6d04e2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'Iceland': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80',
      'Switzerland': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'Thailand': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'Argentina': 'https://images.unsplash.com/photo-1610296669228-602fa827264c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'Chile': 'https://images.unsplash.com/photo-1610296669228-602fa827264c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    }

    // Try to match destination first
    for (const [dest, url] of Object.entries(imageMap)) {
      if (destination?.toLowerCase().includes(dest.toLowerCase())) {
        return url
      }
    }

    // Fallback based on vibe if destination not matched
    const vibeImages = {
      'ADVENTURE': 'https://images.unsplash.com/photo-1610296669228-602fa827264c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'BEACHES': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'CULTURAL': 'https://images.unsplash.com/photo-1539650116574-75c0c6d04e2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'WELLNESS': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80',
      'NATURE': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    }

    return vibeImages[vibe] || vibeImages['ADVENTURE']
  }

  // Function to get creator avatar based on vibe
  const getCreatorAvatar = (vibe) => {
    const avatars = {
      'ADVENTURE': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'BEACHES': 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'CULTURAL': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'WELLNESS': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
    
    return avatars[vibe] || avatars['ADVENTURE']
  }

  // Function to calculate match score for an itinerary
  const calculateMatchScore = (itinerary, criteria) => {
    let score = 0
    let maxScore = 0

    // Destination matching (30% weight)
    maxScore += 30
    if (criteria.destination?.trim()) {
      const destination = criteria.destination.toLowerCase()
      const itineraryDest = itinerary.destination?.toLowerCase() || ''
      
      if (itineraryDest.includes(destination) || destination.includes(itineraryDest)) {
        score += 30 // Exact or partial match
      } else {
        // Check for country/region matches
        const commonWords = destination.split(/\s+/).filter(word => 
          itineraryDest.includes(word) && word.length > 2
        )
        score += Math.min(20, commonWords.length * 10) // Partial credit
      }
    }

    // Date matching (20% weight) - check if trip dates are available
    maxScore += 20
    if (criteria.startDate && criteria.endDate && itinerary.startDate && itinerary.endDate) {
      const searchStart = new Date(criteria.startDate)
      const searchEnd = new Date(criteria.endDate)
      const itineraryStart = new Date(itinerary.startDate)
      const itineraryEnd = new Date(itinerary.endDate)

      // Check if dates overlap or are within reasonable range
      if ((itineraryStart <= searchEnd && itineraryEnd >= searchStart)) {
        score += 20 // Direct overlap
      } else {
        // Check if within 30 days of preferred dates
        const daysDiff = Math.min(
          Math.abs((itineraryStart - searchStart) / (1000 * 60 * 60 * 24)),
          Math.abs((itineraryEnd - searchEnd) / (1000 * 60 * 60 * 24))
        )
        if (daysDiff <= 30) {
          score += Math.max(5, 20 - daysDiff * 0.5) // Gradual decrease
        }
      }
    } else if (!criteria.startDate && !criteria.endDate) {
      score += 20 // No date preference, give full points
    }

    // Budget matching (25% weight)
    maxScore += 25
    if (criteria.budget?.min || criteria.budget?.max) {
      const minBudget = parseFloat(criteria.budget.min) || 0
      const maxBudget = parseFloat(criteria.budget.max) || Infinity
      const itineraryPrice = itinerary.price || 0

      if (itineraryPrice >= minBudget && itineraryPrice <= maxBudget) {
        score += 25 // Within budget range
      } else if (itineraryPrice < minBudget) {
        // Under budget - still good but less than perfect
        const diff = minBudget > 0 ? (minBudget - itineraryPrice) / minBudget : 0
        score += Math.max(10, 25 - diff * 15)
      } else {
        // Over budget - penalize based on how much over
        const diff = maxBudget !== Infinity ? (itineraryPrice - maxBudget) / maxBudget : 0
        score += Math.max(0, 25 - diff * 25)
      }
    } else {
      score += 25 // No budget preference, give full points
    }

    // Vibe/Tags matching (25% weight)
    maxScore += 25
    if (criteria.vibe) {
      const searchVibe = criteria.vibe.toLowerCase()
      const tags = itinerary.tags?.map(tag => tag.toLowerCase()) || []
      const travelStyle = itinerary.travelStyle?.toLowerCase() || ''
      
      if (tags.some(tag => tag.includes(searchVibe) || searchVibe.includes(tag)) ||
          travelStyle.includes(searchVibe) || searchVibe.includes(travelStyle)) {
        score += 25 // Direct vibe match
      } else {
        // Check for related vibes
        const vibeMapping = {
          'beaches': ['nature', 'wellness', 'luxury'],
          'adventure': ['nature', 'photography', 'explorer'],
          'cultural': ['food', 'photography', 'explorer'],
          'wellness': ['nature', 'beaches', 'luxury'],
          'foodie': ['cultural', 'wellness'],
          'nature': ['adventure', 'photography', 'wellness'],
          'photography': ['adventure', 'cultural', 'nature'],
          'luxury': ['wellness', 'cultural', 'beaches']
        }
        
        const relatedVibes = vibeMapping[searchVibe] || []
        const hasRelated = tags.some(tag => relatedVibes.includes(tag)) ||
                          relatedVibes.some(vibe => travelStyle.includes(vibe))
        if (hasRelated) {
          score += 15 // Related vibe match
        }
      }
    } else {
      score += 25 // No vibe preference, give full points
    }

    // Return percentage score
    return Math.round((score / maxScore) * 100)
  }

  // Function to filter published itineraries based on search criteria
  const filterPublishedItineraries = (criteria) => {
    // Get published itineraries
    const publishedItineraries = getPublishedItineraries()
    
    // Combine with mock itineraries for better results
    const allItineraries = [...publishedItineraries, ...mockItineraries]

    // Calculate match scores and filter
    const filteredResults = allItineraries
      .map(itinerary => ({
        ...itinerary,
        matchingScore: calculateMatchScore(itinerary, criteria),
        // Ensure required fields for display
        itinerary: itinerary.title || itinerary.itinerary || 'Untitled Trip',
        totalDays: itinerary.duration ? parseInt(itinerary.duration) : itinerary.days?.length || 7,
        vibe: itinerary.travelStyle || itinerary.vibe || 'ADVENTURE'
      }))
      .filter(itinerary => itinerary.matchingScore > 30) // Only show decent matches (>30%)
      .sort((a, b) => b.matchingScore - a.matchingScore) // Sort by match score

    return filteredResults
  }

  useEffect(() => {
    // Check if we have search results from navigation state
    const searchResults = location.state?.searchResults;
    const searchCriteriaFromState = location.state?.searchCriteria;

    if (searchResults) {
      // Use the search results passed from ExplorePage
      setItineraries(searchResults);
      setSearchCriteria(searchCriteriaFromState || {});
      setLoading(false);
    } else {
      // No search results in state, perform search based on URL params
      const searchParams = new URLSearchParams(location.search);
      const criteriaFromParams = {
        destination: searchParams.get('destination') || '',
        source: searchParams.get('source') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        budget: {
          min: searchParams.get('budgetMin') || '',
          max: searchParams.get('budgetMax') || ''
        },
        vibe: searchParams.get('vibe') || '',
        includeTravel: searchParams.get('includeTravel') === 'true',
        includeAccommodation: searchParams.get('includeAccommodation') === 'true'
      };
      
      setSearchCriteria(criteriaFromParams);
      
      // Filter published itineraries
      setLoading(true);
      const filteredItineraries = filterPublishedItineraries(criteriaFromParams);
      setItineraries(filteredItineraries);
      setLoading(false);
    }
  }, [location]);

  const performSearch = async (searchParams) => {
    setLoading(true);
    setError('');

    try {
      const searchCriteriaFromParams = {
        destination: searchParams.get('destination') || '',
        source: searchParams.get('source') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        budget: {
          min: searchParams.get('budgetMin') || '',
          max: searchParams.get('budgetMax') || ''
        },
        vibe: searchParams.get('vibe') || '',
        includeTravel: searchParams.get('includeTravel') === 'true',
        includeAccommodation: searchParams.get('includeAccommodation') === 'true'
      };

      setSearchCriteria(searchCriteriaFromParams);
      
      // Filter published itineraries instead of API call
      const filteredItineraries = filterPublishedItineraries(searchCriteriaFromParams);
      setItineraries(filteredItineraries);
      
    } catch (error) {
      console.error('Search error:', error);
      setError('An unexpected error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'matchingScore', label: 'Sort by compatibility' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'duration', label: 'Duration' }
  ]

  const sortedItineraries = [...itineraries].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'matchingScore':
        return b.matchingScore - a.matchingScore
      case 'duration':
        return a.totalDays - b.totalDays
      default:
        return b.matchingScore - a.matchingScore
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Search</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {itineraries.length} trips found
              </h1>
              <p className="text-gray-600 text-lg">
                {searchCriteria.destination ? `Trips to ${searchCriteria.destination}` : 'Search Results'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>



        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Searching for trips...</h3>
              <p className="text-gray-600">Please wait while we find the perfect trips for you</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-red-800 mb-2">Search Error</h3>
            <p className="text-red-600">{error}</p>
            <button onClick={() => navigate('/explore')} className="mt-4 btn-primary">Try Again</button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && sortedItineraries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItineraries.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                
                {/* Image with badges */}
                <div className="relative">
                  <img
                    src={trip.image || getImageForDestination(trip.destination, trip.vibe)}
                    alt={trip.itinerary}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = getImageForDestination(trip.destination, trip.vibe)
                    }}
                  />
                  {/* Match percentage badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {trip.matchingScore}% match
                    </span>
                  </div>

                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{trip.itinerary}</h3>
                  
                  {/* Location and duration */}
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trip.destination} • {trip.totalDays} days</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      {trip.vibe}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      {trip.vibe === 'ADVENTURE' ? 'Mountains' : trip.vibe === 'BEACHES' ? 'Beach' : trip.vibe === 'CULTURAL' ? 'Culture' : trip.vibe === 'WELLNESS' ? 'Wellness' : 'Travel'}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      {trip.vibe === 'ADVENTURE' ? 'Trekking' : trip.vibe === 'BEACHES' ? 'Party' : trip.vibe === 'CULTURAL' ? 'Heritage' : trip.vibe === 'WELLNESS' ? 'Yoga' : 'Experience'}
                    </span>
                  </div>

                  {/* Spots left */}
                  <div className="flex items-center text-gray-600 mb-4">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">{Math.floor(Math.random() * 5) + 1}/{Math.floor(Math.random() * 3) + 8} spots left</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{trip.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Creator info */}
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                    <img
                      src={getCreatorAvatar(trip.vibe)}
                      alt="Creator"
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.vibe === 'ADVENTURE' ? 'Marcus Chen' : trip.vibe === 'BEACHES' ? 'Olivia Bennett' : trip.vibe === 'CULTURAL' ? 'Sarah Williams' : 'Alex Kumar'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.floor(Math.random() * 20) + 5} trips organized
                      </p>
                    </div>
                  </div>
                  
                  {/* Join button */}
                  <Link 
                    to={`/trip/${trip.id}`}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center block"
                  >
                    Join Itinerary
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && sortedItineraries.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">No matching trips found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any published trips matching your search criteria. 
              {searchCriteria.destination && (
                <span className="block mt-2 font-medium">
                  Searched for: {searchCriteria.destination}
                  {searchCriteria.vibe && ` • ${searchCriteria.vibe} style`}
                  {searchCriteria.budget?.min && ` • ₹${parseInt(searchCriteria.budget.min).toLocaleString()}+ budget`}
                </span>
              )}
            </p>
            <div className="space-y-4">
              {/* Create New Itinerary Option */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-6 max-w-lg mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <Plus className="h-6 w-6" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-2">Create Your Perfect Trip</h4>
                <p className="text-primary-100 mb-4">
                  No problem! Let our AI create a custom itinerary just for you based on your preferences.
                </p>
                <Link 
                  to="/create" 
                  state={{ searchCriteria }}
                  className="inline-block bg-white text-primary-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Create Custom Itinerary
                </Link>
              </div>
              
              {/* Other Options */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/explore')} 
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Modify Search
                </button>
                <Link 
                  to="/explore" 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Browse All Trips
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResultsPage