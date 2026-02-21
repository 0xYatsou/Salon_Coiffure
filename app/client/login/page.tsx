"use client";

import { useState } from "react";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import { showToast } from "@/lib/toast";
import Link from "next/link";

export default function ClientLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/client/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                showToast({ type: "error", description: data.error });
                return;
            }

            showToast({
                type: "success",
                title: `Bienvenue ${data.client.name} !`,
                description: "Connexion réussie",
            });

            // Redirect back
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get("redirect") || "/booking";
            window.location.href = redirect;
        } catch {
            showToast({ type: "error", description: "Erreur de connexion" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-primary-950 dark:to-primary-900 flex items-center justify-center px-4 pt-20">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="font-serif text-3xl font-bold mb-2">Espace Client</h1>
                    <p className="text-primary-600 dark:text-primary-400">
                        Connectez-vous pour réserver plus rapidement
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-primary-900 rounded-2xl shadow-xl p-8 border border-primary-100 dark:border-primary-800">
                    <div className="space-y-4 mb-6">
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
                            <label className="block text-sm font-medium mb-2">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input pl-10"
                                    placeholder="••••••••"
                                    required
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
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-primary-500">
                            Pas encore de compte ?{" "}
                            <Link
                                href="/client/register"
                                className="text-accent font-semibold hover:underline"
                            >
                                Créer un compte
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
