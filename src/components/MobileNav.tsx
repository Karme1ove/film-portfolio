'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNav = () => {
    const pathname = usePathname();
    const isInfo = pathname === '/info';

    return (
        // ZMIANY:
        // 1. pb-[env(safe-area-inset-bottom)] -> odsuwa treść od paska iPhone'a
        // 2. bg-black/80 + backdrop-blur-xl -> efekt szkła zamiast płaskiego koloru
        // 3. usunięte h-16 ze stylów głównych, wysokość nadajemy linkom
        <nav className="fixed bottom-0 left-0 w-full z-50 flex lg:hidden border-t border-white/10 bg-black/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] transition-all duration-300">

            {/* Przycisk LEWY: FILMY */}
            <Link
                href="/"
                // Dodane h-16 tutaj, żeby przycisk miał wysokość, a padding iPhone'a był "pod nim"
                className={`flex-1 h-16 flex items-center justify-center font-mono text-xs tracking-[0.2em] transition-colors ${!isInfo ? 'text-red-700 bg-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                FILMY
            </Link>

            {/* Pionowa Kreska */}
            <div className="w-px h-16 bg-white/10" />

            {/* Przycisk PRAWY: INFO */}
            <Link
                href="/info"
                className={`flex-1 h-16 flex items-center justify-center font-mono text-xs tracking-[0.2em] transition-colors ${isInfo ? 'text-red-700 bg-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                INFO
            </Link>
        </nav>
    );
};