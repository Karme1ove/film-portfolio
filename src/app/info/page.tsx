import { NoiseOverlay } from '@/components/NoiseOverlay';
import Link from 'next/link';
import Image from 'next/image';

export default function InfoPage() {
    return (
        // ZMIANA TUTAJ: Zwiększono pb-20 na pb-40, żeby treść nie chowała się pod paskiem mobilnym
        <main className="min-h-screen w-full bg-[#050505] text-[#dcdcdc] relative selection:bg-red-900/30 pb-40 lg:pb-0">

            {/* LEWY PASEK (POPRAWIONY - SYMETRYCZNY) */}
            <aside className="fixed top-0 left-0 w-[80px] h-full hidden lg:flex flex-col justify-between items-center py-12 border-r border-white/10 z-40 bg-[#050505]">
                <div className="rotate-90 origin-center whitespace-nowrap text-[10px] tracking-[0.2em] opacity-60 font-mono mt-12">
                    PORTFOLIO
                </div>
                <div className="font-mono text-xs opacity-60">2026</div>
            </aside>

            {/* ŚRODKOWA KOLUMNA (SCROLLABLE) */}
            {/* ZMIANA: Dodano px-4 dla mobile, żeby tekst nie dotykał krawędzi ekranu */}
            <div className="relative flex flex-col items-center justify-start px-4 py-12 md:p-12 min-h-screen lg:mx-[80px]">
                <NoiseOverlay />

                <div className="max-w-6xl w-full z-10 lg:mt-12 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-24">

                    {/* KOLUMNA 1: ZDJĘCIE */}
                    <div className="flex flex-col gap-6">
                        <div className="relative w-full aspect-[3/4] border border-white/10 transition-all duration-700 shadow-2xl">
                            <Image
                                src="/me.jpg"
                                alt="Sergiusz Brasławski"
                                fill
                                className="object-cover opacity-100"
                            />
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-red-800/70 z-20" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-red-800/70 z-20" />
                        </div>

                        <div className="font-mono text-[10px] tracking-widest text-zinc-500 flex justify-between uppercase">
                            <span>ID: 9482-XB</span>
                            <span className="text-red-900">STATUS: AKTYWNY</span>
                        </div>
                    </div>

                    {/* KOLUMNA 2: TREŚĆ */}
                    <div className="flex flex-col justify-center">

                        <h1 className="font-serif italic text-4xl md:text-7xl mb-8 md:mb-12 mix-blend-exclusion text-zinc-200">
                            Sergiusz<br/>Brasławski
                        </h1>

                        <div className="prose prose-invert mb-12 md:mb-16 max-w-none">
                            <p className="font-serif text-lg text-zinc-400 leading-relaxed text-justify border-l-2 border-red-900/20 pl-6">
                                Urodzony w Mikołajowie, były muzyk multiinstrumentalista i wioślarz. Swoją przygodę filmową zaczął od pisania scenariuszy, które były zmotywowane wichurą otaczających jego codzienność zdarzeń oraz sytuacji. Obecnie pracuje nad kolejnymi projektami filmowymi, których poziom wizualny oraz merytoryczny stara się podnosić, nie zważając na trudności.
                            </p>
                            <p className="font-serif text-lg text-zinc-400 leading-relaxed text-justify border-l-2 border-red-900/20 pl-6 mt-6">
                                Od 2022 roku zrealizował trzy większe projekty: „Gatsby&apos;s Chain”, „Beyond Stars” oraz „Welcome To My World”. Przy każdym projekcie występował w roli reżysera i scenarzysty, a przy „Beyond Stars” zagrał jedną z głównych ról. Tworzy z pasji, dorastając na kinie Kubricka, Scorsese, Finchera i braci Coen. Chce dołożyć coś od siebie do szalonego świata kinematografii, którą kocha całym sercem.
                            </p>
                        </div>

                        {/* HISTORIA FILMÓW */}
                        <div className="border-t border-white/10 pt-12">
                            <h3 className="font-mono text-xs text-red-800/80 tracking-[0.2em] uppercase mb-12">
                                HISTORIA FILMÓW [ FESTIWALE ]
                            </h3>

                            <div className="flex flex-col gap-12 font-mono text-xs">

                                {/* 1. OBCIĄŻENI ZŁEM (LINK) */}
                                <div className="flex flex-col gap-4">
                                    <Link href="/obciazeni-zlem" className="group w-max">
                                  <span className="text-zinc-200 uppercase tracking-widest border-b border-white/5 pb-2 text-sm group-hover:text-red-700 group-hover:border-red-900 transition-all duration-300">
                                      Obciążeni Złem
                                  </span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-3 text-red-700">→</span>
                                    </Link>

                                    <ul className="flex flex-col gap-3 pl-4 border-l border-white/5">
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2025</span>
                                            <span>Spektrum Film Festival <span className="text-zinc-700 ml-2">// ŚWIDNICA</span></span>
                                        </li>
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2025</span>
                                            <span>OKFA KLAPS <span className="text-zinc-700 ml-2">// BYDGOSZCZ</span></span>
                                        </li>
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2025</span>
                                            <span>Films That Move <span className="text-red-900/70 ml-2">[ HONORABLE MENTION ]</span></span>
                                        </li>
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2025</span>
                                            <span>Filmmaker Sessions Vol. 12 <span className="text-zinc-700 ml-2">// UK</span></span>
                                        </li>
                                    </ul>
                                </div>

                                {/* 2. WELCOME TO MY WORLD (LINK) */}
                                <div className="flex flex-col gap-4">
                                    <Link href="/welcome-to-my-world" className="group w-max">
                                  <span className="text-zinc-200 uppercase tracking-widest border-b border-white/5 pb-2 text-sm group-hover:text-red-700 group-hover:border-red-900 transition-all duration-300">
                                      Welcome To My World
                                  </span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-3 text-red-700">→</span>
                                    </Link>

                                    <ul className="flex flex-col gap-3 pl-4 border-l border-white/5">
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2024</span>
                                            <span>OKFA KLAPS <span className="text-zinc-700 ml-2">// BYDGOSZCZ</span></span>
                                        </li>
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2024</span>
                                            <span>Szczecin Film Festival <span className="text-zinc-700 ml-2">// SZCZECIN</span></span>
                                        </li>
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2024</span>
                                            <span>Filmmaker Sessions Vol. 1 <span className="text-zinc-700 ml-2">// UK</span></span>
                                        </li>
                                    </ul>
                                </div>

                                {/* 3. BEYOND STARS (TEKST) */}
                                <div className="flex flex-col gap-4">
                                    <div className="w-max cursor-default">
                                  <span className="text-zinc-400 uppercase tracking-widest border-b border-white/5 pb-2 text-sm">
                                      Beyond Stars
                                  </span>
                                    </div>

                                    <ul className="flex flex-col gap-3 pl-4 border-l border-white/5">
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2023</span>
                                            <span>Student World Impact Film Festival <span className="text-zinc-700 ml-2">// USA</span></span>
                                        </li>
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2023</span>
                                            <span>ACPL Teen Film Festival <span className="text-zinc-700 ml-2">// USA</span></span>
                                        </li>
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2023</span>
                                            <span>First-Time Filmmaker Sessions <span className="text-zinc-700 ml-2">// UK</span></span>
                                        </li>
                                    </ul>
                                </div>

                                {/* 4. GATSBY'S CHAIN (LINK) */}
                                <div className="flex flex-col gap-4">
                                    <Link href="/gatsbys-chain" className="group w-max">
                                  <span className="text-zinc-200 uppercase tracking-widest border-b border-white/5 pb-2 text-sm group-hover:text-red-700 group-hover:border-red-900 transition-all duration-300">
                                      Gatsby&apos;s Chain
                                  </span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-3 text-red-700">→</span>
                                    </Link>

                                    <ul className="flex flex-col gap-3 pl-4 border-l border-white/5">
                                        <li className="grid grid-cols-[50px_1fr] gap-4 text-zinc-500">
                                            <span>2022</span>
                                            <span>The Exchange of Creativity <span className="text-zinc-700 ml-2">// INTERNATIONAL</span></span>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRAWY PASEK (Desktop Only) */}
            <aside className="fixed top-0 right-0 w-[80px] h-full hidden lg:flex flex-col justify-between items-center py-12 border-l border-white/10 z-40 bg-[#050505]">
                <nav className="flex flex-col gap-16 text-[10px] tracking-widest font-mono text-zinc-500 mt-12">
                    <Link href="/" className="rotate-90 hover:text-red-700 cursor-pointer transition-colors whitespace-nowrap origin-center">
                        FILMY
                    </Link>
                    <Link href="/info" className="rotate-90 text-red-700 cursor-default whitespace-nowrap origin-center">
                        INFO
                    </Link>
                </nav>
                <div className="font-mono text-xs opacity-0">2026</div>
            </aside>
        </main>
    );
}