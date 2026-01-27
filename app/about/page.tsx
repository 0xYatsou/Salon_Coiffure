"use client";

import { motion } from "framer-motion";
import { Scissors, Award, Users, Clock, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

const team = [
    {
        name: "Pierre Martin",
        role: "Fondateur & Coiffeur Expert",
        experience: "15 ans d'expérience",
        image: "/images/service-coupe.png",
        specialties: ["Coupes modernes", "Dégradés", "Styling"],
    },
    {
        name: "Thomas Dubois",
        role: "Barbier Senior",
        experience: "10 ans d'expérience",
        image: "/images/service-barbe.png",
        specialties: ["Barbes", "Rasage traditionnel", "Soins"],
    },
    {
        name: "Lucas Bernard",
        role: "Coloriste",
        experience: "8 ans d'expérience",
        image: "/images/service-coloration.png",
        specialties: ["Colorations", "Mèches", "Balayages"],
    },
];

const values = [
    {
        icon: Scissors,
        title: "Excellence",
        description: "Nous visons la perfection dans chaque coupe, chaque geste compte.",
    },
    {
        icon: Users,
        title: "Écoute",
        description: "Votre style, vos envies sont au cœur de notre approche personnalisée.",
    },
    {
        icon: Award,
        title: "Expertise",
        description: "Des professionnels formés aux dernières techniques et tendances.",
    },
    {
        icon: Clock,
        title: "Ponctualité",
        description: "Respect de votre temps avec un service efficace et soigné.",
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-primary-50">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/hero-banner.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-900/60" />
                <div className="container-custom relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
                            Notre Histoire
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                            Depuis 2010, nous sublimons le style masculin avec passion et expertise
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="font-serif text-4xl font-bold mb-6">
                                L'Art du Style Masculin
                            </h2>
                            <div className="space-y-4 text-primary-700 leading-relaxed">
                                <p>
                                    Fondé en 2010 par Pierre Martin, Salon Premium est né d'une vision simple :
                                    offrir aux hommes un espace dédié où l'excellence du service rencontre
                                    l'art de la coiffure traditionnelle.
                                </p>
                                <p>
                                    Au fil des années, nous avons su allier les techniques classiques du
                                    barbier aux tendances les plus modernes, créant ainsi une expérience
                                    unique pour chaque client.
                                </p>
                                <p>
                                    Aujourd'hui, avec une équipe de 6 professionnels passionnés, nous
                                    accueillons plus de 500 clients par mois dans notre salon au cœur de Paris.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <img
                                src="/images/hero-banner.png"
                                alt="Notre salon"
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 rounded-xl shadow-lg">
                                <div className="text-4xl font-bold">15+</div>
                                <div className="text-sm">Années d'expérience</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-primary-50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl font-bold mb-4">Nos Valeurs</h2>
                        <p className="text-primary-600 text-lg max-w-2xl mx-auto">
                            Ce qui nous guide au quotidien
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <value.icon className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                                <p className="text-primary-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl font-bold mb-4">Notre Équipe</h2>
                        <p className="text-primary-600 text-lg max-w-2xl mx-auto">
                            Des professionnels passionnés à votre service
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-xl mb-6">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-white font-bold text-xl">{member.name}</h3>
                                        <p className="text-white/80">{member.role}</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-primary-600 mb-3">{member.experience}</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {member.specialties.map((specialty) => (
                                            <span
                                                key={specialty}
                                                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-20 bg-primary-900 text-white">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="font-serif text-4xl font-bold mb-8">Nous Trouver</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold mb-1">Adresse</h4>
                                        <p className="text-primary-300">
                                            123 Rue Example<br />
                                            75001 Paris, France
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold mb-1">Téléphone</h4>
                                        <p className="text-primary-300">01 23 45 67 89</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold mb-1">Email</h4>
                                        <p className="text-primary-300">contact@salonpremium.fr</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold mb-1">Horaires</h4>
                                        <p className="text-primary-300">
                                            Lundi - Vendredi: 9h - 19h<br />
                                            Samedi: 9h - 18h<br />
                                            Dimanche: Fermé
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                                    <Instagram className="w-6 h-6" />
                                </a>
                                <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                                    <Facebook className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <h3 className="font-bold text-2xl mb-6">Réservez maintenant</h3>
                            <p className="text-primary-200 mb-6">
                                Prenez rendez-vous en quelques clics et profitez de notre expertise.
                            </p>
                            <Link href="/booking" className="btn-accent w-full text-center block">
                                Réserver un créneau
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
