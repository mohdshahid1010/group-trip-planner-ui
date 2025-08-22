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
      
      // Transform to match expected API response format
      const transformedResults = filteredResults.map(result => ({
        id: result.id,
        itinerary: result.name,
        description: `Experience ${result.destination} with ${result.vibe.toLowerCase()} activities`,
        matchingScore: result.matchingScore,
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
      'Himachal': 'https://images.unsplash.com/photo-1605538883669-825200433431?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
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

// Export the instance as well for direct access if needed
export { apiService };
