"use client";

import { useTheme } from "@/lib/theme-context";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

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
