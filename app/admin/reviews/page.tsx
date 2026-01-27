"use client";

import { useEffect, useState } from "react";
import {
    MessageSquare,
    Trash2,
    CheckCircle,
    XCircle,
    Star,
    Loader2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    isPublished: boolean;
    createdAt: string;
}

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch("/api/admin/reviews", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        setActionLoading(id);
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch("/api/admin/reviews", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id, isPublished: !currentStatus }),
            });

            if (response.ok) {
                setReviews(reviews.map(r =>
                    r.id === id ? { ...r, isPublished: !currentStatus } : r
                ));
            }
        } catch (error) {
            console.error("Error updating review:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;

        setActionLoading(id);
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/admin/reviews?id=${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setReviews(reviews.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900">
                        Gestion des avis
                    </h1>
                    <p className="text-primary-600 mt-1">
                        Modérez les commentaires de vos clients
                    </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-primary-100 flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    <span className="font-bold text-primary-900">{reviews.length}</span>
                    <span className="text-primary-600 uppercase text-xs font-semibold tracking-wider">Avis au total</span>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-primary-50 border-b border-primary-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">
                                    Client & Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">
                                    Note
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">
                                    Commentaire
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-primary-600 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-primary-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-100">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-primary-500 italic">
                                        Aucun avis pour le moment
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-primary-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-primary-900">{review.name}</div>
                                            <div className="text-xs text-primary-500">
                                                {format(new Date(review.createdAt), "dd MMMM yyyy", { locale: fr })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-1 text-orange-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-primary-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-primary-700 max-w-xs truncate">
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`
                                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${review.isPublished
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'}
                                            `}>
                                                {review.isPublished ? 'Publié' : 'En attente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => togglePublish(review.id, review.isPublished)}
                                                    disabled={actionLoading === review.id}
                                                    className={`
                                                        p-2 rounded-lg border transition-all
                                                        ${review.isPublished
                                                            ? 'border-yellow-200 text-yellow-600 hover:bg-yellow-50'
                                                            : 'border-green-200 text-green-600 hover:bg-green-50'}
                                                    `}
                                                    title={review.isPublished ? "Masquer l'avis" : "Publier l'avis"}
                                                >
                                                    {review.isPublished ? (
                                                        <XCircle className="w-5 h-5" />
                                                    ) : (
                                                        <CheckCircle className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => deleteReview(review.id)}
                                                    disabled={actionLoading === review.id}
                                                    className="p-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Supprimer l'avis"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
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
