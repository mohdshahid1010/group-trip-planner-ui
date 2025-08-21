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
}

// Create singleton instance
const apiService = new ApiService();

// Export individual methods with proper binding
export const searchItineraries = (...args) => apiService.searchItineraries(...args);
export const getItineraryById = (...args) => apiService.getItineraryById(...args);
export const createItinerary = (...args) => apiService.createItinerary(...args);

// Export the instance as well for direct access if needed
export { apiService };
