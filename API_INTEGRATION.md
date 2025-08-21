# Java Backend API Integration Guide

## Overview
The search functionality now integrates with a Java backend API endpoint `/v1/search` to fetch real itinerary data.

## API Endpoint Details

### Search Endpoint
- **URL**: `POST /v1/search`
- **Content-Type**: `application/json`

### Request Body Format (SearchCriteria POJO)
```json
{
  "prompt": "string | null",
  "source": "string | null",
  "destination": "string | null", 
  "startDate": "YYYY-MM-DD | null",
  "endDate": "YYYY-MM-DD | null",
  "budget": {
    "min": number,
    "max": number
  } | null,
  "vibe": "string | null"
}
```

**Budget Range Mapping:**
- `budget`: `{ "min": 0, "max": 10000 }`
- `mid-range`: `{ "min": 10001, "max": 30000 }`  
- `luxury`: `{ "min": 30001, "max": 60000 }`
- `premium`: `{ "min": 60001, "max": 1000000 }`

### Expected Response Format (SearchResponseDTO)
```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "itinerary": "string",
      "description": "string",
      "matchingScore": number,
      "price": number,
      "start": "YYYY-MM-DDTHH:mm:ss",
      "end": "YYYY-MM-DDTHH:mm:ss",
      "source": "string",
      "destination": "string"
    }
  ]
}
```

**Note:** The frontend automatically transforms the `SearchResponseDTO` to include additional UI fields like `title`, `rating`, `reviewCount`, `image`, `tags`, `highlights`, and `createdBy` for display purposes.

### Error Response Format
```json
{
  "success": false,
  "error": "Error message string"
}
```

## Environment Configuration

### Local Development
Create a `.env` file in the `/group-trip-planning` directory:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Production Deployment
Set environment variable in Netlify Dashboard:
1. Go to **Site Settings** → **Environment Variables**  
2. Add: `VITE_API_BASE_URL` = `https://your-java-backend-url.com`

## File Changes Made

### New Files
- `src/services/api.js` - API service with search functionality
- `API_INTEGRATION.md` - This documentation

### Updated Files
- `src/pages/ExplorePage.jsx` - Added API integration, loading states, error handling
- `src/pages/SearchResultsPage.jsx` - Added API data handling, loading/error states
- `netlify.toml` - Added environment variable configuration

## Features Implemented

### ExplorePage
- ✅ API call to `/v1/search` endpoint
- ✅ Loading state during API calls  
- ✅ Error handling with retry functionality
- ✅ Disabled form during search
- ✅ Success navigation with data passing

### SearchResultsPage  
- ✅ Display API response data
- ✅ Fallback API call for direct URL access
- ✅ Loading states and error handling
- ✅ Sorting functionality preserved
- ✅ Retry failed requests

### API Service
- ✅ Centralized API configuration
- ✅ Error handling and response formatting
- ✅ Request body optimization (removes null values)
- ✅ Configurable base URL via environment variables

## Backend Requirements

Your Java backend should:
1. Accept POST requests to `/v1/search`
2. Handle CORS for frontend domain
3. Return data in the expected JSON format
4. Handle empty/null request parameters gracefully
5. Return appropriate HTTP status codes

## Testing

### With Mock Backend
For local testing, you can use tools like:
- **JSON Server** - Mock REST API
- **Postman Mock Server**
- **WireMock** - Java-based mock server

### Example Request Body
```json
{
  "prompt": "Looking for a cultural adventure with great food experiences",
  "source": "Paris",
  "destination": "Paris",
  "startDate": "2024-06-01",
  "endDate": "2024-06-06",
  "budget": {
    "min": 10001,
    "max": 30000
  },
  "vibe": "culture"
}
```

### Example Response (SearchResponseDTO)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "itinerary": "Amazing Cultural Trip to Paris",
      "description": "Experience the best of Parisian culture with museum visits, local cuisine, and historical tours.",
      "matchingScore": 95.5,
      "price": 25000,
      "start": "2024-06-01T10:00:00",
      "end": "2024-06-06T18:00:00", 
      "source": "Paris",
      "destination": "Paris"
    }
  ]
}
```

## Deployment Notes

1. **Environment Variables**: Make sure `VITE_API_BASE_URL` is set in production
2. **CORS**: Configure your Java backend to allow requests from your Netlify domain
3. **HTTPS**: Ensure your backend uses HTTPS in production
4. **Error Monitoring**: Consider adding error tracking (Sentry, LogRocket, etc.)

## Troubleshooting

### Common Issues
- **CORS Errors**: Configure backend CORS settings
- **Network Timeouts**: Add timeout handling in API service
- **SSL Certificate Issues**: Ensure backend has valid SSL certificate
- **Environment Variables**: Verify variables are set correctly in deployment

### Debug Mode
Add console logs in the API service for debugging:
```javascript
console.log('API Request:', requestBody);
console.log('API Response:', response);
```
