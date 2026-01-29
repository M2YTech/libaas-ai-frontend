"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { API_ENDPOINTS } from "../config/api";

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isViewingPhoto, setIsViewingPhoto] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Backend state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [originalProfileImage, setOriginalProfileImage] = useState<string>("");

  // User profile data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [country, setCountry] = useState("");
  const [height, setHeight] = useState("");
  const [bodyShape, setBodyShape] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [clipInsights, setClipInsights] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  // AI Style Insights state
  const [styleInsights, setStyleInsights] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Fetch user profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Get userId from URL params or storage
        let userIdFromUrl = searchParams.get("userId");
        let userIdFromStorage =
          localStorage.getItem("userId") ||
          sessionStorage.getItem("userId");

        const currentUserId = userIdFromUrl || userIdFromStorage;

        if (!currentUserId) {
          setError("No user ID found. Please log in again.");
          router.push("/signin");
          return;
        }

        setUserId(currentUserId);

        // Fetch profile data from backend
        const response = await fetch(API_ENDPOINTS.auth.profile(currentUserId), {
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();

        // Update state with fetched data
        setFullName(data.name || "");
        setEmail(data.email || "");
        setGender(data.gender || "male");
        setCountry(data.country || "");
        setHeight(data.height || "");
        setBodyShape(data.body_shape || "");
        setSkinTone(data.skin_tone || "");
        setProfileImage(data.image_url || "");
        setOriginalProfileImage(data.image_url || "");
        setClipInsights(data.clip_insights || null);

        // Load persisted style insights from database (stored in clip_insights)
        const persistedInsights = data.style_insights || data.clip_insights?.persisted_style_insights;
        setStyleInsights(persistedInsights || null);

        setRecommendations(data.recommendations || null);

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [searchParams, router]);

  // Handle image load error
  const handleImageError = () => {
    console.error("Failed to load profile image:", profileImage);
    // You might want to show a toast here, or just let it fall back 
    // For now we'll keep the profileImage state but maybe show an error indicator?
    // Or clear it so it shows placeholder? 
    // Let's NOT clear it to avoid flickering loops if URL is persistently bad
    // Instead, we can rely on the rendering logic below or add a state 'imageLoadError'
  };

  // Wardrobe summary data (reset - no dummy data)
  const wardrobeSummary = [
    { count: 0, label: "Tops", color: "bg-emerald-100 text-emerald-700" },
    { count: 0, label: "Bottoms", color: "bg-yellow-100 text-yellow-700" },
    { count: 0, label: "Shoes", color: "bg-purple-100 text-purple-700" },
    { count: 0, label: "Dresses", color: "bg-pink-100 text-pink-700" },
    { count: 0, label: "Total Items", color: "bg-blue-100 text-blue-700" },
  ];

  const genderOptions = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
    { id: "other", name: "Other" },
  ];

  const bodyShapeOptions = [
    { id: "hourglass", name: "Hourglass" },
    { id: "pear", name: "Pear" },
    { id: "rectangle", name: "Rectangle" },
    { id: "inverted", name: "Inverted Triangle" },
    { id: "round", name: "Round" },
  ];

  const skinToneOptions = [
    { id: "fair", name: "Fair", color: "#FFD7B5" },
    { id: "warm", name: "Warm", color: "#D4A574" },
    { id: "olive", name: "Olive", color: "#C9A86A" },
    { id: "tan", name: "Tan", color: "#B38355" },
    { id: "deep", name: "Deep", color: "#6B4423" },
  ];

  // Parse AI insights from CLIP data
  const aiInsights = clipInsights && clipInsights.all_predictions?.length > 0 ? {
    // Top 5 predictions as style recommendations
    topPredictions: clipInsights.all_predictions
      .slice(0, 5)
      .map((p: any) => ({
        label: p.label,
        score: (p.score * 100).toFixed(1)
      })),
    // Top prediction
    topLabel: clipInsights.top_label || "No analysis available",
    topConfidence: clipInsights.top_confidence
      ? (clipInsights.top_confidence * 100).toFixed(1)
      : "0",
    // For display in sections
    colors: clipInsights.all_predictions.slice(0, 3).map((p: any) => p.label),
    fits: clipInsights.all_predictions.slice(3, 5).map((p: any) => p.label),
    patterns: clipInsights.all_predictions.slice(5, 7).map((p: any) => p.label),
  } : {
    topPredictions: [],
    topLabel: "No analysis available",
    topConfidence: "0",
    colors: ["Upload photo during signup for AI insights"],
    fits: ["Upload photo during signup for AI insights"],
    patterns: ["Upload photo during signup for AI insights"],
  };

  const countries = [
    "Pakistan",
    "India",
    "Bangladesh",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Other",
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview" },
    { id: "personal-info", label: "Personal Info" },
    { id: "privacy", label: "Privacy & Settings" },
    { id: "ai-insights", label: "AI Style Insights" },
    { id: "quick-actions", label: "Quick Actions" },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelPhoto = () => {
    setPhotoFile(null);
    setProfileImage(originalProfileImage);
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !userId) return;

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('user_id', userId);

      const response = await fetch(API_ENDPOINTS.auth.updateProfilePhoto, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      setProfileImage(data.image_url);
      setPhotoFile(null);
      alert('Profile photo updated successfully!');
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      alert(err.message || 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) return;

    setIsSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('name', fullName);
      formData.append('gender', gender);
      formData.append('country', country);
      formData.append('height', height);
      formData.append('body_shape', bodyShape);
      formData.append('skin_tone', skinTone);

      console.log('Attemping profile update for user:', userId);
      console.log('Update data:', { fullName, gender, country, height, bodyShape, skinTone });

      const response = await fetch(API_ENDPOINTS.auth.updateProfile, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.detail || `Server error (${response.status})`);
      }

      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const fetchStyleInsights = async () => {
    if (!userId) return;

    setIsLoadingInsights(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.styleInsights(userId));
      const data = await response.json();

      if (data.success) {
        setStyleInsights(data.insights);
      } else {
        console.error('Failed to load insights:', data.message);
        alert(data.message || 'Failed to generate insights');
      }
    } catch (error) {
      console.error('Error fetching style insights:', error);
      alert('Error connecting to AI service');
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("userId");

      // Notify Navbar to update
      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/signin"
            className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-yellow-500 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-yellow-400 transition-all"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 rounded-xl bg-card border border-border p-3 shadow-2xl backdrop-blur-md"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-120px)]
            w-64 lg:w-72 flex-shrink-0
            bg-card rounded-none lg:rounded-3xl
            shadow-2xl border border-border
            transition-transform duration-300 ease-in-out z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}>
            <div className="p-8">
              {/* Profile Header in Sidebar */}
              <div className="mb-8 text-center pb-8 border-b border-border">
                <div className="relative mb-6 mx-auto w-28 h-28">
                  {/* Profile Image (Click to View) */}
                  <div
                    className={`h-full w-full rounded-full overflow-hidden shadow-lg border-4 border-white ${profileImage ? 'cursor-zoom-in hover:opacity-90' : ''} transition-all`}
                    onClick={() => profileImage && setIsViewingPhoto(true)}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log("Image load failed, reverting to placeholder");
                          setProfileImage(""); // Revert to initials placeholder
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-emerald-700 to-yellow-400 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {fullName ? fullName.split(" ").map(n => n[0]).join("") : "?"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Edit Badge (Click to Upload) */}
                  <label
                    htmlFor="profile-photo-input"
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors group"
                    title="Change Profile Photo"
                  >
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                  <input
                    id="profile-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                {photoFile && (
                  <div className="flex flex-col gap-2 mb-6">
                    <button
                      onClick={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                      className="w-full px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 transition-all shadow-lg active:scale-95"
                    >
                      {isUploadingPhoto ? 'Uploading...' : 'Save New Photo'}
                    </button>
                    <button
                      onClick={handleCancelPhoto}
                      disabled={isUploadingPhoto}
                      className="w-full px-4 py-2 text-sm font-bold text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <h2 className="text-xl font-black text-foreground">{fullName || "Guest User"}</h2>
                <p className="text-sm font-medium text-muted-foreground">{email || "No email linked"}</p>
              </div>

              <nav className="space-y-3">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-300 font-bold ${activeSection === item.id
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-xl scale-[1.02]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <span className="text-base">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Sign Out Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-medium text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Full Screen Image Modal */}
          {isViewingPhoto && profileImage && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsViewingPhoto(false)}>
              <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <button
                  onClick={() => setIsViewingPhoto(false)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={profileImage}
                  alt={fullName}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="rounded-3xl bg-card p-6 sm:p-10 shadow-2xl border border-border transition-all duration-500">
                <h2 className="mb-8 text-3xl sm:text-4xl font-black text-foreground tracking-tight">Profile Overview</h2>

                {/* Wardrobe Summary */}
                <div className="mb-6">
                  <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Wardrobe Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
                    {wardrobeSummary.map((item, index) => (
                      <div
                        key={index}
                        className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center ${item.color}`}
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">{item.count}</div>
                        <div className="text-xs sm:text-sm font-medium">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Go to Wardrobe Button */}
                <Link
                  href="/my-wardrobe"
                  className="w-full block rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-600 py-3 text-center text-sm font-semibold text-white hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-md hover:shadow-lg"
                >
                  Go to Wardrobe
                </Link>
              </div>
            )}

            {/* Privacy & Settings Section */}
            {activeSection === "privacy" && (
              <div className="rounded-3xl bg-card p-6 sm:p-10 shadow-2xl border border-border transition-all duration-500">
                <h2 className="mb-8 text-3xl font-black text-foreground tracking-tight">
                  Privacy & Settings
                </h2>

                {/* Image Processing Toggle */}
                <div className="mb-10 flex items-center justify-between gap-6 p-6 rounded-2xl bg-muted/30 border border-border">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">Image Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow AI to analyze photos for recommendations
                    </p>
                  </div>
                  <button
                    onClick={() => setImageProcessing(!imageProcessing)}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-all duration-300 ${imageProcessing ? "bg-emerald-600" : "bg-muted-foreground/20"
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${imageProcessing ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-border py-4 text-sm font-bold text-foreground hover:bg-muted transition-all active:scale-95"
                  >
                    Sign Out
                  </button>
                  <button className="w-full rounded-xl border border-red-500/20 py-4 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all active:scale-95">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Personal Info Section */}
            {activeSection === "personal-info" && (
              <div className="rounded-3xl bg-card p-6 sm:p-10 shadow-2xl border border-border transition-all duration-500">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight">
                      Personal Information
                    </h2>
                    <p className="text-base text-muted-foreground">
                      Edit your personal info and style preferences
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="rounded-xl bg-muted px-6 py-3 text-sm font-bold text-foreground hover:bg-muted/80 transition-all active:scale-95 border border-border"
                  >
                    {isEditingProfile ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Full Name
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-4 text-base text-foreground focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      />
                    ) : (
                      <div className="rounded-xl bg-muted/30 border border-border px-5 py-4 text-base font-bold text-foreground">
                        {fullName}
                      </div>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Email Address
                    </label>
                    <div className="rounded-xl bg-muted/30 border border-border px-5 py-4 text-base font-bold text-foreground">
                      {email}
                    </div>
                  </div>

                  {/* Gender */}
                  {isEditingProfile && (
                    <div>
                      <label className="mb-3 block text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Gender
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {genderOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setGender(option.id)}
                            className={`rounded-xl border-2 py-4 text-sm font-bold transition-all active:scale-95 ${gender === option.id
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-border bg-background text-muted-foreground hover:border-emerald-500/50"
                              }`}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Country */}
                  {isEditingProfile && (
                    <div>
                      <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                        Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Height */}
                  {isEditingProfile && (
                    <div>
                      <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-900">
                        Height (cm)
                      </label>
                      <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  )}

                  {/* Body Shape */}
                  {isEditingProfile && (
                    <div>
                      <label className="mb-3 block text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Body Shape
                      </label>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                        {bodyShapeOptions.map((shape) => (
                          <button
                            key={shape.id}
                            type="button"
                            onClick={() => setBodyShape(shape.id)}
                            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all active:scale-95 ${bodyShape === shape.id
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-border bg-background text-muted-foreground hover:border-emerald-500/50"
                              }`}
                          >
                            <span className="text-sm font-bold text-center leading-tight">
                              {shape.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skin Tone */}
                  {isEditingProfile && (
                    <div>
                      <label className="mb-3 block text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Skin Tone
                      </label>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                        {skinToneOptions.map((tone) => (
                          <button
                            key={tone.id}
                            type="button"
                            onClick={() => setSkinTone(tone.id)}
                            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all active:scale-95 ${skinTone === tone.id
                              ? "border-emerald-500 bg-emerald-500/10"
                              : "border-border bg-background hover:border-emerald-500/50"
                              }`}
                          >
                            <div
                              className="h-8 w-8 rounded-full border-2 border-white/20 shadow-sm"
                              style={{ backgroundColor: tone.color }}
                            ></div>
                            <span className="text-xs font-bold text-foreground">
                              {tone.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  {isEditingProfile && (
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isSavingProfile}
                      className="w-full mt-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-4 text-base font-bold text-white hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 active:scale-95"
                    >
                      {isSavingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* AI Style Insights Section */}
            {/* AI Style Insights Section */}
            {activeSection === "ai-insights" && (
              <div className="rounded-3xl bg-card p-6 sm:p-10 shadow-2xl border border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight">
                      AI Style Insights
                    </h2>
                    <p className="text-base text-muted-foreground">
                      Personalized recommendations based on your wardrobe
                    </p>
                  </div>
                  <button
                    onClick={fetchStyleInsights}
                    disabled={isLoadingInsights}
                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-bold text-white hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 active:scale-95"
                  >
                    {isLoadingInsights ? 'Generating...' : 'Generate Insights'}
                  </button>
                </div>

                <div className="space-y-10">
                  {/* User Profile Attributes */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Your Profile Details
                      </h3>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        These details help our AI generate personalized looks for you
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Gender */}
                      <div className="rounded-2xl bg-muted/30 p-5 border border-border">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Gender</p>
                        <p className="text-lg font-black text-foreground capitalize">{gender || "Not specified"}</p>
                      </div>

                      {/* Height */}
                      {height && (
                        <div className="rounded-2xl bg-muted/30 p-5 border border-border">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Height</p>
                          <p className="text-lg font-black text-foreground">{height} cm</p>
                        </div>
                      )}

                      {/* Body Shape */}
                      {bodyShape && (
                        <div className="rounded-2xl bg-muted/30 p-5 border border-border">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Body Shape</p>
                          <p className="text-lg font-black text-foreground capitalize">{bodyShape}</p>
                        </div>
                      )}

                      {/* Skin Tone */}
                      {skinTone && (
                        <div className="rounded-2xl bg-muted/30 p-5 border border-border">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Skin Tone</p>
                          <p className="text-lg font-black text-foreground capitalize">{skinTone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personalized Recommendations */}
                  {styleInsights && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="pt-8 border-t border-border">
                        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-6">
                          Personalized Style Recommendations
                        </h3>

                        {/* Summary */}
                        <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10 mb-8">
                          <p className="text-foreground/90 leading-relaxed font-medium italic">"{styleInsights.summary}"</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                          {/* Color Palette */}
                          <div>
                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Color Palette</h4>
                            <div className="flex flex-wrap gap-2">
                              {styleInsights.color_palette.map((color: string, idx: number) => (
                                <span key={idx} className="px-4 py-2 bg-muted/50 rounded-lg text-sm font-bold text-foreground border border-border">
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Style Tips */}
                          <div>
                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Style Tips</h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {styleInsights.style_recommendations.map((tip: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 bg-muted/20 p-4 rounded-xl border border-border group hover:border-emerald-500/30 transition-all">
                                  <span className="text-emerald-500 font-black">✓</span>
                                  <span className="text-foreground/80 text-sm font-medium">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Wardrobe Essentials */}
                          <div>
                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Wardrobe Essentials</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {styleInsights.wardrobe_essentials.map((item: string, idx: number) => (
                                <div key={idx} className="bg-background p-4 rounded-xl border border-border text-sm text-foreground font-bold text-center shadow-sm hover:border-emerald-500/30 transition-all">
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Do's & Don'ts */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10">
                              <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span>👍</span> Do's
                              </h4>
                              <ul className="space-y-3">
                                {styleInsights.fashion_dos.map((item: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm font-medium text-foreground/80">
                                    <span className="text-emerald-500">•</span> {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
                              <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span>👎</span> Don'ts
                              </h4>
                              <ul className="space-y-3">
                                {styleInsights.fashion_donts.map((item: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm font-medium text-foreground/80">
                                    <span className="text-red-500">•</span> {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Cultural Tips */}
                          {styleInsights.cultural_tips && (
                            <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10">
                              <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span>🌍</span> Local Trends
                              </h4>
                              <p className="text-sm text-foreground/80 leading-relaxed">{styleInsights.cultural_tips}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!styleInsights && !isLoadingInsights && (
                    <div className="bg-muted/20 rounded-3xl p-12 border border-dashed border-border text-center">
                      <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Generate Your Style Guide</h3>
                      <p className="text-sm text-muted-foreground mb-0 max-w-xs mx-auto">
                        Personalized recommendations based on your unique profile and wardrobe.
                      </p>
                    </div>
                  )}

                  {/* AI Predictions */}
                  {clipInsights && (
                    <div className="pt-8 border-t border-border">
                      <div className="rounded-3xl bg-gradient-to-br from-muted/50 to-muted/20 p-8 border border-border shadow-lg mb-8 relative overflow-hidden group">
                        <div className="absolute top-[-10%] right-[-5%] text-8xl opacity-[0.03] font-black group-hover:scale-110 transition-transform">AI</div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                            Image Analysis
                          </h3>
                          <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            {aiInsights.topConfidence}% CONFIDENCE
                          </span>
                        </div>
                        <p className="text-3xl font-black text-foreground capitalize">
                          {aiInsights.topLabel}
                        </p>
                      </div>

                      {aiInsights.topPredictions.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {aiInsights.topPredictions.map((pred: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border hover:border-emerald-500/20 transition-all">
                              <span className="text-sm font-bold text-foreground capitalize">{pred.label}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-20 bg-muted rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pred.score}%` }}></div>
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground w-8 text-right">{pred.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions Section */}
            {activeSection === "quick-actions" && (
              <div className="rounded-3xl bg-card p-6 sm:p-10 shadow-2xl border border-border transition-all duration-500">
                <h2 className="mb-8 text-3xl font-black text-foreground tracking-tight">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  <Link
                    href="/my-wardrobe"
                    className="flex items-center justify-between w-full rounded-2xl border border-border px-6 py-5 text-base font-bold text-foreground hover:bg-muted hover:border-emerald-500 transition-all group"
                  >
                    <span>Open Wardrobe</span>
                    <svg className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/get-started"
                    className="flex items-center justify-between w-full rounded-2xl border border-border px-6 py-5 text-base font-bold text-foreground hover:bg-muted hover:border-emerald-500 transition-all group"
                  >
                    <span>Generate Look</span>
                    <svg className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>

                {/* Stats */}
                <div className="pt-10 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Wardrobe Status</p>
                      <p className="text-base font-bold text-foreground">Items Analyzed</p>
                    </div>
                    <span className="text-5xl font-black text-emerald-600">0</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading your profile...</p>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}

