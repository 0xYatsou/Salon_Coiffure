"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ReviewsGrid() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch("/api/reviews");
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

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="col-span-full flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="col-span-full text-center py-10 text-primary-500 italic">
                Aucun avis pour le moment
            </div>
        );
    }

    return (
        <>
            {reviews.map((review, index) => (
                <motion.div
                    key={review.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-primary-900/50 p-6 rounded-2xl shadow-sm border border-primary-100 dark:border-primary-800"
                >
                    <div className="flex items-center space-x-1 text-orange-400 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-primary-200'}`}
                            />
                        ))}
                    </div>
                    <p className="text-primary-700 dark:text-primary-300 mb-6 italic">
                        "{review.comment}"
                    </p>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                            <span className="text-primary-700 dark:text-primary-300 font-bold uppercase">
                                {review.name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h4 className="font-bold text-primary-900 dark:text-white">{review.name}</h4>
                            <p className="text-xs text-primary-500">Client Vérifié</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </>
    );
}
