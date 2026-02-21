"use client";

import { useState } from "react";
import { Mail, Lock, User, Phone, Loader2, UserPlus } from "lucide-react";
import { showToast } from "@/lib/toast";
import Link from "next/link";

export default function ClientRegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast({ type: "error", description: "Les mots de passe ne correspondent pas" });
            return;
        }

        if (password.length < 6) {
            showToast({ type: "error", description: "Le mot de passe doit contenir au moins 6 caractères" });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/client/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, phone, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                showToast({ type: "error", description: data.error });
                return;
            }

            showToast({
                type: "success",
                title: "Compte créé !",
                description: `Bienvenue ${data.client.name}`,
            });

            // Redirect back
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get("redirect") || "/booking";
            window.location.href = redirect;
        } catch {
            showToast({ type: "error", description: "Erreur lors de l'inscription" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-primary-950 dark:to-primary-900 flex items-center justify-center px-4 pt-20">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="font-serif text-3xl font-bold mb-2">Créer un compte</h1>
                    <p className="text-primary-600 dark:text-primary-400">
                        Réservez plus rapidement et retrouvez votre historique
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-primary-900 rounded-2xl shadow-xl p-8 border border-primary-100 dark:border-primary-800">
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nom complet</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input pl-10"
                                    placeholder="Jean Dupont"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input pl-10"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="input pl-10"
                                    placeholder="06 12 34 56 78"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input pl-10"
                                    placeholder="Min. 6 caractères"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input pl-10"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-accent w-full flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? "Création..." : "Créer mon compte"}
                    </button>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-primary-500">
                            Déjà un compte ?{" "}
                            <Link
                                href={`/client/login${typeof window !== 'undefined' ? window.location.search : ''}`}
                                className="text-accent font-semibold hover:underline"
                            >
                                Se connecter
                            </Link>
                        </p>
                        <Link
                            href="/booking"
                            className="text-primary-500 hover:text-primary-700 inline-block mt-3"
                        >
                            ← Continuer en tant qu'invité
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
