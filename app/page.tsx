"use client";

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import ReviewsGrid from "@/components/ReviewsGrid";

export default function HomePage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/hero-banner.png')" }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-primary-700/60" />

                <div className="container-custom relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
                            L'Art de la Coiffure
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-2xl mx-auto drop-shadow-md">
                            Expérience premium, service d'excellence
                        </p>

                    </motion.div>
                </div>
            </section>

            {/* Services Preview */}
            <section className="py-20 bg-white dark:bg-primary-950">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Nos Prestations</h2>
                        <p className="text-primary-600 text-lg max-w-2xl mx-auto">
                            Des services sur-mesure pour sublimer votre style
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Coupe Homme",
                                description: "Coupe personnalisée avec consultation",
                                price: "35€",
                                duration: "30 min",
                                image: "/images/service-coupe.png",
                            },
                            {
                                title: "Barbe & Soins",
                                description: "Taille et entretien de la barbe",
                                price: "25€",
                                duration: "20 min",
                                image: "/images/service-barbe.png",
                            },
                            {
                                title: "Formule Complète",
                                description: "Coupe + Barbe + Soins",
                                price: "55€",
                                duration: "50 min",
                                image: "/images/service-complet.png",
                            },
                        ].map((service, index) => (
                            <Link href="/booking" key={service.title} className="block">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group overflow-hidden rounded-xl bg-white dark:bg-primary-900 shadow-md hover:shadow-xl dark:shadow-none dark:border dark:border-primary-800 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-serif text-2xl font-bold mb-2 text-primary-900 dark:text-white">{service.title}</h3>
                                        <p className="text-primary-600 dark:text-primary-300 mb-4">{service.description}</p>
                                        <div className="flex justify-between items-center pt-4 border-t border-primary-100">
                                            <span className="text-2xl font-bold text-accent">{service.price}</span>
                                            <span className="text-sm text-primary-500 dark:text-primary-400 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {service.duration}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/services" className="btn-primary">
                            Voir toutes les prestations
                        </Link>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-20 bg-primary-50 dark:bg-primary-900/30">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Avis Clients</h2>
                        <p className="text-primary-600 dark:text-primary-400 text-lg max-w-2xl mx-auto">
                            Ce que nos clients disent de nous
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <ReviewsGrid />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-50 dark:bg-primary-900/50">
                <div className="container-custom text-center">
                    <h2 className="font-serif text-4xl font-bold mb-6 text-primary-900 dark:text-white">Prêt à prendre rendez-vous ?</h2>
                    <p className="text-xl text-primary-600 dark:text-primary-300 mb-8 max-w-2xl mx-auto">
                        Réservez votre créneau en quelques clics
                    </p>
                    <Link href="/booking" className="btn-accent inline-flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Réserver maintenant
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary-900 text-white py-12">
                <div className="container-custom">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-serif text-2xl font-bold mb-4">Salon Premium</h3>
                            <p className="text-primary-300">
                                L'excellence au service de votre style
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Horaires</h4>
                            <p className="text-primary-300">
                                Lundi - Samedi: 9h - 19h<br />
                                Dimanche: Fermé
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Contact</h4>
                            <p className="text-primary-300">
                                123 Rue Example<br />
                                75001 Paris<br />
                                01 23 45 67 89
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-primary-800 mt-8 pt-8 text-center text-primary-400">
                        <p>&copy; 2024 Salon Premium. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
