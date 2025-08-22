import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, CreditCard, Shield, Users, Calendar, 
  MapPin, CheckCircle, AlertCircle, Info 
} from 'lucide-react'
import { itineraries } from '../data/mockData'

const BookingPage = () => {
  const { id } = useParams()
  const trip = itineraries.find(t => t.id === parseInt(id))
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    travelers: 1,
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    paymentMethod: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    },
    billingAddress: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    agreeToTerms: false,
    agreeToRefund: false
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h2>
          <Link to="/explore" className="btn-primary">Back to Explore</Link>
        </div>
      </div>
    )
  }

  const depositAmount = Math.round(trip.price * 0.2)
  const remainingAmount = trip.price - depositAmount

  const handleInputChange = (section, field, value) => {
    setBookingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const processBooking = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setBookingConfirmed(true)
      setStep(4)
    }, 3000)
  }

  const steps = [
    { number: 1, title: 'Trip Details', completed: step > 1 },
    { number: 2, title: 'Travel Information', completed: step > 2 },
    { number: 3, title: 'Payment', completed: step > 3 },
    { number: 4, title: 'Confirmation', completed: bookingConfirmed }
  ]

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          
          <p className="text-gray-600 mb-6">
            Congratulations! You've successfully secured your spot on the {trip.title}. 
            You'll receive a confirmation email shortly with all the details.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-2">Booking Reference</div>
            <div className="text-lg font-bold text-gray-900">TM{Date.now().toString().slice(-6)}</div>
          </div>

          <div className="space-y-3">
            <Link to={`/trip/${trip.id}`} className="w-full btn-primary block text-center">
              View Trip Details
            </Link>
            <Link to="/inbox" className="w-full btn-secondary block text-center">
              Go to Messages
            </Link>
            <Link to="/profile" className="w-full text-primary-600 hover:text-primary-700 text-sm">
              View My Trips
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to={`/trip/${trip.id}`}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Your Trip</h1>
            <p className="text-gray-600">{trip.title} • {trip.destination}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav className="flex items-center justify-center space-x-8">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  stepItem.completed
                    ? 'border-green-500 bg-green-500 text-white'
                    : step === stepItem.number
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {stepItem.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepItem.number}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  stepItem.completed || step === stepItem.number
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}>
                  {stepItem.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-16 h-px bg-gray-300 ml-8" />
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Trip Details */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Summary</h2>
                
                <div className="flex items-start space-x-6 mb-8">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{trip.destination}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{trip.duration} • {new Date(trip.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{trip.groupSize} travelers maximum</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">What happens next?</h4>
                      <p className="text-blue-800 text-sm">
                        You'll pay a ₹{depositAmount} deposit now to secure your spot. The remaining 
                        ₹{remainingAmount} is due 30 days before departure.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-primary"
                  >
                    Continue to Travel Information
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Travel Information */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Travel Information</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Travelers
                    </label>
                    <select
                      value={bookingData.travelers}
                      onChange={(e) => setBookingData(prev => ({...prev, travelers: parseInt(e.target.value)}))}
                      className="input-field"
                    >
                      {[...Array(Math.min(trip.availableSlots, 4))].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'traveler' : 'travelers'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={bookingData.emergencyContact.name}
                          onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="input-field"
                          value={bookingData.emergencyContact.phone}
                          onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship
                        </label>
                        <select
                          className="input-field"
                          value={bookingData.emergencyContact.relationship}
                          onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
                        >
                          <option value="">Select relationship</option>
                          <option value="spouse">Spouse</option>
                          <option value="parent">Parent</option>
                          <option value="sibling">Sibling</option>
                          <option value="friend">Friend</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!bookingData.emergencyContact.name || !bookingData.emergencyContact.phone}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

                {isProcessing && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
                      <p className="text-gray-600">Please wait while we confirm your booking...</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={bookingData.paymentMethod.cardholderName}
                          onChange={(e) => handleInputChange('paymentMethod', 'cardholderName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="input-field pl-10"
                            value={bookingData.paymentMethod.cardNumber}
                            onChange={(e) => handleInputChange('paymentMethod', 'cardNumber', e.target.value)}
                          />
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="input-field"
                            value={bookingData.paymentMethod.expiryDate}
                            onChange={(e) => handleInputChange('paymentMethod', 'expiryDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="input-field"
                            value={bookingData.paymentMethod.cvv}
                            onChange={(e) => handleInputChange('paymentMethod', 'cvv', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Secure Payment</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={bookingData.agreeToTerms}
                        onChange={(e) => setBookingData(prev => ({...prev, agreeToTerms: e.target.checked}))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-700">
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="refund"
                        checked={bookingData.agreeToRefund}
                        onChange={(e) => setBookingData(prev => ({...prev, agreeToRefund: e.target.checked}))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="refund" className="ml-2 text-sm text-gray-700">
                        I understand the{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-700">
                          Cancellation Policy
                        </a>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={processBooking}
                    disabled={!bookingData.agreeToTerms || !bookingData.agreeToRefund || !bookingData.paymentMethod.cardNumber}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Pay ${depositAmount} Deposit</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip price</span>
                  <span className="font-medium">₹{trip.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travelers</span>
                  <span className="font-medium">{bookingData.travelers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{trip.price * bookingData.travelers}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Deposit due now</span>
                    <span className="text-primary-600">₹{depositAmount * bookingData.travelers}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Remaining ₹{remainingAmount * bookingData.travelers} due 30 days before departure
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Almost full!</h4>
                    <p className="text-yellow-700 text-sm">
                      Only {trip.availableSlots} spots remaining for this trip.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
