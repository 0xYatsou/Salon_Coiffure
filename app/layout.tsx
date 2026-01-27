import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Salon Premium - Coiffure & Barbier",
    description: "Salon de coiffure premium pour hommes. Réservez votre rendez-vous en ligne pour une coupe, barbe ou coloration.",
    keywords: ["salon de coiffure", "barbier", "coupe homme", "barbe", "Paris"],
    openGraph: {
        title: "Salon Premium - Coiffure & Barbier",
        description: "L'art de la coiffure masculine. Réservez en ligne.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
            <body className="font-sans bg-white dark:bg-primary-950 text-primary-900 dark:text-white transition-colors">
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
