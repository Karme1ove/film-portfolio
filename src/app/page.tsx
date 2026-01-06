import { NoiseOverlay } from '@/components/NoiseOverlay';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen w-full bg-[#050505] text-[#dcdcdc] relative selection:bg-red-900/30 pb-20 lg:pb-0">
            {/* pb-20 dodane, żeby treść nie wjeżdżała pod dolny pasek mobilny */}

            {/* LEWY PASEK (Tylko Desktop) */}
            <aside className="fixed top-0 left-0 w-[80px] h-full hidden lg:flex flex-col justify-between items-center py-12 border-r border-white/10 z-40 bg-[#050505]">
                <div className="rotate-90 origin-center whitespace-nowrap text-[10px] tracking-[0.2em] opacity-60 font-mono mt-12">
                    ARCHIWUM GŁÓWNE
                </div>
                <div className="font-mono text-xs opacity-60">2026</div>
            </aside>

            {/* ŚRODEK - Lista Filmów */}
            {/* ZMIANA: Usunąłem sztywny flex-center na mobile. Teraz jest padding px-4 dla telefonów */}
            <div className="relative flex flex-col items-center justify-start lg:justify-center min-h-screen lg:mx-[80px] px-4 py-12 lg:p-8">
                <NoiseOverlay />

                <div className="z-10 flex flex-col items-center gap-8 w-full max-w-4xl">

                    <div className="font-mono text-[10px] lg:text-xs text-red-800/60 tracking-[0.3em] lg:tracking-[0.5em] mb-4 text-center">
                        KATALOG PROJEKTÓW
                    </div>

                    <nav className="flex flex-col items-center w-full gap-4 lg:gap-6">

                        {/* FILM 1 */}
                        <Link href="/obciazeni-zlem" className="group w-full border-t border-b border-white/10 py-8 lg:py-10 flex flex-col md:flex-row justify-between items-center hover:bg-white/5 transition-all duration-500 cursor-pointer text-center md:text-left">
                            <div className="flex flex-col gap-2">
                                <span className="font-mono text-[10px] text-zinc-600 tracking-widest group-hover:text-red-700 transition-colors">FILM. 01</span>
                                {/* ZMIANA: Mniejsza czcionka na mobile (3xl) */}
                                <h2 className="font-serif italic text-3xl md:text-5xl text-zinc-300 group-hover:text-white transition-colors">
                                    Obciążeni Złem
                                </h2>
                            </div>
                            <div className="mt-4 md:mt-0 font-mono text-[10px] text-zinc-500 tracking-widest lg:opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-0 lg:translate-x-4 lg:group-hover:translate-x-0">
                                [ OTWÓRZ ZAPIS ] →
                            </div>
                        </Link>

                        {/* FILM 2 */}
                        <Link href="/welcome-to-my-world" className="group w-full border-t border-b border-white/10 py-8 lg:py-10 flex flex-col md:flex-row justify-between items-center hover:bg-white/5 transition-all duration-500 cursor-pointer text-center md:text-left">
                            <div className="flex flex-col gap-2">
                                <span className="font-mono text-[10px] text-zinc-600 tracking-widest group-hover:text-red-700 transition-colors">FILM. 02</span>
                                <h2 className="font-serif italic text-3xl md:text-5xl text-zinc-300 group-hover:text-white transition-colors">
                                    Welcome To My World
                                </h2>
                            </div>
                            <div className="mt-4 md:mt-0 font-mono text-[10px] text-zinc-500 tracking-widest lg:opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-0 lg:translate-x-4 lg:group-hover:translate-x-0">
                                [ OTWÓRZ ZAPIS ] →
                            </div>
                        </Link>

                        {/* FILM 3 */}
                        <Link href="/gatsbys-chain" className="group w-full border-t border-b border-white/10 py-8 lg:py-10 flex flex-col md:flex-row justify-between items-center hover:bg-white/5 transition-all duration-500 cursor-pointer text-center md:text-left">
                            <div className="flex flex-col gap-2">
                                <span className="font-mono text-[10px] text-zinc-600 tracking-widest group-hover:text-red-700 transition-colors">FILM. 03</span>
                                <h2 className="font-serif italic text-3xl md:text-5xl text-zinc-300 group-hover:text-white transition-colors">
                                    Gatsby&apos;s Chain
                                </h2>
                            </div>
                            <div className="mt-4 md:mt-0 font-mono text-[10px] text-zinc-500 tracking-widest lg:opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-0 lg:translate-x-4 lg:group-hover:translate-x-0">
                                [ OTWÓRZ ZAPIS ] →
                            </div>
                        </Link>

                    </nav>

                    <footer className="mt-12 lg:mt-16 font-mono text-[10px] text-zinc-700 tracking-widest">
                        SYSTEM ONLINE: 2026
                    </footer>
                </div>
            </div>

            {/* PRAWY PASEK (Tylko Desktop) */}
            <aside className="fixed top-0 right-0 w-[80px] h-full hidden lg:flex flex-col justify-between items-center py-12 border-l border-white/10 z-40 bg-[#050505]">
                <nav className="flex flex-col gap-16 text-[10px] tracking-widest font-mono text-zinc-500 mt-12">
                    <Link href="/" className="rotate-90 text-red-700 cursor-default whitespace-nowrap origin-center">
                        FILMY
                    </Link>
                    <Link href="/info" className="rotate-90 hover:text-red-700 cursor-pointer transition-colors whitespace-nowrap origin-center">
                        INFO
                    </Link>
                </nav>
                <div className="font-mono text-xs opacity-0">FIG. XX</div>
            </aside>
        </main>
    );
}