import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/MobileNav"; // <--- IMPORT

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
    style: ['normal', 'italic']
});
const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono"
});

export const metadata: Metadata = {
    title: "Sergiusz Brasławski | Film Portfolio",
    description: "Portfolio reżyserskie i scenopisarskie.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl">
        <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} bg-[#050505] text-[#dcdcdc] antialiased`}>
        {children}
        <MobileNav /> {/* <--- TU JEST NASZ PASEK MOBILNY */}
        </body>
        </html>
    );
}