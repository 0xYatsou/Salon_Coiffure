"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage and system preference
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
        } else if (systemPrefersDark) {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="w-14 h-7 bg-primary-200 rounded-full" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-primary-200 dark:bg-primary-700 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Toggle theme"
        >
            <motion.div
                className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
                animate={{ x: theme === "dark" ? 26 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {theme === "dark" ? (
                    <Moon className="w-3 h-3 text-primary-700" />
                ) : (
                    <Sun className="w-3 h-3 text-accent" />
                )}
            </motion.div>
        </button>
    );
}
