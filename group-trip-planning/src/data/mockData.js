// Mock data for the travel planning application

export const users = [
  {
    id: 1,
    name: "Olivia Bennett",
    age: 29,
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Adventure seeker and culture enthusiast. Love exploring off-the-beaten-path destinations and meeting fellow travelers.",
    interests: ["Adventure", "Culture", "Photography", "Food"],
    travelStyle: "Explorer",
    rating: 4.8,
    tripCount: 12
  },
  {
    id: 2,
    name: "Marcus Chen",
    age: 32,
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Tech professional who loves sustainable travel and outdoor adventures.",
    interests: ["Sustainable Travel", "Hiking", "Tech", "Local Cuisine"],
    travelStyle: "Eco-conscious",
    rating: 4.9,
    tripCount: 8
  },
  {
    id: 3,
    name: "Sarah Williams",
    age: 27,
    location: "Portland, OR",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Yoga instructor and wellness enthusiast. Seeking mindful travel experiences.",
    interests: ["Wellness", "Yoga", "Nature", "Meditation"],
    travelStyle: "Wellness",
    rating: 4.7,
    tripCount: 15
  }
];

export const itineraries = [
  {
    id: 1,
    title: "Magical Morocco Adventure",
    destination: "Morocco",
    duration: "7 days",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    price: 1899,
    groupSize: 6,
    availableSlots: 2,
    compatibilityScore: 95,
    rating: 4.8,
    reviewCount: 24,
    createdBy: users[1],
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d04e2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    highlights: ["Atlas Mountains trekking", "Marrakech medina exploration", "Sahara desert camping"],
    tags: ["Adventure", "Culture", "Eco-conscious"],
    participants: [users[1], users[2]],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Marrakech",
        activities: ["Airport pickup", "Hotel check-in", "Welcome dinner at local restaurant"],
        meals: ["Dinner"],
        accommodation: "Riad Yasmine, Marrakech"
      },
      {
        day: 2,
        title: "Marrakech Exploration",
        activities: ["Medina walking tour", "Bahia Palace visit", "Jemaa el-Fnaa square"],
        meals: ["Breakfast", "Lunch", "Dinner"],
        accommodation: "Riad Yasmine, Marrakech"
      },
      {
        day: 3,
        title: "Atlas Mountains",
        activities: ["Drive to Atlas Mountains", "Berber village visit", "Mountain hiking"],
        meals: ["Breakfast", "Lunch", "Dinner"],
        accommodation: "Mountain Lodge, Imlil"
      }
    ],
    inclusions: ["Accommodation", "All meals", "Transportation", "Local guide"],
    exclusions: ["International flights", "Personal expenses", "Travel insurance"]
  },
  {
    id: 2,
    title: "Japanese Cultural Immersion",
    destination: "Japan",
    duration: "10 days",
    startDate: "2024-04-10",
    endDate: "2024-04-20",
    price: 2750,
    groupSize: 4,
    availableSlots: 1,
    compatibilityScore: 88,
    rating: 4.9,
    reviewCount: 31,
    createdBy: users[2],
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    highlights: ["Tokyo city exploration", "Mount Fuji visit", "Traditional ryokan stay"],
    tags: ["Culture", "Wellness", "Food"],
    participants: [users[2], users[0], users[1]],
    itinerary: [
      {
        day: 1,
        title: "Tokyo Arrival",
        activities: ["Airport arrival", "Hotel check-in", "Shibuya district tour"],
        meals: ["Dinner"],
        accommodation: "Park Hyatt Tokyo"
      }
    ],
    inclusions: ["Accommodation", "JR Pass", "Some meals", "Cultural experiences"],
    exclusions: ["International flights", "All meals", "Personal shopping"]
  },
  {
    id: 3,
    title: "Patagonia Wilderness Trek",
    destination: "Argentina & Chile",
    duration: "12 days",
    startDate: "2024-02-28",
    endDate: "2024-03-12",
    price: 3200,
    groupSize: 8,
    availableSlots: 3,
    compatibilityScore: 92,
    rating: 4.7,
    reviewCount: 18,
    createdBy: users[0],
    image: "https://images.unsplash.com/photo-1610296669228-602fa827264c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    highlights: ["Torres del Paine trekking", "Glacier exploration", "Wildlife photography"],
    tags: ["Adventure", "Nature", "Photography"],
    participants: [users[0], users[1], users[2]],
    itinerary: [],
    inclusions: ["Accommodation", "All meals", "Trekking gear", "Professional guide"],
    exclusions: ["International flights", "Personal gear", "Tips"]
  },
  {
    id: 4,
    title: "Bali Wellness Retreat",
    destination: "Bali, Indonesia",
    duration: "8 days",
    startDate: "2024-05-01",
    endDate: "2024-05-09",
    price: 1650,
    groupSize: 6,
    availableSlots: 4,
    compatibilityScore: 85,
    rating: 4.6,
    reviewCount: 42,
    createdBy: users[2],
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    highlights: ["Daily yoga sessions", "Spa treatments", "Rice terraces visit"],
    tags: ["Wellness", "Relaxation", "Nature"],
    participants: [users[2], users[0]],
    itinerary: [],
    inclusions: ["Boutique accommodation", "Yoga classes", "Healthy meals", "Spa treatments"],
    exclusions: ["International flights", "Alcohol", "Personal expenses"]
  }
];

export const featuredDestinations = [
  {
    id: 1,
    name: "Morocco",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d04e2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    tripCount: 12,
    avgPrice: 1899
  },
  {
    id: 2,
    name: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    tripCount: 8,
    avgPrice: 2750
  },
  {
    id: 3,
    name: "Patagonia",
    image: "https://images.unsplash.com/photo-1610296669228-602fa827264c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    tripCount: 6,
    avgPrice: 3200
  },
  {
    id: 4,
    name: "Bali",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    tripCount: 15,
    avgPrice: 1650
  }
];

export const reviews = [
  {
    id: 1,
    userId: 1,
    tripId: 1,
    rating: 5,
    comment: "Absolutely incredible experience! Marcus was an amazing trip organizer and the group dynamics were perfect.",
    date: "2024-01-15"
  },
  {
    id: 2,
    userId: 2,
    tripId: 2,
    rating: 5,
    comment: "Sarah created the most thoughtful itinerary. Every detail was perfect and I made lifelong friends.",
    date: "2024-01-20"
  }
];

export const currentUser = users[0];
