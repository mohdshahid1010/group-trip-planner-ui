// Mock itineraries data matching the required structure
export const mockItineraries = [
    {
        id: 1,
        name: "Bali Cultural Adventure",
        matchingScore: 92,
        destination: "Bali, Indonesia",
        startDate: "2025-08-25",
        endDate: "2025-08-31",
        vibe: "CULTURAL",
        price: 52000, // Overall price for this itinerary
        days: [
          {
            id: 1,
            events: [
              {
                id: 1,
                traveling_detail: [
                  { type: "FLIGHT", amount: 45000.0 }
                ],
                event_details: {
                  text: "Arrival at Ngurah Rai International Airport",
                  description: "Welcome to Bali! Transfer to hotel in Ubud",
                  duration: 180
                },
                fare: [
                  { type: "travel", amount: 45000 },
                  { type: "event", amount: 2500 }
                ],
                mandatory: true // Airport transfer included in base price
              },
              {
                id: 2,
                traveling_detail: [
                  { type: "VEHICLE", amount: 1500.0 }
                ],
                event_details: {
                  text: "Ubud Traditional Market Tour",
                  description: "Explore local crafts, spices, and traditional Balinese items",
                  duration: 120
                },
                fare: [
                  { type: "travel", amount: 1500 },
                  { type: "event", amount: 3000 }
                ],
                mandatory: false // Optional market tour
              }
            ]
          },
          {
            id: 2,
            events: [
              {
                id: 3,
                event_details: {
                  text: "Traditional Balinese Blessing Ceremony",
                  description: "Participate in a spiritual cleansing ceremony at a local temple",
                  duration: 90
                },
                fare: [], // Free cultural experience
                mandatory: false
              },
              {
                id: 4,
                traveling_detail: [
                  { type: "VEHICLE", amount: 2000.0 }
                ],
                event_details: {
                  text: "Tegallalang Rice Terraces",
                  description: "Visit the stunning rice terraces and learn about traditional farming",
                  duration: 240
                },
                fare: [
                  { type: "travel", amount: 2000 },
                  { type: "event", amount: 1500 }
                ],
                mandatory: false // Optional sightseeing
              },
              {
                id: 5,
                traveling_detail: [],
                event_details: {
                  text: "Balinese Cooking Class",
                  description: "Learn to cook authentic Balinese dishes with local ingredients",
                  duration: 180
                },
                fare: [
                  { type: "event", amount: 4500 }
                ],
                mandatory: false // Optional cooking experience
              }
            ]
          }
        ]
      },
      {
        id: 2,
        name: "Goa Beach Paradise",
        matchingScore: 88,
        destination: "Goa, India",
        startDate: "2025-09-02",
        endDate: "2025-09-08",
        vibe: "BEACHES",
        price: 18300, // Overall price for this itinerary
        days: [
          {
            id: 3,
            events: [
              {
                id: 5,
                traveling_detail: [
                  { type: "FLIGHT", amount: 12000.0 }
                ],
                event_details: {
                  text: "Arrival in Goa",
                  description: "Fly to Goa and transfer to beachside resort",
                  duration: 120
                },
                fare: [
                  { type: "travel", amount: 12000 },
                  { type: "event", amount: 1000 }
                ],
                mandatory: true // Essential arrival transfer
              },
              {
                id: 6,
                event_details: {
                  text: "Beach Welcome & Safety Briefing",
                  description: "Complimentary orientation about local beaches and safety guidelines",
                  duration: 60
                },
                fare: [], // Free orientation
                mandatory: false
              }
            ]
          },
          {
            id: 4,
            events: [
              {
                id: 7,
                event_details: {
                  text: "Beachside Resort Stay",
                  description: "3-star oceanfront accommodation with breakfast included",
                  duration: 720
                },
                fare: [
                  { type: "accommodation", amount: 5000 }
                ],
                mandatory: true // Essential accommodation
              },
              {
                id: 8,
                event_details: {
                  text: "Morning Beach Yoga Session",
                  description: "Complimentary sunrise yoga class on the beach",
                  duration: 60
                },
                fare: [], // Free wellness activity
                mandatory: false
              },
              {
                id: 9,
                traveling_detail: [
                  { type: "VEHICLE", amount: 800.0 }
                ],
                event_details: {
                  text: "Dudhsagar Waterfall Trek",
                  description: "Adventure trek to India's second-highest waterfall",
                  duration: 420
                },
                fare: [
                  { type: "travel", amount: 800 },
                  { type: "event", amount: 3500 }
                ],
                mandatory: false // Optional adventure activity
              }
            ]
          }
        ]
      },
      {
        id: 4,
        name: "Kerala Wellness Retreat",
        matchingScore: 85,
        destination: "Kerala, India",
        startDate: "2025-09-10",
        endDate: "2025-09-17",
        vibe: "WELLNESS",
        price: 20700, // Overall price for this itinerary
        days: [
          {
            id: 7,
            events: [
              {
                id: 11,
                traveling_detail: [
                  { type: "FLIGHT", amount: 8500.0 }
                ],
                event_details: {
                  text: "Arrival in Kochi",
                  description: "Essential airport pickup and transfer to Ayurvedic resort",
                  duration: 150
                },
                fare: [
                  { type: "travel", amount: 8500 },
                  { type: "event", amount: 2000 }
                ],
                mandatory: true // Essential arrival service
              },
              {
                id: 12,
                event_details: {
                  text: "Welcome Tea Ceremony",
                  description: "Traditional Kerala welcome with herbal tea and coconut water",
                  duration: 30
                },
                fare: [], // Free welcome service
                mandatory: false
              }
            ]
          },
          {
            id: 8,
            events: [
              {
                id: 13,
                event_details: {
                  text: "Ayurvedic Spa Treatment Package",
                  description: "Full body massage and herbal treatments - core wellness service",
                  duration: 180
                },
                fare: [
                  { type: "treatment", amount: 5000 }
                ],
                mandatory: true // Essential wellness service
              },
              {
                id: 14,
                event_details: {
                  text: "Morning Yoga by the Backwaters",
                  description: "Complimentary sunrise yoga session in peaceful natural setting",
                  duration: 60
                },
                fare: [], // Free wellness activity
                mandatory: false
              },
              {
                id: 15,
                traveling_detail: [
                  { type: "VEHICLE", amount: 1200.0 }
                ],
                event_details: {
                  text: "Private Houseboat Cruise",
                  description: "Luxury houseboat journey through Kerala's famous backwaters",
                  duration: 360
                },
                fare: [
                  { type: "travel", amount: 1200 },
                  { type: "event", amount: 6000 }
                ],
                mandatory: false // Optional luxury experience
              }
            ]
          }
        ]
      },
      {
        id: 5,
        name: "Rajasthan Royal Heritage",
        matchingScore: 90,
        destination: "Rajasthan, India",
        startDate: "2025-09-20",
        endDate: "2025-09-28",
        vibe: "CULTURAL",
        price: 26500, // Overall price for this itinerary
        days: [
          {
            id: 9,
            events: [
              {
                id: 14,
                traveling_detail: [
                  { type: "FLIGHT", amount: 15000.0 }
                ],
                event_details: {
                  text: "Arrival in Jaipur",
                  description: "Essential airport pickup and heritage hotel check-in",
                  duration: 180
                },
                fare: [
                  { type: "travel", amount: 15000 },
                  { type: "accommodation", amount: 3000 }
                ],
                mandatory: true // Essential arrival and accommodation
              },
              {
                id: 15,
                event_details: {
                  text: "Rajasthani Welcome Ritual",
                  description: "Traditional welcome ceremony with local musicians and refreshments",
                  duration: 45
                },
                fare: [], // Free cultural welcome
                mandatory: false
              }
            ]
          },
          {
            id: 10,
            events: [
              {
                id: 16,
                event_details: {
                  text: "Heritage Hotel Stay Package",
                  description: "Luxury accommodation in converted palace with all meals",
                  duration: 1440
                },
                fare: [
                  { type: "accommodation", amount: 5000 },
                  { type: "meals", amount: 1500 }
                ],
                mandatory: true // Essential accommodation and meals
              },
              {
                id: 17,
                event_details: {
                  text: "Morning Temple Visit",
                  description: "Free visit to local historic temple with morning prayers",
                  duration: 60
                },
                fare: [], // Free spiritual experience
                mandatory: false
              },
              {
                id: 18,
                traveling_detail: [
                  { type: "VEHICLE", amount: 2500.0 }
                ],
                event_details: {
                  text: "Amber Fort with Elephant Ride",
                  description: "Premium fort visit with optional royal elephant experience",
                  duration: 240
                },
                fare: [
                  { type: "travel", amount: 2500 },
                  { type: "event", amount: 4000 }
                ],
                mandatory: false // Optional premium experience
              }
            ]
          }
        ]
      },
      {
        id: 6,
        name: "Kerala Backwaters & Wellness",
        matchingScore: 88,
        destination: "Kerala, India",
        startDate: "2025-10-05",
        endDate: "2025-10-10",
        vibe: "WELLNESS",
        price: 35000,
        days: [
          {
            id: 1,
            events: [
              {
                id: 101,
                event_details: {
                  text: "Arrival and Ayurvedic Welcome",
                  description: "Traditional welcome ceremony and initial health consultation",
                  duration: 120
                },
                fare: [], // Free event
                mandatory: false
              },
              {
                id: 102,
                event_details: {
                  text: "Premium Ayurvedic Spa Package",
                  description: "Full body massage and herbal treatments - included in base price",
                  duration: 240
                },
                fare: [
                  { type: "event", amount: 8000 }
                ],
                mandatory: true // Pre-selected, included in base price
              }
            ]
          },
          {
            id: 2,
            events: [
              {
                id: 103,
                event_details: {
                  text: "Houseboat Experience",
                  description: "Overnight stay in traditional Kerala houseboat",
                  duration: 1440
                },
                fare: [
                  { type: "accommodation", amount: 12000 }
                ],
                mandatory: true // Included in base price
              },
              {
                id: 104,
                event_details: {
                  text: "Cooking Class with Local Family",
                  description: "Learn traditional Kerala cuisine",
                  duration: 180
                },
                fare: [
                  { type: "event", amount: 3500 }
                ],
                mandatory: false // Optional paid event
              }
            ]
          }
        ]
      },
      {
        id: 7,
        name: "Rajasthan Desert Adventure",
        matchingScore: 94,
        destination: "Rajasthan, India", 
        startDate: "2025-10-15",
        endDate: "2025-10-21",
        vibe: "ADVENTURE",
        price: 42000,
        days: [
          {
            id: 1,
            events: [
              {
                id: 201,
                event_details: {
                  text: "Jaisalmer Fort Exploration",
                  description: "Free guided tour of the golden fort",
                  duration: 240
                },
                fare: [], // Free event
                mandatory: false
              },
              {
                id: 202,
                event_details: {
                  text: "Luxury Desert Camp Stay", 
                  description: "Premium tented accommodation with cultural performances",
                  duration: 720
                },
                fare: [
                  { type: "accommodation", amount: 15000 },
                  { type: "event", amount: 5000 }
                ],
                mandatory: true // Included in base price
              }
            ]
          },
          {
            id: 2,
            events: [
              {
                id: 203,
                event_details: {
                  text: "Camel Safari at Sunset",
                  description: "Traditional camel ride through sand dunes",
                  duration: 180
                },
                fare: [
                  { type: "event", amount: 2500 }
                ],
                mandatory: false // Optional
              },
              {
                id: 204,
                event_details: {
                  text: "Helicopter Desert Tour",
                  description: "Aerial view of the Thar Desert - premium experience",
                  duration: 90
                },
                fare: [
                  { type: "event", amount: 25000 }
                ],
                mandatory: false // Expensive optional event
              }
            ]
          }
        ]
      },
      {
        id: 8,
        name: "Goa Beach Paradise",
        matchingScore: 85,
        destination: "Goa, India",
                startDate: "2025-10-25",
        endDate: "2025-10-30",
        vibe: "BEACHES",
        price: 28000,
        days: [
          {
            id: 1,
            events: [
              {
                id: 301,
                event_details: {
                  text: "Beach Welcome & Orientation",
                  description: "Complimentary welcome drinks and beach safety briefing",
                  duration: 60
                },
                fare: [], // Free event
                mandatory: false
              },
              {
                id: 302,
                event_details: {
                  text: "Beach Resort Accommodation",
                  description: "5-star beachfront resort stay - 5 nights",
                  duration: 7200
                },
                fare: [
                  { type: "accommodation", amount: 20000 }
                ],
                mandatory: true // Main accommodation, included
              }
            ]
          },
          {
            id: 2,
            events: [
              {
                id: 303,
                event_details: {
                  text: "Water Sports Package",
                  description: "Jet skiing, parasailing, and banana boat rides",
                  duration: 240
                },
                fare: [
                  { type: "event", amount: 5500 }
                ],
                mandatory: false // Optional adventure activities
              },
              {
                id: 304,
                event_details: {
                  text: "Sunset Yacht Cruise",
                  description: "Private yacht with dinner and live music",
                  duration: 300
                },
                fare: [
                  { type: "event", amount: 8500 }
                ],
                mandatory: false // Premium optional event
              },
              {
                id: 305,
                event_details: {
                  text: "Local Market Walk",
                  description: "Free guided tour of Anjuna Flea Market",
                  duration: 120
                },
                fare: [], // Free event
                mandatory: false
              }
            ]
          }
        ]
      },
      {
        id: 10,
        name: "Rajasthan Desert Safari",
        matchingScore: 96,
        destination: "Jaipur, Rajasthan",
        startDate: "2025-11-05",
        endDate: "2025-11-12",
        vibe: "ADVENTURE",
        price: 32000,
        days: [
          {
            id: 1,
            events: [
              {
                id: 501,
                event_details: {
                  text: "Reykjavik Arrival & Orientation",
                  description: "Airport pickup and city orientation with Aurora briefing",
                  duration: 180
                },
                fare: [], // Free orientation
                mandatory: false
              },
              {
                id: 502,
                event_details: {
                  text: "Northern Lights Base Package",
                  description: "Essential gear, guide, and northern lights hunting tours",
                  duration: 7200
                },
                fare: [
                  { type: "guide", amount: 15000 },
                  { type: "equipment", amount: 5000 }
                ],
                mandatory: true // Essential for northern lights viewing
              }
            ]
          },
          {
            id: 2,
            events: [
              {
                id: 503,
                event_details: {
                  text: "Golden Circle Tour",
                  description: "Geysir, Gullfoss waterfall, and Thingvellir National Park",
                  duration: 480
                },
                fare: [
                  { type: "event", amount: 8000 }
                ],
                mandatory: false // Optional sightseeing
              },
              {
                id: 504,
                event_details: {
                  text: "Blue Lagoon Premium Experience",
                  description: "Luxury geothermal spa with premium package",
                  duration: 240
                },
                fare: [
                  { type: "event", amount: 12000 }
                ],
                mandatory: false // Luxury optional experience
              }
            ]
          }
        ]
      },
      {
        id: 11,
        name: "Morocco Desert & Mountains Adventure",
        matchingScore: 95,
        destination: "Morocco",
        startDate: "2025-11-15",
        endDate: "2025-11-22",
        vibe: "ADVENTURE",
        price: 25000,
        days: [
          {
            id: 1,
            events: [
              {
                id: 601,
                event_details: {
                  text: "Marrakech Welcome",
                  description: "Traditional welcome ceremony and medina orientation",
                  duration: 120
                },
                fare: [], // Free welcome
                mandatory: false
              },
              {
                id: 602,
                event_details: {
                  text: "Riad Accommodation Package",
                  description: "7 nights in traditional riad with all meals",
                  duration: 10080
                },
                fare: [
                  { type: "accommodation", amount: 18000 },
                  { type: "meals", amount: 5000 }
                ],
                mandatory: true // Essential accommodation
              }
            ]
          },
          {
            id: 2,
            events: [
              {
                id: 603,
                event_details: {
                  text: "Atlas Mountains Trek",
                  description: "Guided mountain trekking with Berber village visit",
                  duration: 720
                },
                fare: [
                  { type: "event", amount: 2500 }
                ],
                mandatory: false // Optional trek
              },
              {
                id: 604,
                event_details: {
                  text: "Sahara Desert Experience",
                  description: "Camel riding and desert camping under stars",
                  duration: 1440
                },
                fare: [
                  { type: "event", amount: 4000 }
                ],
                mandatory: false // Optional desert experience
              }
            ]
          }
        ]
      }
  ];
  
  // Helper function to calculate total price for an itinerary from event details
  // Note: Each itinerary now has a pre-defined price field for efficiency
  export const calculateItineraryPrice = (itinerary) => {
    let totalPrice = 0;
    
    itinerary.days.forEach(day => {
      day.events.forEach(event => {
        event.fare.forEach(fareItem => {
          totalPrice += fareItem.amount;
        });
      });
    });
    
    return totalPrice;
  };
  
  // Helper function to calculate destination relevance score
  const calculateDestinationScore = (itineraryDestination, searchDestination) => {
    if (!searchDestination) return 50; // Default score when no destination specified
    
    const searchTerm = searchDestination.toLowerCase().trim();
    const destination = itineraryDestination.toLowerCase();
    
    // Exact match gets highest score
    if (destination === searchTerm) return 100;
    
    // Check if search term is contained in destination (partial match)
    if (destination.includes(searchTerm)) return 90;
    
    // Check if destination is contained in search term (reverse partial match)
    if (searchTerm.includes(destination.split(',')[0].trim())) return 85;
    
    // State/region matching for Indian destinations
    const indianStateMatches = {
      'goa': ['goa'],
      'kerala': ['kerala', 'backwaters', 'kochi', 'cochin', 'munnar', 'alleppey'],
      'rajasthan': ['rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer'],
      'himachal': ['himachal', 'manali', 'shimla', 'dharamshala', 'kasol'],
      'maharashtra': ['mumbai', 'pune', 'lonavala', 'mahabaleshwar'],
      'karnataka': ['bangalore', 'mysore', 'coorg', 'gokarna'],
      'tamil nadu': ['chennai', 'ooty', 'kodaikanal', 'mahabalipuram']
    };
    
    // Check state-level matches
    for (const [state, keywords] of Object.entries(indianStateMatches)) {
      if (destination.includes(state) && keywords.some(keyword => searchTerm.includes(keyword))) {
        return 75;
      }
      if (keywords.some(keyword => destination.includes(keyword)) && searchTerm.includes(state)) {
        return 75;
      }
    }
    
    // Country-level matching
    const countryMatches = {
      'india': ['india', 'indian'],
      'indonesia': ['bali', 'indonesia', 'indonesian'],
      'iceland': ['iceland', 'icelandic'],
      'morocco': ['morocco', 'marrakech', 'casablanca']
    };
    
    for (const [country, keywords] of Object.entries(countryMatches)) {
      if (destination.includes(country) && keywords.some(keyword => searchTerm.includes(keyword))) {
        return 60;
      }
    }
    
    // Similar keywords matching
    const similarKeywords = {
      'beach': ['beach', 'coastal', 'sea', 'ocean', 'island'],
      'mountain': ['mountain', 'hill', 'trek', 'hiking', 'altitude'],
      'desert': ['desert', 'sand', 'dune', 'camel'],
      'cultural': ['heritage', 'temple', 'palace', 'fort', 'traditional'],
      'adventure': ['adventure', 'trek', 'expedition', 'outdoor']
    };
    
    for (const [category, keywords] of Object.entries(similarKeywords)) {
      if (keywords.some(keyword => destination.includes(keyword)) && 
          keywords.some(keyword => searchTerm.includes(keyword))) {
        return 40;
      }
    }
    
    // No meaningful match found
    return 10;
  };

  // Helper function to get itineraries by search criteria with generated relevance scores
  export const searchMockItineraries = (searchCriteria) => {
    console.log('🔍 SEARCHING ITINERARIES WITH CRITERIA:', searchCriteria);
    console.log('🔍 Filtering by: destination, date range, and price with relevance scoring');
    console.log('🔍 Criteria type check:', typeof searchCriteria, Array.isArray(searchCriteria));
    
    // Early return with all data if criteria is empty or malformed
    if (!searchCriteria || typeof searchCriteria !== 'object') {
      console.log('⚠️ Invalid search criteria, returning all itineraries');
      return [...mockItineraries];
    }
    
    let filteredItineraries = [...mockItineraries];
    
    console.log(`\n📋 Starting with ${filteredItineraries.length} itineraries:`);
    filteredItineraries.forEach(itinerary => {
      console.log(`  - ${itinerary.name}: ₹${itinerary.price.toLocaleString()} (${itinerary.destination}, ${itinerary.vibe})`);
    });
    
    // DEBUG: If no criteria provided, return all results (only checking destination, dates, and price)
    const hasFilters = searchCriteria.destination || searchCriteria.startDate || searchCriteria.endDate || (searchCriteria.budget && (searchCriteria.budget.min || searchCriteria.budget.max));
    
    if (!hasFilters) {
      console.log('🔄 No filters applied, returning all itineraries');
      return filteredItineraries.map(itinerary => ({
        ...itinerary,
        totalPrice: itinerary.price
      }));
    }
    
    // Filter by destination
    if (searchCriteria.destination) {
      const beforeCount = filteredItineraries.length;
      console.log(`\n🏠 DESTINATION FILTER DEBUG:`);
      console.log(`  Search term: "${searchCriteria.destination}"`);
      console.log(`  Available destinations:`);
      filteredItineraries.forEach(itinerary => {
        console.log(`    - "${itinerary.destination}"`);
      });
      
      filteredItineraries = filteredItineraries.filter(itinerary => {
        const match = itinerary.destination.toLowerCase().includes(searchCriteria.destination.toLowerCase());
        console.log(`    "${itinerary.destination}".includes("${searchCriteria.destination}") = ${match}`);
        return match;
      });
      console.log(`  Result: ${beforeCount} → ${filteredItineraries.length} itineraries`);
    }
    
    // Skip vibe filtering - focusing only on destination, date range, and price
    // Vibe is now used for display purposes only, not for filtering
    
    // Filter by date range (basic check if dates are provided)
    if (searchCriteria.startDate && searchCriteria.endDate) {
      const beforeCount = filteredItineraries.length;
      const searchStart = new Date(searchCriteria.startDate);
      const searchEnd = new Date(searchCriteria.endDate);
      
      filteredItineraries = filteredItineraries.filter(itinerary => {
        const itineraryStart = new Date(itinerary.startDate);
        const itineraryEnd = new Date(itinerary.endDate);
        
        // Check if there's any overlap or exact match
        return (searchStart <= itineraryEnd && searchEnd >= itineraryStart);
      });
      console.log(`\n📅 Date filter "${searchCriteria.startDate} to ${searchCriteria.endDate}": ${beforeCount} → ${filteredItineraries.length} itineraries`);
    }
    
    // Filter by budget
    if (searchCriteria.budget && (searchCriteria.budget.min || searchCriteria.budget.max)) {
      const beforeCount = filteredItineraries.length;
      const minBudget = searchCriteria.budget.min ? parseFloat(searchCriteria.budget.min) : 0;
      const maxBudget = searchCriteria.budget.max ? parseFloat(searchCriteria.budget.max) : Infinity;
      
      console.log(`\n💰 BUDGET FILTER: ₹${minBudget.toLocaleString()} - ₹${maxBudget === Infinity ? '∞' : maxBudget.toLocaleString()}`);
      
      filteredItineraries = filteredItineraries.filter(itinerary => {
        const price = itinerary.price; // Use the itinerary-level price
        const inRange = price >= minBudget && price <= maxBudget;
        
        console.log(`  ${itinerary.name}: ₹${price.toLocaleString()} - ${inRange ? '✅ INCLUDED' : '❌ EXCLUDED'}`);
        
        return inRange;
      });
      
      console.log(`Budget filter: ${beforeCount} → ${filteredItineraries.length} itineraries`);
    }
    
    // Generate relevance scores for all filtered results
    console.log(`\n🎯 GENERATING RELEVANCE SCORES:`);
    const scoredItineraries = filteredItineraries.map(itinerary => {
      const relevanceScore = calculateDestinationScore(itinerary.destination, searchCriteria.destination);
      console.log(`  📊 ${itinerary.name}: ${relevanceScore}% relevance (${itinerary.destination})`);
      
      return {
        ...itinerary,
        relevanceScore,
        totalPrice: itinerary.price // Use the itinerary-level price
      };
    });
    
    // Sort by relevance score in descending order (highest first)
    scoredItineraries.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`\n🎯 FINAL RESULTS: ${scoredItineraries.length} itineraries found (sorted by relevance):`);
    scoredItineraries.forEach((itinerary, index) => {
      console.log(`  ${index + 1}. ${itinerary.name}: ${itinerary.relevanceScore}% relevance | ₹${itinerary.price.toLocaleString()} (${itinerary.destination})`);
    });
    
    // 🎯 FALLBACK: If no results match criteria, show all itineraries with default scores
    if (scoredItineraries.length === 0) {
      console.log('\n🔄 NO MATCHES FOUND - Applying FALLBACK: Showing all available itineraries');
      const fallbackItineraries = mockItineraries.map(itinerary => {
        const relevanceScore = calculateDestinationScore(itinerary.destination, searchCriteria.destination);
        return {
          ...itinerary,
          relevanceScore,
          totalPrice: itinerary.price
        };
      });
      
      // Sort fallback results by relevance too
      fallbackItineraries.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      console.log(`🔄 FALLBACK RESULTS: Showing all ${fallbackItineraries.length} itineraries (sorted by relevance):`);
      fallbackItineraries.forEach((itinerary, index) => {
        console.log(`  ${index + 1}. ${itinerary.name}: ${itinerary.relevanceScore}% relevance | ₹${itinerary.price.toLocaleString()} (${itinerary.destination})`);
      });
      
      return fallbackItineraries;
    }
    
    // Return sorted itineraries with relevance scores
    return scoredItineraries;
  };
  
  // DEBUG: Simple function that always returns all itineraries for testing
  export const getAllMockItineraries = () => {
    console.log('🧪 DEBUG: getAllMockItineraries called');
    console.log('🧪 mockItineraries array:', mockItineraries);
    console.log('🧪 mockItineraries length:', mockItineraries.length);
    console.log('🧪 mockItineraries type:', typeof mockItineraries, Array.isArray(mockItineraries));
    
    if (!mockItineraries || !Array.isArray(mockItineraries)) {
      console.error('🚨 mockItineraries is not an array!', mockItineraries);
      return [];
    }
    
    const result = mockItineraries.map(itinerary => ({
      ...itinerary,
      totalPrice: itinerary.price
    }));
    
    console.log('🧪 Returning result:', result);
    console.log('🧪 Result length:', result.length);
    return result;
  };
  