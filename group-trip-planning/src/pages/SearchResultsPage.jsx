import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Star, ArrowLeft, Filter, Loader } from 'lucide-react'
import { searchItineraries } from '../services/api'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [filteredItineraries, setFilteredItineraries] = useState([])
  const [sortBy, setSortBy] = useState('compatibility')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Transform SearchResponseDTO to UI format
  const transformApiResponse = (apiResults) => {
    if (!Array.isArray(apiResults)) return [];
    
    return apiResults.map(item => ({
      id: item.id,
      title: item.itinerary || `Trip to ${item.destination}`,
      description: item.description || '',
      destination: item.destination || '',
      duration: calculateDuration(item.start, item.end),
      startDate: item.start ? new Date(item.start).toISOString().split('T')[0] : '',
      endDate: item.end ? new Date(item.end).toISOString().split('T')[0] : '',
      price: item.price || 0,
      compatibilityScore: Math.round(item.matchingScore || 85),
      rating: 4.5 + Math.random() * 0.5, // Generate random rating 4.5-5.0
      reviewCount: Math.floor(Math.random() * 50) + 10, // Generate random review count 10-60
      groupSize: 4 + Math.floor(Math.random() * 8), // Generate random group size 4-12
      availableSlots: Math.floor(Math.random() * 4) + 1, // Generate random available slots 1-4
      image: getDefaultImage(item.destination),
      tags: generateTags(item.description, item.destination),
      highlights: generateHighlights(item.description),
      createdBy: generateCreator(),
    }));
  };

  // Helper function to calculate duration
  const calculateDuration = (start, end) => {
    if (!start || !end) return '7 days';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  // Helper function to get default image based on destination
  const getDefaultImage = (destination) => {
    const imageMap = {
      'morocco': 'https://images.unsplash.com/photo-1539650116574-75c0c6d04e2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      'patagonia': 'https://images.unsplash.com/photo-1610296669228-602fa827264c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    };
    
    const lowerDest = destination?.toLowerCase() || '';
    for (const [key, url] of Object.entries(imageMap)) {
      if (lowerDest.includes(key)) return url;
    }
    
    // Default travel image
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80';
  };

  // Helper function to generate tags based on description and destination
  const generateTags = (description, destination) => {
    const commonTags = ['Adventure', 'Culture', 'Food', 'Nature', 'Relaxation'];
    const destTags = {
      'morocco': ['Culture', 'Adventure', 'Desert'],
      'japan': ['Culture', 'Food', 'Technology'],
      'bali': ['Wellness', 'Beach', 'Nature'],
      'patagonia': ['Adventure', 'Hiking', 'Wildlife'],
    };
    
    const lowerDest = destination?.toLowerCase() || '';
    for (const [key, tags] of Object.entries(destTags)) {
      if (lowerDest.includes(key)) return tags;
    }
    
    return commonTags.slice(0, 3);
  };

  // Helper function to generate highlights
  const generateHighlights = (description) => {
    if (description) {
      // Extract key points from description if available
      const sentences = description.split('.').slice(0, 3);
      return sentences.map(s => s.trim()).filter(s => s.length > 0);
    }
    return ['Amazing locations', 'Cultural experiences', 'Great company'];
  };

  // Helper function to generate creator info
  const generateCreator = () => {
    const creators = [
      { id: 1, name: 'Olivia Bennett', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=256&h=256&fit=facearea&facepad=2', tripCount: 12 },
      { id: 2, name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=facearea&facepad=2', tripCount: 8 },
      { id: 3, name: 'Sarah Williams', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&h=256&fit=facearea&facepad=2', tripCount: 15 },
    ];
    return creators[Math.floor(Math.random() * creators.length)];
  };

  // Get search parameters
  const searchQuery = searchParams.get('destination') || ''
  const description = searchParams.get('description') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const budgetRange = searchParams.get('budget') || 'all'
  const groupSizeFilter = searchParams.get('groupSize') || 'all'
  const selectedVibes = searchParams.get('vibes') ? searchParams.get('vibes').split(',') : []
  const includeTravel = searchParams.get('includeTravel') === 'true'
  const includeAccommodation = searchParams.get('includeAccommodation') === 'true'

  // Load initial data
  useEffect(() => {
    // Check if we have search results from navigation state
    const searchResults = location.state?.searchResults
    
    if (searchResults) {
      // Use data from API response and transform it
      const transformedResults = transformApiResponse(searchResults);
      setFilteredItineraries(transformedResults);
    } else {
      // Fallback: Call API directly if no state data (e.g., direct URL access)
      handleApiSearch()
    }
  }, [location.state])

  // Handle API search
  const handleApiSearch = async () => {
    setIsLoading(true)
    setError('')

    try {
      const searchData = {
        searchQuery,
        description,
        startDate,
        endDate,
        budgetRange,
        groupSizeFilter,
        selectedVibes,
        includeTravel,
        includeAccommodation
      }

      const response = await searchItineraries(searchData)

      if (response.success) {
        const transformedResults = transformApiResponse(response.data || []);
        setFilteredItineraries(transformedResults);
      } else {
        setError(response.error || 'Failed to load search results')
      }
    } catch (err) {
      setError('An unexpected error occurred while loading results')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle sorting
  useEffect(() => {
    if (filteredItineraries.length === 0) return

    let sorted = [...filteredItineraries]

    if (sortBy === 'price-low') {
      sorted = sorted.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      sorted = sorted.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      sorted = sorted.sort((a, b) => b.rating - a.rating)
    } else {
      // Default sort by compatibility
      sorted = sorted.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0))
    }

    setFilteredItineraries(sorted)
  }, [sortBy])

  const goBackToSearch = () => {
    navigate('/explore')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={goBackToSearch}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Search</span>
            </button>
            <div className="h-6 border-l border-gray-300"></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Search Results
              </h1>
              {searchQuery && (
                <p className="text-gray-600 mt-1">
                  Showing trips for "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Search Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {searchQuery && (
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
                📍 {searchQuery}
              </span>
            )}
            {startDate && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                📅 {new Date(startDate).toLocaleDateString()}
                {endDate && ` - ${new Date(endDate).toLocaleDateString()}`}
              </span>
            )}
            {budgetRange !== 'all' && (
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                💰 {budgetRange.charAt(0).toUpperCase() + budgetRange.slice(1)} budget
              </span>
            )}
            {selectedVibes.length > 0 && (
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                ✨ {selectedVibes.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">{filteredItineraries.length}</span> trips found
          </p>
          <div className="flex items-center space-x-4">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto"
            >
              <option value="compatibility">Sort by compatibility</option>
              <option value="price-low">Sort by price (low to high)</option>
              <option value="price-high">Sort by price (high to low)</option>
              <option value="rating">Sort by rating</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Searching for trips...
              </h3>
              <p className="text-gray-600">
                Please wait while we find the perfect trips for you
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  Search Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleApiSearch}
                    className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && filteredItineraries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItineraries.map((trip) => (
              <Link
                key={trip.id}
                to={`/trip/${trip.id}`}
                className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-primary-100 text-primary-800 text-sm font-bold px-3 py-1 rounded-full">
                      {trip.compatibilityScore}% match
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{trip.rating}</span>
                      <span className="text-sm text-gray-500">({trip.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {trip.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3">
                    {trip.destination} • {trip.duration}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {trip.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {trip.availableSlots}/{trip.groupSize} spots left
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{trip.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <img
                      src={trip.createdBy.avatar}
                      alt={trip.createdBy.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {trip.createdBy.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {trip.createdBy.tripCount} trips organized
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          !isLoading && !error && (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">
                No trips found
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any trips matching your search criteria. Try adjusting your filters or searching for a different destination.
              </p>
              <div className="space-x-4">
                <button
                  onClick={goBackToSearch}
                  className="btn-primary"
                >
                  Modify Search
                </button>
                <Link to="/create" className="btn-secondary">
                  Create Your Own Trip
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default SearchResultsPage
