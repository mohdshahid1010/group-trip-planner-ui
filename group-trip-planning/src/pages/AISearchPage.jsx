import { useState } from 'react'
import { Search, Loader, MapPin, Calendar, DollarSign, Sparkles, ArrowRight, Save, CheckCircle, BookOpen } from 'lucide-react'
import { parseSearchQuery, generateAIItineraryFromQuery } from '../services/api'
import { savePublishedItinerary } from '../utils/itineraryStorage'
import { useNavigate } from 'react-router-dom'

const AISearchPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [generatedItinerary, setGeneratedItinerary] = useState(null)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1) // 1: search, 2: processing, 3: results
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter your travel requirements')
      return
    }

    setIsProcessing(true)
    setError('')
    setCurrentStep(2)

    try {
      // Step 1: Parse natural language query into structured data
      console.log('🔍 Parsing query:', searchQuery)
      const parseResponse = await parseSearchQuery(searchQuery)
      
      if (!parseResponse.success) {
        throw new Error(parseResponse.error)
      }

      // Process extracted data and set default dates if missing
      const processedData = processExtractedData(parseResponse.data)
      setExtractedData(processedData)
      console.log('📊 Processed extracted data:', processedData)

      // Step 2: Generate itinerary using OpenAI
      console.log('🤖 Generating itinerary...')
      const itineraryResponse = await generateAIItineraryFromQuery(processedData)
      
      if (!itineraryResponse.success) {
        throw new Error(itineraryResponse.error)
      }

      setGeneratedItinerary(itineraryResponse.data)
      setCurrentStep(3)
      console.log('✅ Generated itinerary:', itineraryResponse.data)

    } catch (error) {
      console.error('Search error:', error)
      setError(error.message || 'Failed to generate itinerary. Please try again.')
      setCurrentStep(1)
    } finally {
      setIsProcessing(false)
    }
  }



  // Helper function to process extracted data and set default dates if missing
  const processExtractedData = (extractedData) => {
    const processedData = { ...extractedData }
    
    // Always ensure dates are future dates and properly formatted
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    // Check if dates are missing or invalid (past dates)
    const needsDateReset = !processedData.startDate || 
                          !processedData.endDate || 
                          new Date(processedData.startDate) < today ||
                          new Date(processedData.endDate) < today
    
    if (needsDateReset) {
      const startDate = tomorrow.toISOString().split('T')[0] // YYYY-MM-DD format
      
      const endDate = new Date(tomorrow)
      endDate.setDate(tomorrow.getDate() + 7) // +7 days from startDate
      const endDateStr = endDate.toISOString().split('T')[0]
      
      console.log('📅 Setting future dates (missing or past dates detected):')
      console.log(`  📅 Today: ${today.toISOString().split('T')[0]}`)
      console.log(`  📅 StartDate: ${startDate} (1 day later from today)`)
      console.log(`  📅 EndDate: ${endDateStr} (+7 days from startDate)`)
      console.log(`  📅 Total Duration: 8 days`)
      
      processedData.startDate = startDate
      processedData.endDate = endDateStr
    }
    
    return processedData
  }

  const resetSearch = () => {
    setSearchQuery('')
    setExtractedData(null)
    setGeneratedItinerary(null)
    setError('')
    setCurrentStep(1)
    setSaveSuccess(false)
  }

  // Transform AI-generated itinerary to storage format
  const transformAIItineraryForStorage = (aiItinerary, extractedData) => {
    // Calculate duration from dates
    const calculateDuration = () => {
      if (!aiItinerary.startDate || !aiItinerary.endDate) return `${aiItinerary.totalDays} days`;
      const start = new Date(aiItinerary.startDate);
      const end = new Date(aiItinerary.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return `${days} days`;
    };

    // Extract highlights from the itinerary days
    const extractHighlights = () => {
      const highlights = [];
      if (aiItinerary.days && aiItinerary.days.length > 0) {
        aiItinerary.days.forEach(day => {
          if (day.events && day.events.length > 0) {
            // Take the first activity of each day as a highlight
            highlights.push(day.events[0].title);
          }
        });
      }
      return highlights.slice(0, 5); // Limit to 5 highlights
    };

    // Map AI days to storage format
    const mappedDays = aiItinerary.days?.map(day => ({
      day: day.dayNumber,
      title: day.title,
      activities: day.events?.map(event => event.title) || [],
      highlights: day.events?.map(event => event.description).join(', ') || '',
      estimatedCost: day.events?.reduce((sum, event) => sum + (event.cost || 0), 0) || 0
    })) || [];

    const isJourneyPlanning = aiItinerary.source && aiItinerary.source !== null;
    
    return {
      id: Date.now(),
      title: isJourneyPlanning ? 
        `AI Generated Journey: ${aiItinerary.source} to ${aiItinerary.destination}` : 
        `AI Generated Trip to ${aiItinerary.destination}`,
      destination: aiItinerary.destination,
      duration: calculateDuration(),
      startDate: aiItinerary.startDate,
      endDate: aiItinerary.endDate,
      estimatedCost: aiItinerary.budget || extractedData.maxBudget,
      groupSize: "2-4", // Default group size
      description: isJourneyPlanning ?
        `An AI-generated ${aiItinerary.vibe?.toLowerCase() || 'adventure'} journey from ${aiItinerary.source} to ${aiItinerary.destination}, including complete travel planning and destination activities, perfectly tailored to your preferences and budget.` :
        `An AI-generated ${aiItinerary.vibe?.toLowerCase() || 'adventure'} itinerary for ${aiItinerary.destination}, perfectly tailored to your preferences and budget.`,
      days: mappedDays,
      highlights: extractHighlights(),
      tags: isJourneyPlanning ? 
        [aiItinerary.vibe, 'AI Generated', aiItinerary.source, aiItinerary.destination, 'Journey Planning'] :
        [aiItinerary.vibe, 'AI Generated', aiItinerary.destination],
      sustainabilityScore: Math.floor(Math.random() * 20) + 80, // Random score 80-100
      source: aiItinerary.source, // Store source for journey planning
      isJourneyPlanning: isJourneyPlanning,
      // New fields for hotel stays and lock-in penalty
      hotelStays: aiItinerary.hotelStays || [],
      lockInPenalty: aiItinerary.lockInPenalty || null,
      aiResponse: aiItinerary // Store original AI response
    };
  };

  // Save itinerary to My Trips
  const saveToMyTrips = async () => {
    if (!generatedItinerary || !extractedData) {
      setError('No itinerary to save. Please generate an itinerary first.');
      return;
    }

    setIsSaving(true);

    try {
      // Transform AI data to storage format
      const storageItinerary = transformAIItineraryForStorage(generatedItinerary, extractedData);
      
      // Mock form data for the save function
      const mockFormData = {
        interests: [extractedData.vibe],
        destination: extractedData.destination,
        source: extractedData.source,
        travelStyle: extractedData.vibe?.toLowerCase() || 'adventure',
        budget: extractedData.maxBudget,
        isJourneyPlanning: extractedData.source && extractedData.source !== null,
        itineraryName: storageItinerary.title
      };

      // Save the itinerary
      const savedItinerary = savePublishedItinerary(storageItinerary, mockFormData);
      
      if (savedItinerary) {
        setSaveSuccess(true);
        
        // Show success message for a brief moment before navigating
        setTimeout(() => {
          navigate('/mytrips');
        }, 2000);
      } else {
        throw new Error('Failed to save itinerary');
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
      setError('There was an error saving your itinerary. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to My Trips page
  const viewMyTrips = () => {
    navigate('/mytrips');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Itinerary Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us your travel dreams in natural language! Plan journeys from your city to any destination, or explore local activities. Whether you have specific budget, dates, and locations, or just want to explore what's possible - our AI will create the perfect itinerary with travel suggestions.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-3xl mx-auto">
            <p className="text-sm text-blue-800 font-semibold mb-2">🎯 Smart Date Planning:</p>
            <p className="text-sm text-blue-700">
              If no future dates are given, our AI automatically creates itineraries starting from <strong>tomorrow</strong> with a <strong>7-day duration</strong> for practical trip planning!
            </p>
          </div>
        </div>

        {/* Step 1: Search Input */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center mb-6">
                <Sparkles className="h-8 w-8 text-orange-500 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Describe Your Perfect Trip
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Example: 'Plan a trip from Mumbai to Goa with adventure activities' or 'I want to travel to Kerala focusing on cultural experiences' or 'Budget-friendly journey to Himachal' (AI will auto-schedule from tomorrow for 7 days if no dates given)..."
                    className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none text-lg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleSearch()
                      }
                    }}
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSearch}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-lg disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="h-6 w-6 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-6 w-6" />
                      <span>Generate My Itinerary</span>
                      <ArrowRight className="h-6 w-6" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Example queries */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Try these examples:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Plan a trip from Mumbai to Goa with 40k budget",
                  "I want to travel from Delhi to Kerala focusing on cultural experiences", 
                  "Adventure trip to Himachal with mountain activities",
                  "Budget-friendly journey to Rajasthan",
                  "Beach vacation to Goa with family",
                  "Cultural tour of Kerala backwaters"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(example)}
                    className="text-left p-4 bg-gray-50 hover:bg-orange-50 rounded-lg border border-gray-200 hover:border-orange-200 transition-colors"
                  >
                    <p className="text-sm text-gray-600">{example}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <Loader className="h-8 w-8 text-orange-500 animate-spin" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Creating Your Perfect Itinerary
                </h2>
                <p className="text-gray-600">
                  Our AI is analyzing your requirements and crafting a personalized travel plan...
                </p>
              </div>

              {extractedData && (
                                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">Extracted Information:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {extractedData.source && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-red-500 mr-2" />
                        <span><strong>From:</strong> {extractedData.source}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-orange-500 mr-2" />
                      <span><strong>{extractedData.source ? 'To:' : 'Destination:'}</strong> {extractedData.destination}</span>
                    </div>
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                      <span>{extractedData.vibe}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                      <span>
                        {extractedData.maxBudget === 0 ? 
                          'Budget-Free Planning' : 
                          `₹${extractedData.minBudget?.toLocaleString()} - ₹${extractedData.maxBudget?.toLocaleString()}`
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                      <span>{extractedData.startDate} to {extractedData.endDate}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && generatedItinerary && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              {/* Header */}
                                <div className="bg-gradient-to-r from-orange-500 to-blue-500 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Your {generatedItinerary.totalDays}-Day {generatedItinerary.source ? 
                        `${generatedItinerary.source} to ${generatedItinerary.destination}` : 
                        generatedItinerary.destination} Itinerary
                    </h2>
                    <p className="text-orange-100">
                      {generatedItinerary.budget === 0 ? 
                        'Budget-Friendly Planning' : 
                        `Total Budget: ₹${generatedItinerary.budget?.toLocaleString()}`
                      } | {generatedItinerary.totalDays} Days of Amazing Experiences
                      {generatedItinerary.source && ' | Complete Journey Planning'}
                      {generatedItinerary.lockInPenalty && generatedItinerary.lockInPenalty.amount && (
                        ` | Lock-in Penalty: ₹${generatedItinerary.lockInPenalty.amount.toLocaleString()} (${generatedItinerary.lockInPenalty.percentage}%)`
                      )}
                    </p>
                  </div>
                  <button
                    onClick={resetSearch}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    New Search
                  </button>
                </div>
              </div>

              {/* Itinerary Days */}
              <div className="p-6">
                <div className="space-y-8">
                  {generatedItinerary.days?.map((day, index) => (
                    <div key={index} className="border-l-4 border-orange-500 pl-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                            {day.dayNumber}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {day.title}
                            </h3>
                            <p className="text-gray-500">{day.date}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {day.events?.map((event, eventIndex) => (
                            <div key={eventIndex} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="flex items-center mb-1">
                                    <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded mr-3">
                                      {event.time}
                                    </span>
                                    <h4 className="font-semibold text-gray-800">
                                      {event.title}
                                    </h4>
                                  </div>
                                  <p className="text-gray-600 text-sm">
                                    {event.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-green-600">
                                    {event.cost === 0 || !event.cost ? 
                                      'Free' : 
                                      `₹${event.cost?.toLocaleString()}`
                                    }
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {event.duration}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">Day Total:</span>
                            <span className="text-xl font-bold text-green-600">
                              {(() => {
                                const dayTotal = day.events?.reduce((sum, event) => sum + (event.cost || 0), 0) || 0;
                                return dayTotal === 0 ? 'Budget-Friendly' : `₹${dayTotal.toLocaleString()}`;
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hotel Stays Section */}
                {generatedItinerary.hotelStays && generatedItinerary.hotelStays.length > 0 && (
                  <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-xl font-semibold mb-4 text-blue-800">🏨 Hotel Accommodations</h3>
                    <div className="space-y-4">
                      {generatedItinerary.hotelStays.map((hotel, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-blue-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">{hotel.name}</h4>
                              <p className="text-gray-600 text-sm">📍 {hotel.location}</p>
                              <p className="text-gray-600 text-sm">🛏️ {hotel.roomType}</p>
                              <p className="text-gray-600 text-sm">
                                📅 {hotel.checkIn} to {hotel.checkOut} ({hotel.totalNights} nights)
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-blue-600">
                                ₹{hotel.totalCost?.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                ₹{hotel.pricePerNight?.toLocaleString()}/night
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lock-in Penalty Section */}
                {generatedItinerary.lockInPenalty && (
                  <div className="mt-8 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-800">⚠️ Booking Terms</h3>
                    <div className="bg-white rounded-lg p-4 border border-yellow-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-800">Lock-in Penalty</h4>
                          <p className="text-gray-600 text-sm">{generatedItinerary.lockInPenalty.description}</p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Applied if you cancel after booking confirmation
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-yellow-600">
                            ₹{generatedItinerary.lockInPenalty.amount?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            ({generatedItinerary.lockInPenalty.percentage}% of total)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trip Summary */}
                <div className="mt-8 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Trip Summary</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {generatedItinerary.totalDays}
                      </div>
                      <div className="text-gray-600">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {(() => {
                          const activitiesCost = generatedItinerary.days?.reduce((sum, day) => 
                            sum + day.events?.reduce((daySum, event) => daySum + (event.cost || 0), 0), 0
                          ) || 0;
                          const hotelsCost = generatedItinerary.hotelStays?.reduce((sum, hotel) => 
                            sum + (hotel.totalCost || 0), 0
                          ) || 0;
                          const totalCost = activitiesCost + hotelsCost;
                          return totalCost === 0 ? 'Budget-Friendly' : `₹${totalCost.toLocaleString()}`;
                        })()}
                      </div>
                      <div className="text-gray-600">Total Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {generatedItinerary.hotelStays?.reduce((sum, hotel) => sum + (hotel.totalCost || 0), 0)?.toLocaleString() || '0'}
                      </div>
                      <div className="text-gray-600">Hotel Costs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {generatedItinerary.days?.reduce((sum, day) => sum + (day.events?.length || 0), 0)}
                      </div>
                      <div className="text-gray-600">Activities</div>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-green-800 mb-1">
                          Itinerary Published to My Trips Successfully!
                        </h3>
                        <p className="text-green-600">
                          Your {generatedItinerary.source ? 
                            `${generatedItinerary.source} to ${generatedItinerary.destination} journey plan` : 
                            `${generatedItinerary.destination} itinerary`} has been saved to My Trips. Redirecting you now...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Publishing Info Banner */}
                {!saveSuccess && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-6 w-6 text-blue-500 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          🎉 Ready to Publish Your {generatedItinerary.source ? 'Journey Plan' : 'Itinerary'}?
                        </h3>
                        <p className="text-blue-600 mb-3">
                          This AI-generated {generatedItinerary.source ? 
                            `journey from ${generatedItinerary.source} to ${generatedItinerary.destination}` : 
                            `${generatedItinerary.destination} itinerary`} can be published to your My Trips section where you can:
                        </p>
                        <ul className="text-sm text-blue-600 space-y-1 mb-3">
                          <li>• Access it anytime from your profile</li>
                          <li>• Share it with friends and fellow travelers</li>
                          <li>• Edit or modify the plan later</li>
                          <li>• Track your travel experiences</li>
                          {generatedItinerary.source && <li>• Get journey-specific travel tips</li>}
                        </ul>
                        <p className="text-sm text-blue-500 italic">
                          Click "Publish to My Trips" below to save this itinerary permanently!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center flex-wrap gap-4 mt-8">
                  {!saveSuccess && (
                    <button
                      onClick={saveToMyTrips}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:bg-orange-300 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="h-6 w-6 animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-6 w-6" />
                          <span>📚 Publish to My Trips</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={viewMyTrips}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>View My Trips</span>
                  </button>
                  
                  <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                    Share with Friends
                  </button>
                  
                  <button
                    onClick={resetSearch}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Create New Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AISearchPage
