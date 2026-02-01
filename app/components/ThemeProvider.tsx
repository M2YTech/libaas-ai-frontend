"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_ENDPOINTS } from "../config/api";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    const applyTheme = (newTheme: Theme) => {
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const syncWithBackend = useCallback(async (newTheme: Theme) => {
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        if (userId && userId !== "null" && userId !== "undefined") {
            try {
                await fetch(API_ENDPOINTS.auth.updateTheme(userId), {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ theme: newTheme }),
                });
                console.log("[ThemeProvider] Synced theme with backend:", newTheme);
            } catch (err) {
                console.error("[ThemeProvider] Failed to sync theme with backend:", err);
            }
        }
    }, []);

    useEffect(() => {
        // 1. Determine initial theme
        let initialTheme: Theme = "light";
        try {
            const storedTheme = localStorage.getItem("theme") as Theme | null;
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            initialTheme = storedTheme || systemTheme;
        } catch (e) {
            console.warn("[ThemeProvider] LocalStorage access failed:", e);
        }

        // 2. Apply theme to HTML element
        setTheme(initialTheme);
        applyTheme(initialTheme);
        setMounted(true);

        // 3. Multi-tab synchronization (Storage Event)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
                const newTheme = e.newValue as Theme;
                setTheme(newTheme);
                applyTheme(newTheme);
                console.log("[ThemeProvider] Synced from other tab:", newTheme);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);

        try {
            localStorage.setItem("theme", newTheme);
        } catch (e) {
            console.error("[ThemeProvider] Failed to save theme to localStorage:", e);
        }

        // Persist to backend
        syncWithBackend(newTheme);
        console.log("[ThemeProvider] Toggled theme to:", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
            <div className={mounted ? "" : "invisible"}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
