"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; image_url?: string } | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkAuth = () => {
      // Check authentication status
      const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

      if (userId) {
        // Optimistically set from storage first if available
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed.name) setUser({ name: parsed.name, image_url: parsed.image_url });
          } catch (e) {
            console.error("Error parsing stored user", e);
          }
        }

        // Fetch latest profile data
        fetch(API_ENDPOINTS.auth.profile(userId))
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Failed to fetch profile");
          })
          .then((data) => {
            setUser({
              name: data.name,
              image_url: data.image_url,
            });
          })
          .catch((err) => {
            console.error("Error loading user profile:", err);
          });
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkAuth();

    // Listen for auth changes
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold"
          >
            <span className="bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
              LibaasAI
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-black dark:text-gray-200 transition-colors hover:text-green-600 dark:hover:text-green-400"
          >
            Home
          </Link>
          <Link
            href="/my-wardrobe"
            className="text-sm font-medium text-black dark:text-gray-200 transition-colors hover:text-green-600 dark:hover:text-green-400"
          >
            My Wardrobe
          </Link>
          <Link
            href="/get-started"
            className="text-sm font-medium text-black dark:text-gray-200 transition-colors hover:text-green-600 dark:hover:text-green-400"
          >
            Generate Look
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-black dark:text-gray-200 transition-colors hover:text-green-600 dark:hover:text-green-400"
          >
            Profile
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 md:flex">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-full bg-white dark:bg-gray-800 pl-1 pr-4 py-1 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-emerald-600 to-yellow-500 p-0.5">
                  {user.image_url ? (
                    <img src={user.image_url} alt={user.name} className="h-full w-full rounded-full object-cover bg-white" />
                  ) : (
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-emerald-700 text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col items-center justify-center gap-1.5 p-2"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`block h-0.5 w-6 bg-black dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-black dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""
                }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-black dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${isMobileMenuOpen ? "max-h-screen border-t border-gray-100 dark:border-gray-800" : "max-h-0"
          }`}
      >
        <div className="bg-white dark:bg-gray-900 px-4 py-6 space-y-6">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/my-wardrobe"
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Wardrobe
            </Link>
            <Link
              href="/get-started"
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Generate Look
            </Link>
            <Link
              href="/profile"
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-4 rounded-2xl bg-gray-50 dark:bg-gray-800 p-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-600 to-yellow-500 p-0.5">
                  {user.image_url ? (
                    <img src={user.image_url} alt={user.name} className="h-full w-full rounded-full object-cover bg-white" />
                  ) : (
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-emerald-700 font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">View Profile</div>
                </div>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/signin"
                  className="rounded-xl border border-green-600 py-3 text-center font-bold text-green-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-green-600 py-3 text-center font-bold text-white shadow-lg shadow-green-600/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 p-1 transition-all duration-300 focus:outline-none shadow-inner"
      aria-label="Toggle theme"
    >
      <div
        className={`flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${theme === "dark" ? "translate-x-6 rotate-[360deg]" : "translate-x-0"
          }`}
      >
        {theme === "dark" ? (
          <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
