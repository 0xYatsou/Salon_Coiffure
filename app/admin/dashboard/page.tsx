"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, Scissors, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Stats {
    totalBookings: number;
    todayBookings: number;
    totalClients: number;
    totalServices: number;
}

interface RecentBooking {
    id: string;
    date: string;
    client: {
        name: string;
        phone: string;
    };
    service: {
        name: string;
        price: number;
    };
    status: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalBookings: 0,
        todayBookings: 0,
        totalClients: 0,
        totalServices: 0,
    });
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            // Fetch stats
            const statsResponse = await fetch("/api/admin/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData);
            }

            // Fetch recent bookings
            const bookingsResponse = await fetch("/api/bookings?limit=5", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (bookingsResponse.ok) {
                const bookingsData = await bookingsResponse.json();
                setRecentBookings(bookingsData);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: "Réservations totales",
            value: stats.totalBookings,
            icon: Calendar,
            color: "bg-blue-500",
        },
        {
            title: "Aujourd'hui",
            value: stats.todayBookings,
            icon: TrendingUp,
            color: "bg-green-500",
        },
        {
            title: "Clients",
            value: stats.totalClients,
            icon: Users,
            color: "bg-purple-500",
        },
        {
            title: "Services",
            value: stats.totalServices,
            icon: Scissors,
            color: "bg-accent",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-primary-900">
                    Tableau de bord
                </h1>
                <p className="text-primary-600 mt-1">
                    Vue d'ensemble de votre salon
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white rounded-xl shadow-sm border border-primary-100 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-primary-600 font-medium">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold text-primary-900 mt-2">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-100">
                <div className="p-6 border-b border-primary-100">
                    <h2 className="text-xl font-bold text-primary-900">
                        Réservations récentes
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-primary-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                                    Prix
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 uppercase tracking-wider">
                                    Statut
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-100">
                            {recentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-primary-500">
                                        Aucune réservation récente
                                    </td>
                                </tr>
                            ) : (
                                recentBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-primary-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900">
                                            {format(new Date(booking.date), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-primary-900">
                                                {booking.client.name}
                                            </div>
                                            <div className="text-sm text-primary-500">
                                                {booking.client.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900">
                                            {booking.service.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                                            {booking.service.price}€
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`
                                                px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                                                ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {booking.status === 'confirmed' && 'Confirmé'}
                                                {booking.status === 'pending' && 'En attente'}
                                                {booking.status === 'cancelled' && 'Annulé'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
