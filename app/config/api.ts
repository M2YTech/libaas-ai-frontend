// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://web-production-9463.up.railway.app";

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/login`,
    profile: (userId: string) => `${API_BASE_URL}/auth/profile/${userId}`,
    updateProfilePhoto: `${API_BASE_URL}/auth/update-profile-photo`,
    updateProfile: `${API_BASE_URL}/auth/update-profile`,
  },
  wardrobe: {
    items: (userId: string) => `${API_BASE_URL}/wardrobe/items/${userId}`,
    upload: `${API_BASE_URL}/wardrobe/upload`,
    deleteItem: (itemId: string, userId: string) => 
      `${API_BASE_URL}/wardrobe/items/${itemId}?user_id=${userId}`,
    generateOutfits: `${API_BASE_URL}/wardrobe/generate-outfit-recommendations`,
  },
};
