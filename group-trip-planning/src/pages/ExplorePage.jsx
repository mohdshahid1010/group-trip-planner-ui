import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Leaf, Camera, Heart, Coffee, Loader, Mountain, Waves, Utensils, Plane, Building } from 'lucide-react'
import { searchItineraries } from '../services/api'

const ExplorePage = () => {
  const navigate = useNavigate()
  const [searchCriteria, setSearchCriteria] = useState({
    prompt: '',
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: {
      min: '',
      max: ''
    },
    vibe: '',
    includeTravel: true,
    includeAccommodation: true
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  // Get today's date in local timezone for date restrictions
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const vibes = [
    { id: 'BEACHES', label: 'Beaches', icon: Waves },
    { id: 'ADVENTURE', label: 'Adventure', icon: Mountain },
    { id: 'CULTURAL', label: 'Cultural', icon: Coffee },
    { id: 'WELLNESS', label: 'Wellness', icon: Heart },
    { id: 'FOODIE', label: 'Food & Wine', icon: Utensils },
    { id: 'NATURE', label: 'Nature', icon: Leaf },
    { id: 'PHOTOGRAPHY', label: 'Photography', icon: Camera },
    { id: 'LUXURY', label: 'Luxury', icon: Building }
  ]

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setSearchCriteria(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setSearchCriteria(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleVibeSelect = (vibeId) => {
    setSearchCriteria(prev => ({
      ...prev,
      vibe: prev.vibe === vibeId ? '' : vibeId
    }))
  }

  const handleSearch = async () => {
    // Clear previous errors
    setSearchError('')
    setIsSearching(true)

    try {
      // Validate required fields
      if (!searchCriteria.destination.trim()) {
        setSearchError('Please enter a destination')
        setIsSearching(false)
        return
      }

      // Call the search API with enhanced criteria
      const response = await searchItineraries(searchCriteria)

      if (response.success) {
        // Navigate to search results page with the API response
        const searchParams = new URLSearchParams({
          ...(searchCriteria.destination && { destination: searchCriteria.destination }),
          ...(searchCriteria.source && { source: searchCriteria.source }),
          ...(searchCriteria.startDate && { startDate: searchCriteria.startDate }),
          ...(searchCriteria.endDate && { endDate: searchCriteria.endDate }),
          ...(searchCriteria.vibe && { vibe: searchCriteria.vibe }),
          includeTravel: searchCriteria.includeTravel.toString(),
          includeAccommodation: searchCriteria.includeAccommodation.toString()
        })

        // Pass the search results via navigation state
        navigate(`/search-results?${searchParams.toString()}`, {
          state: { searchResults: response.data, searchCriteria }
        })
      } else {
        // Handle API error
        setSearchError(response.error || 'Failed to search itineraries. Please try again.')
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchError('An unexpected error occurred. Please check your connection and try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const clearAllFilters = () => {
    setSearchCriteria({
      prompt: '',
      source: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: {
        min: '',
        max: ''
      },
      vibe: '',
      includeTravel: true,
      includeAccommodation: true
    })
    setSearchError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect Trip
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing travel experiences and connect with like-minded adventurers around the world
          </p>
        </div>

        {/* Error Message */}
        {searchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Search Error
                </h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{searchError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Centered Search Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="space-y-6">
            {/* Detailed Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your ideal trip
              </label>
              <textarea
                placeholder="Tell us about your perfect travel experience - activities, atmosphere, special interests..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px] resize-none text-base"
                value={searchCriteria.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                rows="4"
              />
            </div>

            {/* Source and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting from (optional)
                </label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Your departure city"
                    className="w-full pl-10 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={searchCriteria.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full pl-10 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={searchCriteria.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={searchCriteria.startDate}
                    onChange={(e) => {
                      handleInputChange('startDate', e.target.value);
                      // Clear end date if it's before the new start date
                      if (searchCriteria.endDate && e.target.value && new Date(e.target.value) >= new Date(searchCriteria.endDate)) {
                        handleInputChange('endDate', '');
                      }
                    }}
                    min={getTodayDate()}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className={`w-full pl-10 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${!searchCriteria.startDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={searchCriteria.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    disabled={!searchCriteria.startDate}
                    min={searchCriteria.startDate ? (() => {
                      const startDate = new Date(searchCriteria.startDate);
                      const nextDay = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
                      const year = nextDay.getFullYear();
                      const month = String(nextDay.getMonth() + 1).padStart(2, '0');
                      const day = String(nextDay.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    })() : ''}
                  />
                </div>
                {!searchCriteria.startDate && (
                  <p className="text-xs text-gray-500 mt-1">Please select a start date first</p>
                )}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget per person (INR)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Min budget (₹)"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={searchCriteria.budget.min}
                    onChange={(e) => handleInputChange('budget.min', e.target.value)}
                    min="0"
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Max budget (₹)"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={searchCriteria.budget.max}
                    onChange={(e) => handleInputChange('budget.max', e.target.value)}
                    min={searchCriteria.budget.min || "0"}
                  />
                </div>
              </div>
            </div>

            {/* Travel Vibe Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Vibe
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {vibes.map((vibe) => {
                  const Icon = vibe.icon
                  return (
                    <button
                      key={vibe.id}
                      onClick={() => handleVibeSelect(vibe.id)}
                      className={`flex items-center justify-center space-x-2 p-4 rounded-xl border-2 transition-all font-medium ${
                        searchCriteria.vibe === vibe.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{vibe.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Include Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include in Search
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    checked={searchCriteria.includeTravel}
                    onChange={(e) => handleInputChange('includeTravel', e.target.checked)}
                  />
                  <span className="text-gray-700">Include travel/transportation</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    checked={searchCriteria.includeAccommodation}
                    onChange={(e) => handleInputChange('includeAccommodation', e.target.checked)}
                  />
                  <span className="text-gray-700">Include accommodation</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Clear all filters
              </button>
              
              <div className="flex space-x-4">
                <button 
                  onClick={handleSearch}
                  disabled={isSearching || !searchCriteria.destination.trim()}
                  className="bg-primary-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Search Trips</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage
