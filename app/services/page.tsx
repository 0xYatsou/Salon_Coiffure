"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => setServices(data))
            .catch((error) => console.error("Error loading services:", error))
            .finally(() => setLoading(false));
    }, []);

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
                            Nos Prestations
                        </h1>
                        <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                            Des services sur-mesure pour sublimer votre style
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            // Map service names to images
                            const imageMap: { [key: string]: string } = {
                                "Coupe Homme + Barbe": "/images/service-coupe.png",
                                "Coupe Homme": "/images/service-coupe.png",
                                "Barbe": "/images/service-barbe.png",
                                "Coloration": "/images/service-coloration.png",
                                "Formule Complète": "/images/service-complet.png",
                            };
                            const serviceImage = imageMap[service.name] || "/images/service-coupe.png";

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={serviceImage}
                                            alt={service.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="font-serif text-2xl font-bold text-white drop-shadow-lg">
                                                {service.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-primary-600 mb-6 min-h-[48px]">
                                            {service.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-primary-100">
                                            <div>
                                                <div className="text-3xl font-bold text-accent">
                                                    {service.price}€
                                                </div>
                                                <div className="text-sm text-primary-500 flex items-center mt-1">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {service.duration} min
                                                </div>
                                            </div>

                                            <Link
                                                href={`/booking?service=${service.id}`}
                                                className="btn-accent text-sm px-4 py-2"
                                            >
                                                Réserver
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {services.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-primary-600 text-lg">
                                Aucun service disponible pour le moment.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="container-custom text-center">
                    <h2 className="font-serif text-4xl font-bold mb-6">
                        Prêt à prendre rendez-vous ?
                    </h2>
                    <p className="text-xl text-primary-600 mb-8 max-w-2xl mx-auto">
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
