import { useState } from 'react'
import { MapPin, Calendar, Users, Sparkles, Save, Share2, Eye } from 'lucide-react'
import { generateAIItinerary } from '../services/api'
import { savePublishedItinerary } from '../utils/itineraryStorage'

const CreatePage = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    itineraryName: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    groupSize: '',
    interests: [],
    travelStyle: '',
    customPrompt: '',
    accommodationType: '',
    activityLevel: ''
  })
  const [generatedItinerary, setGeneratedItinerary] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState(null)
  const [loadingStage, setLoadingStage] = useState('')
  const [loadingProgress, setLoadingProgress] = useState(0)

  const interests = [
    'Adventure', 'Culture', 'Food & Wine', 'Photography', 'Wellness', 
    'Nature', 'History', 'Art', 'Music', 'Local Markets', 'Beaches', 'Mountains'
  ]

  const travelStyles = [
    { id: 'explorer', name: 'Explorer', description: 'Off-the-beaten-path adventures' },
    { id: 'cultural', name: 'Cultural Immersion', description: 'Deep local experiences' },
    { id: 'relaxed', name: 'Relaxed', description: 'Comfortable pace with downtime' },
    { id: 'active', name: 'Active', description: 'High-energy activities and sports' },
    { id: 'luxury', name: 'Luxury', description: 'Premium experiences and comfort' },
    { id: 'budget', name: 'Budget-Friendly', description: 'Great value experiences' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  // Get today's date in local timezone (YYYY-MM-DD format)
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Map AI response to existing display format
  const mapAIResponseToItinerary = (aiResponse) => {
    const itinerary = aiResponse.itineraries[0]; // Take first itinerary
    
    // Convert AI events to existing day structure
    const mappedDays = itinerary.days.map(day => ({
      day: day.dayNumber,
      title: day.dayTitle,
      activities: day.events.map(event => event.details.text),
      highlights: day.events.map(event => event.details.description).join(', '),
      estimatedCost: day.events.reduce((sum, event) => sum + (event.amount || 0), 0)
    }));

    // Extract highlights from all events
    const allHighlights = itinerary.days.flatMap(day => 
      day.events.map(event => event.details.text)
    ).slice(0, 5); // Take first 5 as highlights

    return {
      id: itinerary.id,
      title: formData.itineraryName || `Amazing ${formData.destination} Adventure`,
      destination: formData.destination,
      duration: calculateDuration(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      estimatedCost: itinerary.priceSection?.amount || formData.budget,
      groupSize: formData.groupSize,
      description: `A carefully curated ${formData.travelStyle} journey through ${formData.destination}, featuring ${formData.interests.join(', ').toLowerCase()} experiences.`,
      days: mappedDays,
      highlights: allHighlights,
      tags: formData.interests,
      sustainabilityScore: Math.floor(Math.random() * 20) + 80, // Keep random for now
      aiResponse: itinerary // Store original AI response for reference
    };
  }

  const generateItinerary = async () => {
    setIsGenerating(true)
    setGenerationError(null)
    setLoadingProgress(0)
    setStep(3) // Move to step 3 immediately to show loader
    
    // Simulate progress stages
    const updateProgress = (stage, progress) => {
      setLoadingStage(stage)
      setLoadingProgress(progress)
    }
    
    try {
      updateProgress('Analyzing your preferences...', 20)
      
      // Small delay to show the first stage
      await new Promise(resolve => setTimeout(resolve, 800))
      
      updateProgress('Connecting to AI travel planner...', 40)
      
      // Call the AI API to generate itinerary
      const response = await generateAIItinerary(formData)
      
      updateProgress('Processing AI recommendations...', 70)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate itinerary')
      }
      
      updateProgress('Finalizing your perfect itinerary...', 90)
      
      // Map AI response to existing display format
      const mappedItinerary = mapAIResponseToItinerary(response.data)
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500))
      
      updateProgress('Complete!', 100)
      setGeneratedItinerary(mappedItinerary)
      
    } catch (error) {
      console.error('Itinerary generation failed:', error)
      setGenerationError(error.message)
      
      updateProgress('Creating sample itinerary...', 60)
      
      // Small delay for fallback
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Fallback to mock data for demonstration
      const fallbackItinerary = {
        id: Date.now(),
        title: formData.itineraryName || `Amazing ${formData.destination} Adventure`,
        destination: formData.destination,
        duration: calculateDuration(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        estimatedCost: formData.budget,
        groupSize: formData.groupSize,
        description: `A carefully curated ${formData.travelStyle} journey through ${formData.destination}, featuring ${formData.interests.join(', ').toLowerCase()} experiences.`,
        days: generateDailyItinerary(),
        highlights: generateHighlights(),
        tags: formData.interests,
        sustainabilityScore: Math.floor(Math.random() * 20) + 80,
        isFallback: true
      }
      
      updateProgress('Sample ready!', 100)
      setGeneratedItinerary(fallbackItinerary)
      
    } finally {
      // Small delay before hiding loader
      setTimeout(() => {
        setIsGenerating(false)
        setLoadingStage('')
        setLoadingProgress(0)
      }, 800)
    }
  }

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 'TBD'
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    return `${days} days`
  }

  const generateDailyItinerary = () => {
    const days = []
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

    for (let i = 1; i <= Math.min(totalDays, 7); i++) {
      days.push({
        day: i,
        title: `Day ${i} in ${formData.destination}`,
        activities: [
          `Explore local ${formData.interests[0]?.toLowerCase() || 'attractions'}`,
          `${formData.interests[1]?.toLowerCase() || 'Cultural'} experience`,
          'Local dining experience'
        ],
        highlights: `Perfect day for ${formData.travelStyle} travelers`,
        estimatedCost: Math.floor(parseInt(formData.budget) / totalDays) || 100
      })
    }
    return days
  }

  const generateHighlights = () => {
    return [
      `Authentic ${formData.destination} experiences`,
      `${formData.interests[0] || 'Cultural'} immersion`,
      'Small group connections',
      'Sustainable travel practices',
      'Local community support'
    ]
  }

  const publishItinerary = () => {
    if (!generatedItinerary) {
      alert('No itinerary to publish. Please generate an itinerary first.');
      return;
    }

    try {
      // Save the itinerary to localStorage
      const savedItinerary = savePublishedItinerary(generatedItinerary, formData);
      
      if (savedItinerary) {
        // Show success message with more details
        const message = generatedItinerary.isFallback 
          ? 'Your sample itinerary has been published! You can now see it in your Profile under "My Trips".'
          : 'Your AI-generated itinerary has been published! Other travelers can now discover and join your trip. Check your Profile to see it.';
        
        alert(message);
        
        // Navigate to profile page
        window.location.href = '/profile';
      } else {
        throw new Error('Failed to save itinerary');
      }
    } catch (error) {
      console.error('Error publishing itinerary:', error);
      alert('There was an error publishing your itinerary. Please try again.');
    }
  }

  const saveDraft = () => {
    // Save as draft functionality
    alert('Itinerary saved as draft. You can continue editing later.')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Create Your Trip</h1>
            <span className="text-sm text-gray-500">Step {step} of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Basics</h2>
              <p className="text-gray-600">Tell us about your dream destination and travel dates</p>
              <p className="text-sm text-gray-500 mt-2">
                <span className="text-red-500">*</span> Required fields
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Itinerary Name
              </label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Give your trip a memorable name..."
                  className="input-field pl-10 w-full"
                  value={formData.itineraryName}
                  onChange={(e) => handleInputChange('itineraryName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="input-field"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget per person (INR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="50000"
                    className="input-field"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className="input-field"
                    value={formData.startDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const today = getTodayDate();
                      
                      // Prevent selecting past dates
                      if (selectedDate && selectedDate < today) {
                        alert('Start date cannot be in the past. Please select today or a future date.');
                        return;
                      }
                      
                      handleInputChange('startDate', selectedDate);
                      // Clear end date if it's before the new start date
                      if (formData.endDate && selectedDate && new Date(selectedDate) >= new Date(formData.endDate)) {
                        handleInputChange('endDate', '');
                      }
                    }}
                    min={getTodayDate()} // Today's date in local timezone
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className={`input-field pl-10 ${!formData.startDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={formData.endDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      
                      // Prevent selecting end date before or same as start date
                      if (selectedDate && formData.startDate && selectedDate <= formData.startDate) {
                        alert('End date must be after the start date.');
                        return;
                      }
                      
                      handleInputChange('endDate', selectedDate);
                    }}
                    disabled={!formData.startDate}
                    min={formData.startDate ? (() => {
                      const startDate = new Date(formData.startDate);
                      const nextDay = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
                      const year = nextDay.getFullYear();
                      const month = String(nextDay.getMonth() + 1).padStart(2, '0');
                      const day = String(nextDay.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    })() : ''} // Day after start date
                    required
                  />
                </div>
                {!formData.startDate && (
                  <p className="text-xs text-gray-500 mt-1">Please select a start date first</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Size <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    className="input-field"
                    value={formData.groupSize}
                    onChange={(e) => handleInputChange('groupSize', e.target.value)}
                    required
                  >
                    <option value="">Select group size</option>
                    <option value="2-4">Small (2-4 people)</option>
                    <option value="5-8">Medium (5-8 people)</option>
                    <option value="9-12">Large (9-12 people)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.destination || !formData.startDate || !formData.endDate || !formData.budget || !formData.groupSize}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Preferences
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Preferences</h2>
              <p className="text-gray-600">Help our AI create the perfect itinerary for you</p>
            </div>

            {/* Travel Style */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {travelStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleInputChange('travelStyle', style.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.travelStyle === style.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{style.name}</h4>
                    <p className="text-sm text-gray-600">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Interests (select all that apply)
              </h3>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      formData.interests.includes(interest)
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Details (Optional)
              </h3>
              <textarea
                rows="4"
                placeholder="Describe any specific experiences, requirements, or preferences you have for this trip..."
                className="w-full input-field resize-none"
                value={formData.customPrompt}
                onChange={(e) => handleInputChange('customPrompt', e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={generateItinerary}
                disabled={!formData.travelStyle || formData.interests.length === 0 || isGenerating}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generated Itinerary */}
        {step === 3 && (
          <>
            {isGenerating ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                {/* Main Spinner */}
                <div className="relative mb-8">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-primary-500 mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary-500 animate-pulse" />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Creating Your Perfect Itinerary
                </h3>
                
                {/* Dynamic Status */}
                <div className="mb-6">
                  <p className="text-gray-600 text-lg mb-2">
                    Our AI is crafting personalized recommendations for your {formData.destination} adventure
                  </p>
                  {loadingStage && (
                    <p className="text-primary-600 font-medium animate-pulse">
                      {loadingStage}
                    </p>
                  )}
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="max-w-sm mx-auto mb-6">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Starting</span>
                    <span className="font-medium">{loadingProgress}%</span>
                    <span>Complete</span>
                  </div>
                </div>
                
                {/* Features being processed */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-primary-500" />
                    <span>{formData.destination}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-4 w-4 text-primary-500" />
                    <span>{formData.groupSize} people</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary-500" />
                    <span>{calculateDuration()}</span>
                  </div>
                </div>
                
                {/* Travel Style & Interests */}
                {formData.travelStyle && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="mb-2">
                      <strong className="text-primary-600">{formData.travelStyle}</strong> style journey
                    </p>
                    <div className="flex justify-center flex-wrap gap-2">
                      {formData.interests.slice(0, 4).map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : generatedItinerary && (
              <div className="space-y-6">
                {/* Error Alert */}
                {generationError && generatedItinerary?.isFallback && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-100 rounded-full p-2">
                        <Sparkles className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-800 mb-1">
                          AI Generation Issue
                        </h3>
                        <p className="text-yellow-700 text-sm mb-3">
                          We encountered an issue with the AI service: {generationError}
                        </p>
                        <p className="text-yellow-700 text-sm mb-4">
                          We've created a sample itinerary for you instead. You can try generating again or continue with this template.
                        </p>
                        <button
                          onClick={() => generateItinerary()}
                          className="btn-secondary text-sm"
                          disabled={isGenerating}
                        >
                          Try AI Generation Again
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {generatedItinerary.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {generatedItinerary.destination}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {generatedItinerary.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Up to {generatedItinerary.groupSize} people
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        ₹{generatedItinerary.estimatedCost}
                      </div>
                      <p className="text-sm text-gray-600">estimated per person</p>
                    </div>
                  </div>

                  {/* AI Success or Sustainability indicator */}
                  <div className={`border rounded-lg p-4 mb-6 ${generatedItinerary?.isFallback ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center space-x-2">
                      <div className={`rounded-full p-1 ${generatedItinerary?.isFallback ? 'bg-blue-500' : 'bg-green-500'}`}>
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span className={`font-medium ${generatedItinerary?.isFallback ? 'text-blue-800' : 'text-green-800'}`}>
                        {generatedItinerary?.isFallback 
                          ? 'Sample Itinerary Generated' 
                          : `AI-Powered Itinerary • ${generatedItinerary.sustainabilityScore}% Sustainability Score`
                        }
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${generatedItinerary?.isFallback ? 'text-blue-700' : 'text-green-700'}`}>
                      {generatedItinerary?.isFallback 
                        ? 'This is a template itinerary. Try AI generation for personalized recommendations.'
                        : 'This itinerary was crafted by AI and prioritizes sustainable travel practices'
                      }
                    </p>
                  </div>

                  <p className="text-gray-700 mb-6">{generatedItinerary.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {generatedItinerary.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Itinerary Details */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Itinerary</h3>
                  <div className="space-y-6">
                    {generatedItinerary.days.map((day) => (
                      <div key={day.day} className="border-l-4 border-primary-500 pl-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {day.title}
                        </h4>
                        <p className="text-gray-600 mb-3">{day.highlights}</p>
                        <ul className="space-y-1 mb-3">
                          {day.activities.map((activity, index) => (
                            <li key={index} className="text-gray-700 text-sm">
                              • {activity}
                            </li>
                          ))}
                        </ul>
                        <div className="text-sm text-gray-500">
                          Estimated cost: ₹{day.estimatedCost} per person
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Highlights</h3>
                  <ul className="space-y-2">
                    {generatedItinerary.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Sparkles className="h-5 w-5 text-primary-500 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={saveDraft}
                      className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Save className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-700">Save as Draft</span>
                    </button>

                    <button
                      onClick={() => alert('Preview functionality would show how your trip appears to others')}
                      className="flex items-center justify-center space-x-2 p-4 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <Eye className="h-5 w-5 text-primary-600" />
                      <span className="font-medium text-primary-700">Preview</span>
                    </button>

                    <button
                      onClick={publishItinerary}
                      className="flex items-center justify-center space-x-2 p-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="font-medium">Publish Trip</span>
                    </button>
                  </div>

                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Ready to share?</strong> Once published, other solo travelers can discover 
                      and join your trip. You can always edit details later.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CreatePage
