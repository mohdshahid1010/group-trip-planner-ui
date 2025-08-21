import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Leaf, Camera, Heart, Coffee, Loader } from 'lucide-react'
import { searchItineraries } from '../services/api'

const ExplorePage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budgetRange, setBudgetRange] = useState('all')
  const [includeTravel, setIncludeTravel] = useState(true)
  const [includeAccommodation, setIncludeAccommodation] = useState(true)
  const [selectedVibes, setSelectedVibes] = useState([])
  const [groupSizeFilter, setGroupSizeFilter] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const vibes = [
    { id: 'adventure', label: 'Adventure', icon: Camera },
    { id: 'eco-conscious', label: 'Eco-conscious', icon: Leaf },
    { id: 'culture', label: 'Culture', icon: Coffee },
    { id: 'wellness', label: 'Wellness', icon: Heart },
  ]

  const toggleVibe = (vibeId) => {
    setSelectedVibes(prev => 
      prev.includes(vibeId) 
        ? prev.filter(id => id !== vibeId)
        : [...prev, vibeId]
    )
  }

  const handleSearch = async () => {
    // Clear previous errors
    setSearchError('')
    setIsSearching(true)

    try {
      // Prepare search data for API
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

      // Call the Java API
      const response = await searchItineraries(searchData)

      if (response.success) {
        // Navigate to search results page with the API response
        const searchParams = new URLSearchParams({
          ...(searchQuery && { destination: searchQuery }),
          ...(description && { description }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(budgetRange !== 'all' && { budget: budgetRange }),
          ...(groupSizeFilter !== 'all' && { groupSize: groupSizeFilter }),
          ...(selectedVibes.length > 0 && { vibes: selectedVibes.join(',') }),
          includeTravel: includeTravel.toString(),
          includeAccommodation: includeAccommodation.toString()
        })

        // Pass the search results via navigation state
        navigate(`/search-results?${searchParams.toString()}`, {
          state: { searchResults: response.data }
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
    setSelectedVibes([])
    setBudgetRange('all')
    setGroupSizeFilter('all')
    setSearchQuery('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setIncludeTravel(true)
    setIncludeAccommodation(true)
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
            {/* Detailed Description */}
            <div className="relative">
              <textarea
                placeholder="Write a detailed description of your ideal trip..."
                className="input-field min-h-[100px] resize-none text-base"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>
            
            {/* Date and Destination Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="input-field pl-10 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  placeholder="Start Date"
                  className="input-field pl-10 text-base"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  placeholder="End Date"
                  className="input-field pl-10 text-base"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Travel Vibes */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-gray-900">Travel Vibes</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {vibes.map((vibe) => {
                  const Icon = vibe.icon
                  return (
                    <button
                      key={vibe.id}
                      onClick={() => toggleVibe(vibe.id)}
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all font-medium ${
                        selectedVibes.includes(vibe.id)
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

            {/* Budget Range and Group Size Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Budget Range</h4>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="input-field w-full text-base"
                >
                  <option value="all">All budgets</option>
                  <option value="budget">Budget (Under ₹10,000)</option>
                  <option value="mid-range">Mid-range (₹10,001 - ₹30,000)</option>
                  <option value="luxury">Luxury (₹30,001 - ₹60,000)</option>
                  <option value="premium">Premium (₹60,001+)</option>
                </select>
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Group Size</h4>
                <select
                  value={groupSizeFilter}
                  onChange={(e) => setGroupSizeFilter(e.target.value)}
                  className="input-field w-full text-base"
                >
                  <option value="all">All sizes</option>
                  <option value="small">Small (1-6 people)</option>
                  <option value="medium">Medium (7-12 people)</option>
                  <option value="large">Large (13+ people)</option>
                </select>
              </div>
            </div>

            {/* Include Options and Action Buttons Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <h4 className="text-base font-semibold text-gray-900 mb-3">Include</h4>
                <div className="flex space-x-8">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTravel}
                      onChange={(e) => setIncludeTravel(e.target.checked)}
                      className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-base text-gray-700">Travel</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAccommodation}
                      onChange={(e) => setIncludeAccommodation(e.target.checked)}
                      className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-base text-gray-700">Accommodation</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={clearAllFilters}
                  className="btn-secondary text-base px-8 py-3"
                >
                  Clear All
                </button>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className={`flex items-center justify-center space-x-3 px-12 py-3 text-lg font-semibold rounded-lg transition-all ${
                    isSearching 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'btn-primary'
                  }`}
                >
                  {isSearching ? (
                    <>
                      <Loader className="h-6 w-6 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-6 w-6" />
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
