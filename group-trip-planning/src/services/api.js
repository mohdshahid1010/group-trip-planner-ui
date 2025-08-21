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

  // Search itineraries endpoint
  async searchItineraries(searchData) {
    // Map budget range to min/max values
    const getBudgetRange = (budgetRange) => {
      switch (budgetRange) {
        case 'budget':
          return { min: 0, max: 10000 };
        case 'mid-range':
          return { min: 10001, max: 30000 };
        case 'luxury':
          return { min: 30001, max: 60000 };
        case 'premium':
          return { min: 60001, max: 1000000 };
        default:
          return null;
      }
    };

    // Create request body matching SearchCriteria Java POJO
    const requestBody = {
      prompt: searchData.description || null,
      source: searchData.searchQuery || null,
      destination: searchData.searchQuery || null,
      startDate: searchData.startDate || null,
      endDate: searchData.endDate || null,
      budget: searchData.budgetRange !== 'all' ? getBudgetRange(searchData.budgetRange) : null,
      vibe: searchData.selectedVibes?.length > 0 ? searchData.selectedVibes[0] : null, // Take first vibe as single string
    };

    // Remove null/undefined values
    const cleanedRequestBody = Object.entries(requestBody).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return this.makeRequest('/v1/search/', {
      method: 'POST',
      body: JSON.stringify(cleanedRequestBody),
    });
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
        "currency": "USD"
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
- Budget: ${formData.budget} USD total
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
