"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Clock, User, Phone, Mail, Search, Filter,
    Check, X, MoreHorizontal, ChevronLeft, ChevronRight,
    Download, Eye, Edit2, Trash2, RefreshCw
} from "lucide-react";
import { format, parseISO, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { showToast } from "@/lib/toast";

interface Booking {
    id: string;
    date: string;
    client: {
        id: string;
        name: string;
        phone: string;
        email: string;
    };
    service: {
        id: string;
        name: string;
        price: number;
        duration: number;
    };
    status: "pending" | "confirmed" | "cancelled" | "completed";
    notes?: string;
    createdAt: string;
}

const statusConfig = {
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    confirmed: { label: "Confirmé", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    cancelled: { label: "Annulé", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    completed: { label: "Terminé", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
};

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(new Date());

    // Mock data
    useEffect(() => {
        const mockBookings: Booking[] = [
            {
                id: "1",
                date: "2026-01-27T10:00:00",
                client: { id: "c1", name: "Jean Dupont", phone: "06 12 34 56 78", email: "jean@email.com" },
                service: { id: "s1", name: "Coupe Homme", price: 35, duration: 30 },
                status: "confirmed",
                createdAt: "2026-01-25T14:00:00",
            },
            {
                id: "2",
                date: "2026-01-27T11:00:00",
                client: { id: "c2", name: "Pierre Martin", phone: "06 98 76 54 32", email: "pierre@email.com" },
                service: { id: "s2", name: "Barbe & Soins", price: 25, duration: 20 },
                status: "pending",
                createdAt: "2026-01-26T09:00:00",
            },
            {
                id: "3",
                date: "2026-01-27T14:00:00",
                client: { id: "c3", name: "Thomas Leroy", phone: "06 11 22 33 44", email: "thomas@email.com" },
                service: { id: "s3", name: "Coupe + Barbe", price: 55, duration: 50 },
                status: "confirmed",
                createdAt: "2026-01-24T16:30:00",
            },
            {
                id: "4",
                date: "2026-01-28T09:30:00",
                client: { id: "c4", name: "Marc Bernard", phone: "06 55 66 77 88", email: "marc@email.com" },
                service: { id: "s1", name: "Coupe Homme", price: 35, duration: 30 },
                status: "cancelled",
                createdAt: "2026-01-25T10:00:00",
            },
            {
                id: "5",
                date: "2026-01-28T15:00:00",
                client: { id: "c5", name: "Nicolas Petit", phone: "06 99 88 77 66", email: "nicolas@email.com" },
                service: { id: "s4", name: "Coloration", price: 45, duration: 60 },
                status: "confirmed",
                createdAt: "2026-01-26T11:00:00",
            },
        ];

        setTimeout(() => {
            setBookings(mockBookings);
            setLoading(false);
        }, 500);
    }, []);

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.client.phone.includes(searchQuery) ||
            booking.service.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = async (bookingId: string, newStatus: Booking["status"]) => {
        setBookings(prev =>
            prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
        );
        showToast({ type: "success", title: "Statut mis à jour", description: `Réservation ${statusConfig[newStatus].label.toLowerCase()}` });
    };

    const handleDelete = async (bookingId: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
            setBookings(prev => prev.filter(b => b.id !== bookingId));
            showToast({ type: "success", title: "Supprimé", description: "La réservation a été supprimée" });
        }
    };

    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-white">
                        Gestion des Réservations
                    </h1>
                    <p className="text-primary-600 dark:text-primary-400 mt-1">
                        {filteredBookings.length} réservation(s)
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setLoading(true)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Actualiser
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Exporter
                    </button>
                </div>
            </div>

            {/* Week Navigation */}
            <div className="bg-white dark:bg-primary-900 rounded-xl p-4 shadow-sm border border-primary-100 dark:border-primary-800">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                        className="p-2 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <h3 className="font-bold text-lg">
                            {format(weekStart, "d MMMM", { locale: fr })} - {format(weekEnd, "d MMMM yyyy", { locale: fr })}
                        </h3>
                    </div>
                    <button
                        onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                        className="p-2 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-primary-900 rounded-xl p-4 shadow-sm border border-primary-100 dark:border-primary-800">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un client, téléphone, service..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {["all", "pending", "confirmed", "cancelled", "completed"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                        ? "bg-accent text-white"
                                        : "bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700"
                                    }`}
                            >
                                {status === "all" ? "Tous" : statusConfig[status as keyof typeof statusConfig].label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white dark:bg-primary-900 rounded-xl shadow-sm border border-primary-100 dark:border-primary-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-primary-50 dark:bg-primary-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    Date & Heure
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    Prix
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-100 dark:divide-primary-800">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-primary-500">
                                        Aucune réservation trouvée
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <motion.tr
                                        key={booking.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-primary-50 dark:hover:bg-primary-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-accent" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {format(parseISO(booking.date), "EEEE d MMM", { locale: fr })}
                                                    </div>
                                                    <div className="text-sm text-primary-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {format(parseISO(booking.date), "HH:mm")}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-700 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{booking.client.name}</div>
                                                    <div className="text-sm text-primary-500">{booking.client.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{booking.service.name}</div>
                                            <div className="text-sm text-primary-500">{booking.service.duration} min</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-accent">{booking.service.price}€</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[booking.status].color}`}>
                                                {statusConfig[booking.status].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {booking.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                                                            className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                            title="Confirmer"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                                                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                            title="Annuler"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                                                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg transition-colors"
                                                    title="Voir détails"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {showModal && selectedBooking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-primary-900 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Détails de la réservation</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-800 rounded-xl">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <div className="font-bold">{selectedBooking.client.name}</div>
                                        <div className="text-sm text-primary-500">{selectedBooking.client.email}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-primary-50 dark:bg-primary-800 rounded-xl">
                                        <div className="text-sm text-primary-500 mb-1">Service</div>
                                        <div className="font-bold">{selectedBooking.service.name}</div>
                                    </div>
                                    <div className="p-4 bg-primary-50 dark:bg-primary-800 rounded-xl">
                                        <div className="text-sm text-primary-500 mb-1">Prix</div>
                                        <div className="font-bold text-accent">{selectedBooking.service.price}€</div>
                                    </div>
                                </div>

                                <div className="p-4 bg-primary-50 dark:bg-primary-800 rounded-xl">
                                    <div className="flex items-center gap-2 text-sm text-primary-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Date & Heure
                                    </div>
                                    <div className="font-bold">
                                        {format(parseISO(selectedBooking.date), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-800 rounded-xl">
                                    <Phone className="w-5 h-5 text-primary-500" />
                                    <a href={`tel:${selectedBooking.client.phone}`} className="font-medium hover:text-accent">
                                        {selectedBooking.client.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => { handleStatusChange(selectedBooking.id, "completed"); setShowModal(false); }}
                                    className="btn-accent flex-1"
                                >
                                    Marquer terminé
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Fermer
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
