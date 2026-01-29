"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; image_url?: string } | null>(null);
  const { theme, toggleTheme, mounted } = useTheme();

  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

      if (userId) {
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed.name) setUser({ name: parsed.name, image_url: parsed.image_url });
          } catch (e) {
            console.error("Error parsing stored user", e);
          }
        }

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

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-16">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg group-hover:rotate-6 transition-transform">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-yellow-500 bg-clip-text text-transparent">
              LibaasAI
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/my-wardrobe">My Wardrobe</NavLink>
          <NavLink href="/get-started">Look Generator</NavLink>
        </div>

        {/* Action Section (Desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          {mounted && <ThemeToggle theme={theme} toggleTheme={toggleTheme} />}

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-full bg-gray-50 dark:bg-gray-800/50 pl-1 pr-4 py-1 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 transition-colors"
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
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {user.name.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin" className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95">
                Join Free
              </Link>
            </div>
          )}
        </div>

        {/* Action Section (Mobile) */}
        <div className="flex items-center gap-3 md:hidden">
          {mounted && <ThemeToggle theme={theme} toggleTheme={toggleTheme} />}
          <button
            onClick={toggleMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-2xl md:hidden overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex flex-col space-y-4">
              <MobileNavLink href="/" onClick={toggleMobileMenu}>Home</MobileNavLink>
              <MobileNavLink href="/my-wardrobe" onClick={toggleMobileMenu}>My Wardrobe</MobileNavLink>
              <MobileNavLink href="/get-started" onClick={toggleMobileMenu}>Look Generator</MobileNavLink>
              <MobileNavLink href="/profile" onClick={toggleMobileMenu}>Profile</MobileNavLink>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-4 rounded-2xl bg-gray-50 dark:bg-gray-800 p-4"
                  onClick={toggleMobileMenu}
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
                    <div className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Personal Dashboard</div>
                  </div>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/signin" className="rounded-xl border-2 border-gray-200 dark:border-gray-700 py-3 text-center font-bold text-gray-600 dark:text-gray-300" onClick={toggleMobileMenu}>
                    Sign In
                  </Link>
                  <Link href="/signup" className="rounded-xl bg-emerald-600 py-3 text-center font-bold text-white shadow-lg shadow-emerald-600/20" onClick={toggleMobileMenu}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
      {children}
      <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function ThemeToggle({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      className={`relative flex h-9 w-16 items-center rounded-full p-1 transition-all duration-500 focus:outline-none shadow-lg ${theme === "dark"
          ? "bg-emerald-950 border border-emerald-800"
          : "bg-emerald-50 border border-emerald-100"
        }`}
      aria-label="Toggle theme"
    >
      <div
        className={`flex h-7 w-7 transform items-center justify-center rounded-full shadow-md transition-all duration-500 ${theme === "dark"
            ? "translate-x-7 bg-emerald-800 text-yellow-200 rotate-[360deg]"
            : "translate-x-0 bg-white text-emerald-600"
          }`}
      >
        {theme === "dark" ? (
          <Moon size={16} fill="white" />
        ) : (
          <Sun size={16} fill="currentColor" />
        )}
      </div>

      {/* Background Micro-icons */}
      <div className="absolute inset-0 flex justify-between items-center px-2.5 pointer-events-none opacity-20">
        <Sun size={12} className={theme === "dark" ? "text-emerald-600" : "text-transparent"} />
        <Moon size={12} className={theme === "dark" ? "text-transparent" : "text-emerald-800"} />
      </div>
    </button>
  );
}
