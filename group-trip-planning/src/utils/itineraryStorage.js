// Utility functions for managing published itineraries in localStorage

const STORAGE_KEY = 'published_itineraries';
const USER_ID = 1; // Using currentUser.id from mockData

// Get all published itineraries for current user
export const getPublishedItineraries = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const allItineraries = JSON.parse(stored);
    return allItineraries.filter(itinerary => itinerary.createdBy?.id === USER_ID);
  } catch (error) {
    console.error('Error loading published itineraries:', error);
    return [];
  }
};

// Save a new published itinerary
export const savePublishedItinerary = (generatedItinerary, formData) => {
  try {
    // Convert generated itinerary to profile-compatible format
    const profileItinerary = {
      id: Date.now(), // Use timestamp as unique ID
      title: generatedItinerary.title,
      destination: generatedItinerary.destination,
      duration: generatedItinerary.duration,
      startDate: generatedItinerary.startDate,
      endDate: generatedItinerary.endDate,
      price: parseInt(generatedItinerary.estimatedCost) || 0,
      groupSize: generatedItinerary.groupSize || '2-4',
      description: generatedItinerary.description,
      image: getRandomTravelImage(), // Use placeholder image
      rating: 0, // New trip, no rating yet
      reviewCount: 0,
      participants: [], // Empty initially
      tags: generatedItinerary.tags || formData.interests || [],
      highlights: generatedItinerary.highlights || [],
      days: generatedItinerary.days || [],
      sustainabilityScore: generatedItinerary.sustainabilityScore || 85,
      createdBy: {
        id: USER_ID,
        name: "Olivia Bennett", // From mockData currentUser
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      createdAt: new Date().toISOString(),
      isPublished: true,
      isAIGenerated: !generatedItinerary.isFallback,
      originalFormData: formData // Store original form data for reference
    };

    // Get existing itineraries
    const existing = localStorage.getItem(STORAGE_KEY);
    const allItineraries = existing ? JSON.parse(existing) : [];
    
    // Add new itinerary
    allItineraries.unshift(profileItinerary); // Add to beginning of array
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allItineraries));
    
    return profileItinerary;
  } catch (error) {
    console.error('Error saving published itinerary:', error);
    return null;
  }
};

// Delete a published itinerary
export const deletePublishedItinerary = (itineraryId) => {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) return false;
    
    const allItineraries = JSON.parse(existing);
    const filtered = allItineraries.filter(itinerary => itinerary.id !== itineraryId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting published itinerary:', error);
    return false;
  }
};

// Get random travel image for placeholder
const getRandomTravelImage = () => {
  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2035&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
    'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ];
  
  return images[Math.floor(Math.random() * images.length)];
};

// Clear all published itineraries (for development/testing)
export const clearAllPublishedItineraries = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing published itineraries:', error);
    return false;
  }
};
