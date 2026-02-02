"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WardrobeItem {
  id: string;
  name: string;
  image_url: string;
  tags: string[];
  category: string;
  color?: string;
  style?: string;
  pattern?: string;
  sub_category?: string;
}

export default function MyWardrobePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStyle, setSelectedStyle] = useState("All Styles");
  const [isDragging, setIsDragging] = useState(false);

  // Backend integration state
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const categories = [
    "All Categories",
    "Tops & Kurtas",
    "Bottoms & Shalwar",
    "Dresses & Lehengas",
    "Dupattas & Scarves",
    "Shoes & Sandals",
    "Accessories & Bags",
    "Jewelry",
    "Cultural / Special",
    "Uncategorized", // Show uncategorized items
  ];

  const styles = ["All Styles", "Ethnic", "Western", "Fusion", "Formal", "Casual"];

  // Fetch wardrobe items from backend
  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        setLoading(true);

        // Get userId from localStorage/sessionStorage (stored as JSON object)
        let userIdFromStorage = null;

        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            userIdFromStorage = userObj.id;
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }

        if (!userIdFromStorage) {
          setError("Please sign in to view your wardrobe");
          setLoading(false);
          return;
        }

        setUserId(userIdFromStorage);

        // Fetch wardrobe items
        const response = await fetch(`https://web-production-9463.up.railway.app/wardrobe/items/${userIdFromStorage}`);

        if (!response.ok) {
          throw new Error("Failed to fetch wardrobe items");
        }

        const data = await response.json();
        setWardrobeItems(data.items || []);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching wardrobe:", err);
        setError(err.message || "Failed to load wardrobe");
        setLoading(false);
      }
    };

    fetchWardrobe();
  }, []);

  // File upload handlers
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !userId) return;

    setUploading(true);
    setError("");
    setSuccessMessage("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", userId);

        const response = await fetch("https://web-production-9463.up.railway.app/wardrobe/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        return await response.json();
      });

      const results = await Promise.all(uploadPromises);

      // Add new items to wardrobe
      const newItems = results.map(r => r.item);
      setWardrobeItems(prev => [...newItems, ...prev]);

      setSuccessMessage(`Successfully uploaded ${files.length} item(s) and auto-categorized!`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to upload items");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!userId || !confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`https://web-production-9463.up.railway.app/wardrobe/items/${itemId}?user_id=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Remove from UI
      setWardrobeItems(prev => prev.filter(item => item.id !== itemId));
      setSuccessMessage("Item deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete item");
    }
  };

  const filteredItems = wardrobeItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesStyle = selectedStyle === "All Styles" || item.tags?.includes(selectedStyle.toLowerCase());
    return matchesSearch && matchesCategory && matchesStyle;
  });

  const groupedItems = categories.reduce((acc, category) => {
    if (category !== "All Categories") {
      acc[category] = filteredItems.filter((item) => item.category === category);
    }
    return acc;
  }, {} as Record<string, WardrobeItem[]>);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Show loading state
  if (loading && wardrobeItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your wardrobe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-yellow-400 dark:from-gray-950 dark:via-slate-900 dark:to-emerald-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-300 dark:bg-emerald-500/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 dark:bg-purple-500/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-rose-300 dark:bg-rose-500/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full bg-white/95 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20 dark:border-slate-700/50 text-center relative overflow-hidden transition-colors duration-300 z-10">
        {/* Background Decorative Element - Adjusted for Dark Mode */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 dark:from-emerald-500 dark:to-emerald-700 text-white mb-8 shadow-xl transform hover:rotate-12 transition-transform duration-300">
            <svg className="h-10 w-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            My Wardrobe
          </h1>

          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300 text-sm font-bold uppercase tracking-widest mb-6">
            Coming Soon
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            We're putting the finishing touches on your personal AI closet. Soon you'll be able to organize, categorize, and browse your entire collection with ease!
          </p>

          <Link
            href="/profile"
            className="group flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 py-4 text-center text-base font-bold text-white transition-all shadow-lg hover:shadow-emerald-600/30 active:scale-[0.98]"
          >
            <span>Back to Profile</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

