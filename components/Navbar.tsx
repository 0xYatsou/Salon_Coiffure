"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors, Calendar, Image, Star, Info, Phone } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
    { href: "/", label: "Accueil", icon: Scissors },
    { href: "/services", label: "Prestations", icon: Scissors },
    { href: "/booking", label: "Réserver", icon: Calendar },
    { href: "/gallery", label: "Galerie", icon: Image },
    { href: "/reviews", label: "Avis", icon: Star },
    { href: "/about", label: "À propos", icon: Info },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-primary-900/80 backdrop-blur-lg border-b border-primary-100 dark:border-primary-800">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Scissors className="w-8 h-8 text-accent" />
                        <span className="font-serif text-xl font-bold text-primary-900 dark:text-white">
                            Salon Premium
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-accent ${pathname === link.href
                                        ? "text-accent"
                                        : "text-primary-600 dark:text-primary-300"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <ThemeToggle />
                        <Link href="/booking" className="btn-accent text-sm px-4 py-2">
                            Réserver
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-primary-700 dark:text-white"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-primary-900 border-t border-primary-100 dark:border-primary-800"
                    >
                        <div className="container-custom py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${pathname === link.href
                                            ? "bg-accent/10 text-accent"
                                            : "text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-800"
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/booking"
                                onClick={() => setIsOpen(false)}
                                className="btn-accent w-full text-center block mt-4"
                            >
                                Réserver maintenant
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
