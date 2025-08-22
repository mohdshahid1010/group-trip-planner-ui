// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.DEV ? '' : 'http://localhost:8080'
);

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Helper method to make API calls
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  }

  // Search itineraries endpoint with enhanced criteria
  async searchItineraries(searchCriteria) {
    // For now, use mock data - in production this would call the real API
    const { searchMockItineraries } = await import('../data/mockSearchResults.js');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Filter mock results based on search criteria
      const filteredResults = searchMockItineraries(searchCriteria);
      
      // Transform to match expected API response format with generated relevance score
      const transformedResults = filteredResults.map(result => ({
        id: result.id,
        itinerary: result.name,
        description: `Experience ${result.destination} with ${result.vibe.toLowerCase()} activities`,
        relevanceScore: result.relevanceScore || 50, // Use generated score or default
        price: result.price,
        priceDetails: {
          totalPrice: result.price,
          pricePerDay: Math.round(result.price / result.days.length),
          description: `${result.vibe.toLowerCase()} tour package with accommodation and activities`,
          includes: ["Accommodation", "Activities", "Local transport"],
          excludes: ["International flights", "Personal expenses"]
        },
        start: result.startDate,
        end: result.endDate,
        source: searchCriteria.source || 'Various',
        destination: result.destination,
        vibe: result.vibe,
        currency: "INR",
        totalDays: result.days.length,
        image: this.getImageForDestination(result.destination),
        days: result.days
      }));
      
      return {
        success: true,
        data: transformedResults
      };
    } catch (error) {
      console.error('Mock search error:', error);
      return {
        success: false,
        error: 'Failed to search itineraries. Please try again.'
      };
    }
  }

  // Helper method to get default images for destinations
  getImageForDestination(destination) {
    const imageMap = {
      'Bali': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'Himachal': 'https://images.unsplash.com/photo-1545048702-79362596cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'Kerala': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'Rajasthan': 'https://images.unsplash.com/photo-1545048702-79362596cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    };
    
    const key = Object.keys(imageMap).find(k => destination.includes(k));
    return key ? imageMap[key] : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
  }

  // Get itinerary by ID
  async getItineraryById(id) {
    return this.makeRequest(`/v1/itinerary/${id}`, {
      method: 'GET',
    });
  }

  // Create new itinerary
  async createItinerary(itineraryData) {
    return this.makeRequest('/v1/itinerary', {
      method: 'POST',
      body: JSON.stringify(itineraryData),
    });
  }

  // Parse natural language query into structured data using OpenAI
  async parseSearchQuery(naturalLanguageQuery) {
    const requestBody = {
      messages: [
        {
          role: "system",
          content: `You are a travel query parser for itinerary planning ONLY. Extract structured data from natural language travel queries. CRITICAL: Return ONLY valid JSON. No markdown, no backticks, no formatting.

IMPORTANT RESTRICTIONS:
- ONLY respond to itinerary planning queries. If the query is not about travel/itinerary planning, return an error.
- ONLY suggest real locations that exist on Earth within legitimate countries
- NEVER suggest unrealistic, suspicious, dangerous, suicide locations, or terror-affected areas
- Do NOT schedule itineraries beyond 6 months from current date
- CRITICAL: ALWAYS ensure dates are in the FUTURE - never schedule for past dates

The output must be a JSON object with this exact structure:
{
  "source": "string (starting location, null if not mentioned)",
  "destination": "string (destination name)",
  "vibe": "string (one of: ADVENTURE, BEACHES, CULTURAL, WELLNESS, NATURE, LUXURY)",
  "minBudget": number (minimum budget in INR),
  "maxBudget": number (maximum budget in INR),
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}

Rules:
- If no budget mentioned, use 0 for both minBudget and maxBudget (budget-free planning)
- CRITICAL: If no future dates are given, start from TOMORROW (1 day from current date) with 7 days duration
- MANDATORY: All dates must be FUTURE dates only - never in the past - NEVER use dates from 2023 or any past year
- IMPORTANT: When no specific dates provided, always use tomorrow + 7 days for practical trip planning
- CRITICAL: Current year is 2025, always use 2025 or later dates
- If no destination mentioned, pick the best destination from top Indian cities: Delhi, Mumbai, Pune, Bangalore, Chennai, Kolkata, Hyderabad, Goa, Kerala, Rajasthan
- If source location is mentioned, extract it; otherwise set source as null
- If both source and destination are mentioned, the itinerary should include travel suggestions between them
- If no duration mentioned, assume 3 days
- If no vibe mentioned, infer from activities mentioned or use CULTURAL as default
- Always use proper date format YYYY-MM-DD
- Ensure dates are within 6 months from today and always in the future
- Return only the JSON object, no other text`
        },
        {
          role: "user", 
          content: naturalLanguageQuery
        }
      ],
      max_tokens: 500,
      temperature: 0.1,  // Very low temperature for consistent parsing
      top_p: 0.9,
      model: "gpt-4o"
    };

    const openAIEndpoint = import.meta.env.VITE_OPENAI_AZURE_ENDPOINT;
    const openAIApiKey = import.meta.env.VITE_OPENAI_AZURE_API_KEY;

    if (!openAIEndpoint || !openAIApiKey) {
      throw new Error('OpenAI Azure configuration missing. Please check your environment variables.');
    }

    try {
      const response = await fetch(openAIEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content;
      
      if (!aiContent) {
        throw new Error('No content received from AI service');
      }

      // Clean and parse the JSON response
      let cleanedContent = aiContent.trim();
      
      // Remove any markdown formatting if present
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '');
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.replace(/\s*```$/, '');
      }
      if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '');
      }

      const parsedData = JSON.parse(cleanedContent);
      
      // Check if this is a travel-related query
      if (!parsedData.destination || parsedData.destination.toLowerCase().includes('error')) {
        throw new Error('This appears to be a non-travel related query. Please ask about itinerary planning, destinations, or travel activities.');
      }

      // Validate required fields (source is optional)
      const requiredFields = ['destination', 'vibe', 'minBudget', 'maxBudget', 'startDate', 'endDate'];
      for (const field of requiredFields) {
        if (parsedData[field] === undefined || parsedData[field] === null) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Ensure source field exists (can be null)
      if (!parsedData.hasOwnProperty('source')) {
        parsedData.source = null;
      }

      // Validate dates are within 6 months
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 6);
      const startDate = new Date(parsedData.startDate);
      
      if (startDate > maxDate) {
        throw new Error('Cannot schedule itineraries beyond 6 months from today. Please choose earlier dates.');
      }

      return {
        success: true,
        data: parsedData
      };

    } catch (error) {
      console.error('Query parsing error:', error);
      
      if (error instanceof SyntaxError) {
        return {
          success: false,
          error: `AI returned invalid JSON format: ${error.message}`
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to parse search query'
      };
    }
  }

  // Enhanced AI itinerary generation for natural language flow
  async generateAIItineraryFromQuery(extractedData) {
    const duration = this.calculateDays(extractedData.startDate, extractedData.endDate);
    
    const content = `You are an expert travel planner for itinerary planning ONLY. Create a detailed, realistic travel itinerary based on the extracted user preferences.

IMPORTANT RESTRICTIONS:
- ONLY create itineraries for real locations that exist on Earth within legitimate countries
- NEVER suggest unrealistic, suspicious, dangerous, suicide locations, or terror-affected areas
- Do NOT schedule itineraries beyond 6 months from current date
- If budget is 0 or not specified, focus on free/low-cost activities and avoid mentioning specific budget amounts
- ONLY respond to travel/itinerary planning requests
- CRITICAL: ALWAYS show itinerary plans for FUTURE DATES only - never past dates
- CRITICAL: Always take future dates from current date if no start or end date is provided, also if no dates are given take next week dates

CRITICAL: Return ONLY valid JSON. Do not use markdown code blocks, backticks, or any formatting. Start directly with { and end with }.

**Schema**: The output must be a JSON object with this exact structure:
{
  "source": ${extractedData.source ? `"${extractedData.source}"` : 'null'},
  "destination": "${extractedData.destination}",
  "totalDays": ${duration},
  "budget": ${extractedData.maxBudget},
  "lockInPenalty": {
    "percentage": 10,
    "amount": number,
    "description": "Lock-in penalty (10% of total cost)"
  },
  "vibe": "${extractedData.vibe}",
  "startDate": "${extractedData.startDate}",
  "endDate": "${extractedData.endDate}",
  "hotelStays": [
    {
      "name": "Hotel Name",
      "location": "Area/District",
      "checkIn": "YYYY-MM-DD",
      "checkOut": "YYYY-MM-DD", 
      "roomType": "Room type",
      "pricePerNight": number,
      "totalNights": number,
      "totalCost": number
    }
  ],
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "title": "Day 1 - Title",
      "events": [
        {
          "time": "09:00 AM",
          "title": "Activity Title",
          "description": "Activity description",
          "duration": "2 hours",
          "cost": 2000,
          "category": "activity|transport|meal|hotel"
        }
      ]
    }
  ]
}

**MANDATORY REQUIREMENTS:**
- Create ${duration} days of detailed itinerary for ${extractedData.destination} (must be a real location)
- CRITICAL: If no future dates were provided by user, this itinerary starts from TOMORROW (1 day from current date) for 7 days duration
- CRITICAL: NEVER use past dates or dates from 2023 - always use 2025 or later dates
- CRITICAL: Always include detailed hotel pricing in the "hotelStays" array with specific prices for each night
- CRITICAL: Lock-in penalty amount (10%) can NEVER be greater than total cost of the trip
- Calculate lock-in penalty as exactly 10% of the total trip cost
${extractedData.source ? `- IMPORTANT: Journey from ${extractedData.source} to ${extractedData.destination} - Include travel-related suggestions:
  * Best transportation options (flight/train/bus) from ${extractedData.source} to ${extractedData.destination}
  * Travel time and recommended departure times
  * Things to do during transit if applicable
  * First day should include arrival activities and settling in
  * Last day should include departure preparations if returning to ${extractedData.source}` : '- Single destination itinerary focused on local activities'}
- Budget handling: ${extractedData.maxBudget === 0 ? 'Focus on free/low-cost activities without mentioning specific costs' : `₹${extractedData.minBudget} - ₹${extractedData.maxBudget} INR total`}
- Travel style: ${extractedData.vibe}
- Date range: ${extractedData.startDate ? extractedData.startDate : 'NEXT DAY'} to ${extractedData.endDate ? extractedData.endDate : 'NEXT WEEK'} (FUTURE DATES ONLY)
- Include 3-4 activities per day with realistic timings
- Each activity should have time, title, description, duration, realistic cost, and category
- MUST include specific hotel costs with detailed breakdown in hotelStays array
- ${extractedData.maxBudget === 0 ? 'Focus on free attractions, public transport, budget-friendly options' : `Costs should be realistic for ${extractedData.destination}`}
- Activities should match ${extractedData.vibe} theme and be safe, legitimate attractions
- ${extractedData.maxBudget > 0 ? 'Total daily costs should fit within budget' : 'Prioritize free/low-cost experiences'}
- Use actual date progression starting from ${extractedData.startDate}
- Only suggest real, safe, and accessible locations within ${extractedData.destination}
- Validate that lock-in penalty (10% of total) is reasonable and never exceeds trip cost
${extractedData.source ? `- Include practical travel tips for ${extractedData.source} to ${extractedData.destination} journey` : ''}

Return only the JSON object:`;

    const requestBody = {
      messages: [
        {
          role: "user",
          content: content
        }
      ],
      max_tokens: 4096,
      temperature: 0.3,
      top_p: 0.8,
      model: "gpt-4o"
    };

    const openAIEndpoint = import.meta.env.VITE_OPENAI_AZURE_ENDPOINT;
    const openAIApiKey = import.meta.env.VITE_OPENAI_AZURE_API_KEY;

    if (!openAIEndpoint || !openAIApiKey) {
      throw new Error('OpenAI Azure configuration missing. Please check your environment variables.');
    }

    try {
      const response = await fetch(openAIEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content;
      
      if (!aiContent) {
        throw new Error('No content received from AI service');
      }

      // Clean and parse the JSON response
      let cleanedContent = aiContent.trim();
      
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '');
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.replace(/\s*```$/, '');
      }
      if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '');
      }

      const aiItinerary = JSON.parse(cleanedContent);
      
      // Validate structure
      if (!aiItinerary.days || !Array.isArray(aiItinerary.days) || aiItinerary.days.length === 0) {
        throw new Error('AI response missing required days array');
      }

      return {
        success: true,
        data: aiItinerary
      };

    } catch (error) {
      console.error('AI Itinerary Generation Error:', error);
      
      if (error instanceof SyntaxError) {
        return {
          success: false,
          error: `JSON parsing failed. AI returned invalid JSON format: ${error.message.substring(0, 100)}...`
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to generate AI itinerary'
      };
    }
  }

  // Helper method to calculate days between dates
  calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  }

  // Generate AI-powered itinerary using OpenAI Azure
  async generateAIItinerary(formData) {
    // Calculate duration in days
    const calculateDays = () => {
      if (!formData.startDate || !formData.endDate) return 7; // default
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    // Build the content string with user inputs
    const duration = calculateDays();
         const content = `You are an expert travel planner. Your task is to generate a detailed, realistic, and practical travel itinerary based on the user's provided criteria. 

CRITICAL: Return ONLY valid JSON. Do not use markdown code blocks, backticks, or any formatting. Start directly with { and end with }.

**Schema**: The output must be a JSON object with this exact structure:
{
  "itineraries": [
    {
      "id": (unique number),
      "searchCriteria": {
        "source": "string",
        "destination": "string", 
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "budget": "number",
        "vibe": "string"
      },
      "priceSection": {
        "amount": (total cost number),
        "currency": "INR"
      },
      "days": [
        {
          "id": (unique number),
          "dayNumber": (day number),
          "dayDate": "YYYY-MM-DD",
          "dayTitle": "string",
          "events": [
            {
              "id": (unique number),
              "travelSchedule": {
                "type": "string",
                "amount": (number)
              },
              "details": {
                "text": "string",
                "description": "string", 
                "duration": (minutes number)
              },
              "fare": {
                "type": "string",
                "amount": (number)
              },
              "type": "string",
              "amount": (number)
            }
          ]
        }
      ]
    }
  ]
}

**Requirements:**
- Create itinerary for ${duration} days to ${formData.destination}
- Budget: ₹${formData.budget} INR total
- Travel style: ${formData.travelStyle}
- Interests: ${formData.interests.join(', ')}
- Start date: ${formData.startDate}
- Include mix of popular and unique experiences
- Calculate dayDate correctly from startDate
- All costs should sum to realistic total${formData.customPrompt ? `\n- Additional: ${formData.customPrompt}` : ''}

Return only the JSON object:`;

    const requestBody = {
      messages: [
        {
          role: "user",
          content: content
        }
      ],
      max_tokens: 4096,
      temperature: 0.3,  // Lower temperature for more consistent JSON structure
      top_p: 0.8,        // Reduce randomness for better structure
      model: "gpt-4o"
    };

    // Get API configuration from environment variables
    const openAIEndpoint = import.meta.env.VITE_OPENAI_AZURE_ENDPOINT;
    const openAIApiKey = import.meta.env.VITE_OPENAI_AZURE_API_KEY;

    if (!openAIEndpoint || !openAIApiKey) {
      throw new Error('OpenAI Azure configuration missing. Please check your environment variables.');
    }

    try {
      const response = await fetch(openAIEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the JSON content from the AI response
      const aiContent = data.choices?.[0]?.message?.content;
      if (!aiContent) {
        throw new Error('No content received from AI service');
      }

      // Clean and parse the JSON response from AI
      // Remove markdown code blocks if present
      let cleanedContent = aiContent.trim();
      
      // Remove ```json at the beginning
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '');
      }
      
      // Remove ``` at the end
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.replace(/\s*```$/, '');
      }
      
      // Also handle plain ``` code blocks
      if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '');
      }
      
      // Final cleanup - remove any remaining backticks or whitespace
      cleanedContent = cleanedContent.trim();
      
      // Debug logging (can be removed in production)
      console.log('Raw AI content:', aiContent);
      console.log('Cleaned content:', cleanedContent);
      
      const aiItinerary = JSON.parse(cleanedContent);
      
      // Validate the structure has required fields
      if (!aiItinerary.itineraries || !Array.isArray(aiItinerary.itineraries) || aiItinerary.itineraries.length === 0) {
        throw new Error('AI response missing required itineraries array');
      }
      
      const firstItinerary = aiItinerary.itineraries[0];
      if (!firstItinerary.days || !Array.isArray(firstItinerary.days)) {
        throw new Error('AI response missing required days array');
      }
      
      return {
        success: true,
        data: aiItinerary
      };
    } catch (error) {
      console.error('AI Itinerary Generation Error:', error);
      
      // More specific error handling for JSON parsing issues
      if (error instanceof SyntaxError) {
        return {
          success: false,
          error: `JSON parsing failed. AI returned invalid JSON format: ${error.message.substring(0, 100)}...`
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to generate AI itinerary'
      };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export individual methods with proper binding
export const searchItineraries = (...args) => apiService.searchItineraries(...args);
export const getItineraryById = (...args) => apiService.getItineraryById(...args);
export const createItinerary = (...args) => apiService.createItinerary(...args);
export const generateAIItinerary = (...args) => apiService.generateAIItinerary(...args);
export const parseSearchQuery = (...args) => apiService.parseSearchQuery(...args);
export const generateAIItineraryFromQuery = (...args) => apiService.generateAIItineraryFromQuery(...args);

// Export the instance as well for direct access if needed
export { apiService };
