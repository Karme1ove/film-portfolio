'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNav = () => {
    const pathname = usePathname();
    // Sprawdzamy, czy jesteśmy w sekcji INFO (żeby podświetlić przycisk)
    const isInfo = pathname === '/info';

    return (
        <nav className="fixed bottom-0 left-0 w-full h-16 bg-[#050505] border-t border-white/10 z-50 flex lg:hidden">

            {/* Przycisk LEWY: FILMY */}
            <Link
                href="/"
                className={`flex-1 flex items-center justify-center font-mono text-xs tracking-[0.2em] transition-colors ${!isInfo ? 'text-red-700 bg-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                FILMY
            </Link>

            {/* Pionowa Kreska */}
            <div className="w-px h-full bg-white/10" />

            {/* Przycisk PRAWY: INFO */}
            <Link
                href="/info"
                className={`flex-1 flex items-center justify-center font-mono text-xs tracking-[0.2em] transition-colors ${isInfo ? 'text-red-700 bg-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                INFO
            </Link>
        </nav>
    );
};