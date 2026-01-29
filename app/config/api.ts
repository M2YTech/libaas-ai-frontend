// API Configuration
// API Configuration
const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || "https://libaas-backend-production.up.railway.app";
  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

export const API_BASE_URL = getBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/login`,
    profile: (userId: string) => `${API_BASE_URL}/auth/profile/${userId}`,
    updateProfilePhoto: `${API_BASE_URL}/auth/update-profile-photo`,
    updateProfile: `${API_BASE_URL}/auth/update-profile`,
    styleInsights: (userId: string) => `${API_BASE_URL}/auth/style-insights/${userId}`,
  },
  wardrobe: {
    items: (userId: string) => `${API_BASE_URL}/wardrobe/items/${userId}`,
    upload: `${API_BASE_URL}/wardrobe/upload`,
    deleteItem: (itemId: string, userId: string) =>
      `${API_BASE_URL}/wardrobe/items/${itemId}?user_id=${userId}`,
    generateOutfits: `${API_BASE_URL}/wardrobe/generate-outfit-recommendations`,
  },
};
