import { useState } from 'react'
import { MapPin, Calendar, DollarSign, Users, Sparkles, Save, Share2, Eye } from 'lucide-react'

const CreatePage = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
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

  const generateItinerary = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation (in real app, this would call an AI service)
    setTimeout(() => {
      const mockItinerary = {
        id: Date.now(),
        title: `Amazing ${formData.destination} Adventure`,
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
        sustainabilityScore: Math.floor(Math.random() * 20) + 80
      }
      
      setGeneratedItinerary(mockItinerary)
      setIsGenerating(false)
      setStep(3)
    }, 3000)
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
    // In real app, this would save to database and make public
    alert('Your itinerary has been published! Other travelers can now discover and join your trip.')
    window.location.href = '/profile'
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="input-field pl-10"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget per person (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="2000"
                    className="input-field pl-10"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className="input-field pl-10"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
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
                    className="input-field pl-10"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Size
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    className="input-field pl-10"
                    value={formData.groupSize}
                    onChange={(e) => handleInputChange('groupSize', e.target.value)}
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
                disabled={!formData.destination || !formData.startDate || !formData.endDate}
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
                disabled={!formData.travelStyle || formData.interests.length === 0}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-5 w-5" />
                <span>Generate Itinerary</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generated Itinerary */}
        {step === 3 && (
          <>
            {isGenerating ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Creating Your Perfect Itinerary
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI is crafting personalized recommendations based on your preferences...
                </p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            ) : generatedItinerary && (
              <div className="space-y-6">
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
                        ${generatedItinerary.estimatedCost}
                      </div>
                      <p className="text-sm text-gray-600">estimated per person</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-500 rounded-full p-1">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-green-800">
                        {generatedItinerary.sustainabilityScore}% Sustainability Score
                      </span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      This itinerary prioritizes eco-friendly accommodations and local community support
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
                          Estimated cost: ${day.estimatedCost} per person
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
