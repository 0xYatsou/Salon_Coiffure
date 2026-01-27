"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, User, Send, CheckCircle } from "lucide-react";
import { showToast } from "@/lib/toast";

interface Review {
    id: string;
    clientName: string;
    rating: number;
    comment: string;
    date: string;
    serviceName?: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rating: 5,
        comment: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Avis de démonstration
    const demoReviews: Review[] = [
        {
            id: "1",
            clientName: "Jean-Pierre M.",
            rating: 5,
            comment: "Excellent salon ! Personnel très professionnel et accueil chaleureux. Ma nouvelle coupe est parfaite.",
            date: "2026-01-20",
            serviceName: "Coupe Homme"
        },
        {
            id: "2",
            clientName: "Thomas L.",
            rating: 5,
            comment: "Meilleur barbier de la ville ! Ambiance top et résultat impeccable. Je recommande vivement.",
            date: "2026-01-18",
            serviceName: "Barbe & Soins"
        },
        {
            id: "3",
            clientName: "Alexandre D.",
            rating: 4,
            comment: "Très bon service, équipe sympathique. Un peu d'attente mais ça vaut le coup !",
            date: "2026-01-15",
            serviceName: "Formule Complète"
        },
        {
            id: "4",
            clientName: "Marc B.",
            rating: 5,
            comment: "Cadre moderne et soigné, coiffeurs à l'écoute. Parfait pour un moment de détente.",
            date: "2026-01-12",
            serviceName: "Coupe Homme"
        },
        {
            id: "5",
            clientName: "Nicolas P.",
            rating: 5,
            comment: "Superbe expérience ! La coloration est exactement ce que je voulais.",
            date: "2026-01-10",
            serviceName: "Coloration"
        },
    ];

    useEffect(() => {
        setTimeout(() => {
            setReviews(demoReviews);
            setLoading(false);
        }, 500);
    }, []);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Simuler l'envoi
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newReview: Review = {
            id: Date.now().toString(),
            clientName: formData.name.split(" ")[0] + " " + (formData.name.split(" ")[1]?.[0] || "") + ".",
            rating: formData.rating,
            comment: formData.comment,
            date: new Date().toISOString().split("T")[0],
        };

        setReviews([newReview, ...reviews]);
        setSubmitting(false);
        setSubmitted(true);
        showToast({ type: "success", title: "Merci !", description: "Votre avis a été publié" });

        setTimeout(() => {
            setShowForm(false);
            setSubmitted(false);
            setFormData({ name: "", email: "", rating: 5, comment: "" });
        }, 2000);
    };

    const StarRating = ({ rating, interactive = false, onChange }: {
        rating: number;
        interactive?: boolean;
        onChange?: (rating: number) => void
    }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => interactive && onChange?.(star)}
                    className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
                >
                    <Star
                        className={`w-6 h-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                </button>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-primary-50">
            {/* Header */}
            <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
                            Avis Clients
                        </h1>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-3xl font-bold">{averageRating}</span>
                        </div>
                        <p className="text-xl text-primary-100">
                            Basé sur {reviews.length} avis vérifiés
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Add Review Button */}
            <section className="py-8 bg-white border-b border-primary-100">
                <div className="container-custom text-center">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-accent inline-flex items-center gap-2"
                    >
                        <Star className="w-5 h-5" />
                        {showForm ? "Fermer" : "Laisser un avis"}
                    </button>
                </div>
            </section>

            {/* Review Form */}
            {showForm && (
                <motion.section
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white border-b border-primary-100"
                >
                    <div className="container-custom py-8 max-w-2xl mx-auto">
                        {submitted ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-primary-900">Merci pour votre avis !</h3>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-medium mb-2">Votre nom *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input"
                                            placeholder="Jean Dupont"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-2">Email (optionnel)</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input"
                                            placeholder="jean@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium mb-2">Votre note *</label>
                                    <StarRating
                                        rating={formData.rating}
                                        interactive
                                        onChange={(rating) => setFormData({ ...formData, rating })}
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-2">Votre avis *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                        className="input"
                                        placeholder="Partagez votre expérience..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-accent w-full flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Publier mon avis
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.section>
            )}

            {/* Reviews List */}
            <section className="py-16">
                <div className="container-custom max-w-4xl">
                    <div className="space-y-6">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-primary-100 p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary-900">{review.clientName}</h4>
                                            {review.serviceName && (
                                                <p className="text-sm text-primary-500">{review.serviceName}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <StarRating rating={review.rating} />
                                        <p className="text-sm text-primary-500 mt-1">
                                            {new Date(review.date).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-primary-700 leading-relaxed">{review.comment}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
