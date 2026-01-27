"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
    id: string;
    url: string;
    title: string;
    description: string;
    category: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [filter, setFilter] = useState("all");

    // Images de démonstration (à remplacer par l'API)
    const demoImages: GalleryImage[] = [
        { id: "1", url: "/images/service-coupe.png", title: "Coupe moderne", description: "Coupe tendance avec dégradé", category: "coupe" },
        { id: "2", url: "/images/service-barbe.png", title: "Barbe sculptée", description: "Entretien barbe premium", category: "barbe" },
        { id: "3", url: "/images/service-coloration.png", title: "Coloration", description: "Coloration naturelle", category: "coloration" },
        { id: "4", url: "/images/service-complet.png", title: "Formule VIP", description: "Service complet premium", category: "coupe" },
        { id: "5", url: "/images/hero-banner.png", title: "Notre salon", description: "Intérieur moderne", category: "salon" },
        { id: "6", url: "/images/service-barbe.png", title: "Rasage traditionnel", description: "Au rasoir coupe-chou", category: "barbe" },
    ];

    useEffect(() => {
        // Simuler le chargement
        setTimeout(() => {
            setImages(demoImages);
            setLoading(false);
        }, 500);
    }, []);

    const categories = [
        { id: "all", label: "Tout" },
        { id: "coupe", label: "Coupes" },
        { id: "barbe", label: "Barbes" },
        { id: "coloration", label: "Colorations" },
        { id: "salon", label: "Salon" },
    ];

    const filteredImages = filter === "all"
        ? images
        : images.filter(img => img.category === filter);

    const openLightbox = (image: GalleryImage) => {
        setSelectedImage(image);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = "auto";
    };

    const navigateImage = (direction: "prev" | "next") => {
        if (!selectedImage) return;
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        let newIndex;
        if (direction === "prev") {
            newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
        }
        setSelectedImage(filteredImages[newIndex]);
    };

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
                            Notre Galerie
                        </h1>
                        <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                            Découvrez nos réalisations et laissez-vous inspirer
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter Buttons */}
            <section className="py-8 bg-white border-b border-primary-100">
                <div className="container-custom">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${filter === cat.id
                                        ? "bg-accent text-white"
                                        : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredImages.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                                onClick={() => openLightbox(image)}
                            >
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-white font-bold text-lg">{image.title}</h3>
                                        <p className="text-white/80 text-sm">{image.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateImage("prev"); }}
                        className="absolute left-4 text-white hover:text-accent transition-colors"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateImage("next"); }}
                        className="absolute right-4 text-white hover:text-accent transition-colors"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    <div
                        className="max-w-4xl max-h-[80vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="max-w-full max-h-[70vh] object-contain rounded-lg"
                        />
                        <div className="text-center mt-4">
                            <h3 className="text-white font-bold text-xl">{selectedImage.title}</h3>
                            <p className="text-white/70">{selectedImage.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
