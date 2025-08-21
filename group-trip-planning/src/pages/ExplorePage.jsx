import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Star, Filter, Leaf, Camera, Heart, Coffee } from 'lucide-react'
import { itineraries } from '../data/mockData'

const ExplorePage = () => {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('destination') || '')
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '')
  const [filteredItineraries, setFilteredItineraries] = useState(itineraries)
  const [selectedVibes, setSelectedVibes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [groupSizeFilter, setGroupSizeFilter] = useState('all')

  const vibes = [
    { id: 'adventure', label: 'Adventure', icon: Camera },
    { id: 'eco-conscious', label: 'Eco-conscious', icon: Leaf },
    { id: 'culture', label: 'Culture', icon: Coffee },
    { id: 'wellness', label: 'Wellness', icon: Heart },
  ]

  useEffect(() => {
    let filtered = itineraries

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(trip => 
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by vibes/tags
    if (selectedVibes.length > 0) {
      filtered = filtered.filter(trip =>
        trip.tags.some(tag => 
          selectedVibes.some(vibe => 
            tag.toLowerCase().includes(vibe.toLowerCase())
          )
        )
      )
    }

    // Filter by price range
    filtered = filtered.filter(trip => 
      trip.price >= priceRange[0] && trip.price <= priceRange[1]
    )

    // Filter by group size
    if (groupSizeFilter !== 'all') {
      if (groupSizeFilter === 'small') {
        filtered = filtered.filter(trip => trip.groupSize <= 6)
      } else if (groupSizeFilter === 'medium') {
        filtered = filtered.filter(trip => trip.groupSize > 6 && trip.groupSize <= 12)
      } else if (groupSizeFilter === 'large') {
        filtered = filtered.filter(trip => trip.groupSize > 12)
      }
    }

    setFilteredItineraries(filtered)
  }, [searchQuery, selectedVibes, priceRange, groupSizeFilter])

  const toggleVibe = (vibeId) => {
    setSelectedVibes(prev => 
      prev.includes(vibeId) 
        ? prev.filter(id => id !== vibeId)
        : [...prev, vibeId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Trips
          </h1>
          <p className="text-xl text-gray-600">
            Find your perfect travel companions and unforgettable experiences
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                className="input-field pl-10"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <button className="btn-primary flex items-center justify-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Vibes Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Travel Vibes</h4>
                <div className="space-y-2">
                  {vibes.map((vibe) => {
                    const Icon = vibe.icon
                    return (
                      <button
                        key={vibe.id}
                        onClick={() => toggleVibe(vibe.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                          selectedVibes.includes(vibe.id)
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{vibe.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Group Size */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Group Size</h4>
                <select
                  value={groupSizeFilter}
                  onChange={(e) => setGroupSizeFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All sizes</option>
                  <option value="small">Small (1-6 people)</option>
                  <option value="medium">Medium (7-12 people)</option>
                  <option value="large">Large (13+ people)</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedVibes([])
                  setPriceRange([0, 5000])
                  setGroupSizeFilter('all')
                  setSearchQuery('')
                }}
                className="w-full btn-secondary text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredItineraries.length} trips found
              </p>
              <select className="input-field w-auto">
                <option>Sort by compatibility</option>
                <option>Sort by price (low to high)</option>
                <option>Sort by price (high to low)</option>
                <option>Sort by rating</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        ${trip.price}
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

            {filteredItineraries.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No trips found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Link to="/create" className="btn-primary">
                  Create Your Own Trip
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage
