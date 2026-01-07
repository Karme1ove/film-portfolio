import { NoiseOverlay } from '@/components/NoiseOverlay';
import StalkerPlayer from '@/components/StalkerPlayer';
import Link from 'next/link';

export default function GatsbyPage() {
    return (
        <main className="min-h-screen w-full bg-[#050505] text-[#dcdcdc] relative selection:bg-red-900/30 pb-20 lg:pb-0">

            {/* LEWY PASEK */}
            <aside className="fixed top-0 left-0 w-[80px] h-full hidden lg:flex flex-col justify-between items-center py-12 border-r border-white/10 z-40 bg-[#050505]">
                <div className="rotate-90 origin-center whitespace-nowrap text-[10px] tracking-[0.2em] opacity-60 font-mono mt-12">
                    PROJEKT: GC
                </div>
                {/* ZMIANA: ROK 2026 */}
                <div className="font-mono text-xs opacity-60">2026</div>
            </aside>

            {/* ŚRODEK */}
            <div className="relative flex flex-col items-center justify-start px-4 py-12 md:p-12 min-h-screen lg:mx-[80px]">
                <NoiseOverlay />

                <div className="max-w-5xl w-full z-10 lg:mt-12 flex flex-col items-center">
                    <h1 className="font-serif italic text-4xl md:text-7xl mb-8 md:mb-16 text-center mix-blend-exclusion opacity-90 leading-tight">
                        Gatsby&apos;s<br/>Chain
                    </h1>

                    <div className="w-full mb-8">
                        <StalkerPlayer src="https://video.gumlet.io/695d823e5ac76cfa7a51c1b6/695e3bbbf20db5c359ae797b/main.m3u8" />
                    </div>

                    <section className="w-full mt-12 md:mt-20 border-t border-white/10 pt-12 md:pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 text-left">

                        {/* OPIS */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-mono text-xs text-red-800/80 tracking-[0.2em] uppercase mb-2">
                                OPIS [ GC-22 ]
                            </h3>
                            <p className="font-serif text-lg md:text-xl text-zinc-400 leading-relaxed italic opacity-90 text-justify md:text-left">
                                „Młody mężczyzna, Gatsby, tkwi w duszącym cyklu codziennych rytuałów, prześladowany przez natrętny głos swojego ojca, który przypomina mu o długu wdzięczności i rodzinnej tragedii. Jego pozornie uporządkowane życie – korporacja, treningi, spotkania z dziewczyną – pęka pod ciężarem wewnętrznej udręki. Punktem przełomu staje się uświadomienie, że aby odzyskać wolność i własny oddech, musi samodzielnie zerwać niewidzialny łańcuch narzucony mu przez przeszłość.”
                            </p>
                        </div>

                        {/* DANE */}
                        <div className="flex flex-col justify-center md:border-l border-white/5 md:pl-12 pt-8 md:pt-0 border-t md:border-t-0 border-white/5">
                            <dl className="grid grid-cols-[100px_1fr] gap-y-6 font-mono text-xs">

                                <dt className="text-zinc-600 uppercase tracking-widest mt-2">Reżyseria</dt>
                                <dd className="text-zinc-200 uppercase mt-2">Sergiusz Brasławski</dd>

                                <dt className="text-zinc-600 uppercase tracking-widest">Scenariusz</dt>
                                <dd className="text-zinc-200 uppercase">Sergiusz Brasławski</dd>

                                <dt className="text-zinc-600 uppercase tracking-widest">Zdjęcia</dt>
                                <dd className="text-zinc-200 uppercase">Hubert Bertin</dd>

                                <dt className="text-zinc-600 uppercase tracking-widest">Obsada</dt>
                                <dd className="text-zinc-200 uppercase leading-relaxed text-zinc-400">
                                    Aleks Zych, Hanna Płuska
                                </dd>
                            </dl>
                        </div>
                    </section>
                </div>
            </div>

            {/* PRAWY PASEK */}
            <aside className="fixed top-0 right-0 w-[80px] h-full hidden lg:flex flex-col justify-between items-center py-12 border-l border-white/10 z-40 bg-[#050505]">
                <nav className="flex flex-col gap-16 text-[10px] tracking-widest font-mono text-zinc-500 mt-12">
                    <Link href="/" className="rotate-90 hover:text-red-700 cursor-pointer transition-colors whitespace-nowrap origin-center">
                        FILMY
                    </Link>
                    <Link href="/info" className="rotate-90 hover:text-red-700 cursor-pointer transition-colors whitespace-nowrap origin-center">
                        INFO
                    </Link>
                </nav>
            </aside>
        </main>
    );
}