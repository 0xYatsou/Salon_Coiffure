"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

type PaymentStep = "details" | "processing" | "success" | "error";

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState<PaymentStep>("details");
    const [formData, setFormData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        name: "",
    });
    const [booking, setBooking] = useState<{
        id: string;
        serviceName: string;
        date: string;
        time: string;
        price: number;
    } | null>(null);

    useEffect(() => {
        // In production, fetch booking details from API
        const bookingId = searchParams.get("bookingId");
        if (bookingId) {
            // Mock booking data
            setBooking({
                id: bookingId,
                serviceName: "Coupe Homme + Barbe",
                date: "Lundi 27 Janvier 2026",
                time: "14:00",
                price: 55,
            });
        }
    }, [searchParams]);

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(" ") : value;
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        return v;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep("processing");

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock: 90% success rate
        if (Math.random() > 0.1) {
            setStep("success");
        } else {
            setStep("error");
        }
    };

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-50 dark:bg-primary-950">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Aucune réservation trouvée</h1>
                    <p className="text-primary-600 dark:text-primary-400 mb-6">
                        Veuillez d'abord effectuer une réservation.
                    </p>
                    <Link href="/booking" className="btn-accent">
                        Réserver maintenant
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-primary-50 dark:bg-primary-950 py-12">
            <div className="container-custom max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-primary-900 rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-900 to-primary-800 dark:from-primary-800 dark:to-primary-700 p-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-6 h-6 text-accent" />
                            <span className="text-sm text-primary-300">Paiement sécurisé</span>
                        </div>
                        <h1 className="font-serif text-3xl font-bold">Finaliser le paiement</h1>
                    </div>

                    <div className="p-8">
                        {/* Order Summary */}
                        <div className="bg-primary-50 dark:bg-primary-800 rounded-xl p-6 mb-8">
                            <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-primary-600 dark:text-primary-400">Prestation</span>
                                    <span className="font-medium">{booking.serviceName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-600 dark:text-primary-400">Date</span>
                                    <span className="font-medium">{booking.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-primary-600 dark:text-primary-400">Heure</span>
                                    <span className="font-medium">{booking.time}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-primary-200 dark:border-primary-700">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-accent">{booking.price}€</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        {step === "details" && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Nom sur la carte
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Jean Dupont"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Numéro de carte
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="input pl-12"
                                            placeholder="4242 4242 4242 4242"
                                            value={formData.cardNumber}
                                            onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                                            maxLength={19}
                                            required
                                        />
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Date d'expiration
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="MM/YY"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: formatExpiry(e.target.value) })}
                                            maxLength={5}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            CVC
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="123"
                                            value={formData.cvc}
                                            onChange={(e) => setFormData({ ...formData, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                                            maxLength={3}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn-accent w-full flex items-center justify-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    Payer {booking.price}€
                                </button>

                                <p className="text-center text-sm text-primary-500 dark:text-primary-400">
                                    🔒 Vos données sont sécurisées et chiffrées
                                </p>
                            </form>
                        )}

                        {/* Processing */}
                        {step === "processing" && (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-6" />
                                <h3 className="text-xl font-bold mb-2">Traitement en cours...</h3>
                                <p className="text-primary-600 dark:text-primary-400">
                                    Veuillez ne pas fermer cette page
                                </p>
                            </div>
                        )}

                        {/* Success */}
                        {step === "success" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Paiement réussi !</h3>
                                <p className="text-primary-600 dark:text-primary-400 mb-6">
                                    Un email de confirmation vous a été envoyé.
                                </p>
                                <Link href="/" className="btn-accent">
                                    Retour à l'accueil
                                </Link>
                            </motion.div>
                        )}

                        {/* Error */}
                        {step === "error" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Échec du paiement</h3>
                                <p className="text-primary-600 dark:text-primary-400 mb-6">
                                    Une erreur est survenue. Veuillez réessayer.
                                </p>
                                <button onClick={() => setStep("details")} className="btn-accent">
                                    Réessayer
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Payment Methods */}
                <div className="mt-6 flex items-center justify-center gap-4 text-primary-400">
                    <span className="text-sm">Paiements acceptés</span>
                    <div className="flex gap-2">
                        <div className="bg-white dark:bg-primary-800 px-3 py-1 rounded text-sm font-medium">VISA</div>
                        <div className="bg-white dark:bg-primary-800 px-3 py-1 rounded text-sm font-medium">Mastercard</div>
                        <div className="bg-white dark:bg-primary-800 px-3 py-1 rounded text-sm font-medium">CB</div>
                    </div>
                </div>
            </div>
        </main>
    );
}
