import { useState } from 'react'
import { MessageCircle, Bell, Users, Calendar, MapPin, Clock } from 'lucide-react'

const InboxPage = () => {
  const [activeTab, setActiveTab] = useState('messages')

  const messages = [
    {
      id: 1,
      from: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      subject: 'Morocco Trip - Packing suggestions',
      preview: 'Hey Olivia! Excited about our upcoming Morocco adventure. I wanted to share some packing tips...',
      time: '2 hours ago',
      unread: true,
      tripId: 1
    },
    {
      id: 2,
      from: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      subject: 'Thanks for the amazing Japan trip!',
      preview: 'Just wanted to thank you for organizing such an incredible cultural experience in Japan...',
      time: '1 day ago',
      unread: false,
      tripId: 2
    },
    {
      id: 3,
      from: 'TravelMate Team',
      avatar: '/api/placeholder/40/40',
      subject: 'New traveler interested in your Bali trip',
      preview: 'Good news! Alex M. has expressed interest in joining your Bali Wellness Retreat...',
      time: '3 days ago',
      unread: true,
      tripId: 4
    }
  ]

  const notifications = [
    {
      id: 1,
      type: 'trip_join',
      title: 'New traveler joined your trip',
      message: 'Sarah Williams joined your Morocco Adventure trip',
      time: '1 hour ago',
      unread: true,
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 2,
      type: 'trip_reminder',
      title: 'Trip departure reminder',
      message: 'Your Japan Cultural Immersion trip starts in 7 days',
      time: '6 hours ago',
      unread: true,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      type: 'review',
      title: 'New review received',
      message: 'Marcus Chen left you a 5-star review for the Patagonia trek',
      time: '2 days ago',
      unread: false,
      icon: MessageCircle,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 4,
      type: 'booking',
      title: 'Booking confirmed',
      message: 'Your payment for the Bali Wellness Retreat has been processed',
      time: '5 days ago',
      unread: false,
      icon: Bell,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  const tabs = [
    { id: 'messages', label: 'Messages', count: messages.filter(m => m.unread).length },
    { id: 'notifications', label: 'Notifications', count: notifications.filter(n => n.unread).length }
  ]

  const [selectedMessage, setSelectedMessage] = useState(null)

  const openMessage = (message) => {
    setSelectedMessage(message)
    // Mark as read
    message.unread = false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Inbox</h1>
          <p className="text-gray-600">Stay connected with your travel companions and trip updates</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages/Notifications List */}
          <div className="lg:col-span-2">
            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                </div>
                
                {messages.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => openMessage(message)}
                        className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                          message.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={message.avatar}
                            alt={message.from}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`text-sm font-medium ${
                                message.unread ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {message.from}
                              </h3>
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                            <h4 className={`text-sm mb-1 ${
                              message.unread ? 'font-semibold text-gray-900' : 'text-gray-800'
                            }`}>
                              {message.subject}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                            {message.unread && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-600">
                      Messages from your travel companions will appear here
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                </div>
                
                {notifications.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification) => {
                      const Icon = notification.icon
                      return (
                        <div
                          key={notification.id}
                          className={`p-6 ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className={`text-sm font-medium ${
                                  notification.unread ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                              <p className="text-sm text-gray-600">{notification.message}</p>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-600">
                      You'll receive updates about your trips and bookings here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message Detail or Quick Actions */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src={selectedMessage.avatar}
                    alt={selectedMessage.from}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedMessage.from}</h3>
                    <p className="text-sm text-gray-500">{selectedMessage.time}</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedMessage.subject}
                </h4>

                <div className="prose text-sm text-gray-700 mb-6">
                  <p>
                    Hey Olivia! I'm so excited about our upcoming Morocco adventure. 
                    I wanted to share some packing suggestions based on my previous trips to the region.
                  </p>
                  <p>
                    For the Atlas Mountains portion, I'd recommend bringing:
                    - Layered clothing for temperature variations
                    - Good hiking boots
                    - Sun protection (hat, sunglasses, sunscreen)
                    - A light rain jacket just in case
                  </p>
                  <p>
                    Looking forward to meeting everyone and exploring Morocco together!
                  </p>
                  <p>Best,<br />Marcus</p>
                </div>

                <div className="space-y-3">
                  <button className="w-full btn-primary">Reply</button>
                  <button className="w-full btn-secondary">View Trip Details</button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="h-5 w-5 text-primary-500" />
                      <span className="font-medium text-gray-900">Upcoming Trips</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Morocco Adventure starts in 2 weeks
                    </p>
                    <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                      View details →
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium text-gray-900">Pending Actions</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      2 trip requests awaiting response
                    </p>
                    <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                      Review requests →
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Users className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-900">Group Chat</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      3 active group conversations
                    </p>
                    <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                      Join conversations →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InboxPage
