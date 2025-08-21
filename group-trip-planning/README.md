# TravelMate - AI-Powered Group Travel Platform

A React.js application designed for solo travelers to discover, create, and join group travel experiences with like-minded adventurers.

## Features

### 🏠 Homepage
- Hero section with destination search functionality
- Featured destinations with trip counts and pricing
- Featured trips with compatibility scores
- "How It Works" section explaining the platform

### 🔍 Explore Page
- Advanced search and filtering capabilities
- Travel vibes filter (Adventure, Eco-conscious, Culture, Wellness)
- Price range and group size filters
- Compatibility scores for each trip
- Detailed trip cards with organizer information

### 📝 Create Trip (AI-Powered)
- Multi-step itinerary creation process
- AI-powered trip generation based on preferences
- Travel style selection (Explorer, Cultural, Relaxed, Active, Luxury, Budget-Friendly)
- Interest-based customization
- Sustainability scoring
- Draft saving and publishing options

### 🧳 Trip Details
- Comprehensive trip information with tabs
- Day-by-day itinerary display
- Participant profiles and compatibility
- Reviews and ratings system
- Interactive booking flow

### 👤 Profile Management
- Personal profile with travel history
- Created trips management
- Joined trips tracking
- Reviews and ratings display
- Travel statistics

### 💬 Inbox & Communication
- Message system for trip communication
- Notifications for trip updates
- Group chat functionality
- Booking confirmations

### 💳 Booking Flow
- Multi-step booking process
- Deposit-based payment system
- Emergency contact collection
- Secure payment processing
- Booking confirmation

## Technology Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Date Handling**: React DatePicker

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd group-trip-planning
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.jsx      # Main navigation component
├── pages/              # Page components
│   ├── HomePage.jsx    # Landing page
│   ├── ExplorePage.jsx # Trip discovery and filtering
│   ├── CreatePage.jsx  # AI-powered trip creation
│   ├── TripDetailsPage.jsx # Detailed trip information
│   ├── ProfilePage.jsx # User profile management
│   ├── InboxPage.jsx   # Messages and notifications
│   └── BookingPage.jsx # Booking and payment flow
├── data/               # Mock data and utilities
│   └── mockData.js     # Sample data for demo
├── utils/              # Utility functions
└── context/            # React context providers
```

## Key Features Implemented

### 🤖 AI-Powered Itinerary Creation
- Smart itinerary generation based on user preferences
- Multiple travel styles and interest selections
- Sustainability scoring for eco-conscious travel
- Custom prompt handling for personalized experiences

### 🎯 Compatibility Matching
- Personalized compatibility scores for each trip
- Interest-based matching algorithm
- Travel style compatibility assessment

### 🌱 Sustainable Travel Focus
- Eco-conscious travel options highlighting
- Sustainability scoring system
- Local community support emphasis
- Responsible travel recommendations

### 👥 Social Features
- User profiles with travel history
- Group formation and management
- Review and rating system
- In-app messaging and notifications

### 💰 Flexible Payment System
- Deposit-based booking (20% upfront)
- Remaining balance due before departure
- Secure payment processing simulation
- Clear cancellation policies

## Design Highlights

- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Responsive Design**: Mobile-first approach for all devices
- **Visual Appeal**: High-quality imagery and consistent branding
- **User Experience**: Smooth navigation and clear call-to-actions
- **Accessibility**: Proper contrast ratios and semantic HTML

## Demo Data

The application includes comprehensive mock data featuring:
- 4 sample trips (Morocco, Japan, Patagonia, Bali)
- 3 user profiles with detailed information
- Sample reviews and ratings
- Featured destinations
- Realistic pricing and group sizes

## Future Enhancements

- Real AI integration for itinerary generation
- Payment gateway integration
- Real-time messaging system
- Advanced matching algorithms
- Mobile app development
- Social media integration
- Advanced analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.