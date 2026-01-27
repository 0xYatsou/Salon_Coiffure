"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    LogOut,
    Menu,
    X,
    MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Vérifier l'authentification
        const checkAuth = () => {
            try {
                const token = localStorage.getItem("adminToken");
                console.log("AdminLayout: Check Auth, Token exists?", !!token);

                if (!token) {
                    if (pathname !== "/admin/login") {
                        console.log("AdminLayout: No token, redirecting to login");
                        router.replace("/admin/login");
                    }
                } else {
                    console.log("AdminLayout: Token found, setting authenticated");
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("AdminLayout: Error reading token", error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };

    // Si on est sur la page de login, pas de layout
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-primary-600">Chargement...</p>
                </div>
            </div>
        );
    }

    // Si pas authentifié, ne rien afficher (redirection en cours)
    if (!isAuthenticated) {
        return null;
    }

    const navigation = [
        {
            name: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Réservations",
            href: "/admin/bookings",
            icon: Calendar,
        },
        {
            name: "Services",
            href: "/admin/services",
            icon: Scissors,
        },
        {
            name: "Commentaires",
            href: "/admin/reviews",
            icon: MessageSquare,
        },
    ];

    return (
        <div className="min-h-screen bg-primary-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full w-64 bg-primary-900 text-white
                    transform transition-transform duration-300 ease-in-out
                    lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-primary-800">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                                <Scissors className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="font-bold">Admin</h2>
                                <p className="text-xs text-primary-400">Salon de Coiffure</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-primary-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center space-x-3 px-4 py-3 rounded-lg
                                        transition-colors
                                        ${isActive
                                            ? "bg-accent text-white"
                                            : "text-primary-300 hover:bg-primary-800 hover:text-white"
                                        }
                                    `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-primary-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-primary-300 hover:bg-primary-800 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar */}
                <header className="bg-white border-b border-primary-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-4 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-primary-600 hover:text-primary-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-4 ml-auto">
                            <Link
                                href="/"
                                target="_blank"
                                className="text-sm text-primary-600 hover:text-primary-900"
                            >
                                Voir le site →
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
