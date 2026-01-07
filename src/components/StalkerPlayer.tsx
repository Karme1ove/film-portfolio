'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Captions } from 'lucide-react';
import Hls from 'hls.js';

// --- TYPY ---
interface IOSVideoElement extends HTMLVideoElement {
    webkitEnterFullscreen?: () => void;
    webkitExitFullscreen?: () => void;
    webkitDisplayingFullscreen?: boolean;
}

interface IOSDocument extends Document {
    webkitFullscreenElement?: Element;
    webkitExitFullscreen?: () => void;
}

interface StalkerPlayerProps {
    src: string;
    poster?: string;
}

interface QualityLevel {
    height: number;
    index: number;
    bitrate: number;
}

interface SubtitleTrack {
    id: number;
    lang: string;
    name: string;
}

export default function StalkerPlayer({ src, poster }: StalkerPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<HTMLDivElement | null>(null);
    const volumeRef = useRef<HTMLDivElement | null>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    // Stan odtwarzania
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    // Stan UI
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Stan Jakości
    const [qualities, setQualities] = useState<QualityLevel[]>([]);
    const [currentQuality, setCurrentQuality] = useState<number>(-1);
    const [showQualityMenu, setShowQualityMenu] = useState(false);

    // Stan Napisów
    const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([]);
    const [currentSubtitle, setCurrentSubtitle] = useState<number>(-1);
    const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
    const [subtitleText, setSubtitleText] = useState<string>(''); // NOWE: Tekst napisów do wyświetlenia

    // Flagi szorowania
    const [isScrubbingTime, setIsScrubbingTime] = useState(false);
    const [isScrubbingVolume, setIsScrubbingVolume] = useState(false);

    // --- LOGIKA NAPISÓW (CUSTOM RENDER) ---
    const updateSubtitleText = () => {
        const video = videoRef.current;
        if (!video) return;

        // Szukamy aktywnej ścieżki (mode === 'hidden' lub 'showing')
        // Ustawiamy mode='hidden', żeby przeglądarka nie rysowała swoich brzydkich napisów,
        // ale żebyśmy mogli czytać 'activeCues'.
        let activeText = '';
        if (video.textTracks) {
            for (let i = 0; i < video.textTracks.length; i++) {
                const track = video.textTracks[i];
                if (track.mode === 'showing' || track.mode === 'hidden') {
                    if (track.activeCues && track.activeCues.length > 0) {
                        // Pobieramy tekst z aktywnego fragmentu
                        const cue = track.activeCues[0] as VTTCue;
                        activeText = cue.text;
                    }
                }
            }
        }
        // Parsowanie prostego HTML w napisach (np. <i>...</i>)
        setSubtitleText(activeText.replace(/<[^>]*>?/gm, ''));
    };

    // --- INICJALIZACJA ---
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Funkcja wiążąca eventy napisów
        const setupSubtitleListeners = () => {
            if (video.textTracks) {
                for (let i = 0; i < video.textTracks.length; i++) {
                    const track = video.textTracks[i];
                    // Ustawiamy na hidden - my renderujemy tekst, nie przeglądarka
                    if (track.mode === 'showing') track.mode = 'hidden';
                    track.oncuechange = updateSubtitleText;
                }
            }
        };

        if (Hls.isSupported()) {
            const hls = new Hls({
                startLevel: -1,
                capLevelToPlayerSize: true,
                enableWebVTT: true, // WAŻNE: Musi być true, żeby HLS pobrał napisy
            });

            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const levels = data.levels.map((level, index) => ({
                    height: level.height,
                    index: index,
                    bitrate: level.bitrate
                })).sort((a, b) => b.height - a.height);
                setQualities(levels);

                // Domyślnie wyłączamy napisy na start
                hls.subtitleTrack = -1;
                setCurrentSubtitle(-1);
            });

            hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
                const tracks = data.subtitleTracks.map((track, index) => ({
                    id: index,
                    lang: track.lang || 'unknown',
                    name: track.name || track.lang || `Track ${index + 1}`
                }));
                setSubtitles(tracks);
                hls.subtitleTrack = -1; // Upewniamy się, że startujemy bez napisów
            });

            // Nasłuchiwanie zmian fragmentów napisów (dla HLS)
            hls.on(Hls.Events.SUBTITLE_FRAG_PROCESSED, () => {
                setupSubtitleListeners();
            });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari
            video.src = src;
            video.addEventListener('loadedmetadata', setupSubtitleListeners);
            // W Safari trzeba czasem nasłuchiwać zmiany textTracks
            video.textTracks.addEventListener('change', setupSubtitleListeners);
        }

        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
        };
    }, [src]);

    // --- ZMIANA NAPISÓW ---
    const changeSubtitle = (index: number) => {
        const video = videoRef.current;

        // 1. Zmiana w HLS
        if (hlsRef.current) {
            hlsRef.current.subtitleTrack = index;
        }

        // 2. Obsługa natywnych tracków (ukrywanie systemowych, włączanie logiki)
        if (video && video.textTracks) {
            // Wyłączamy wszystkie
            for (let i = 0; i < video.textTracks.length; i++) {
                video.textTracks[i].mode = 'disabled';
            }

            if (index !== -1) {
                // HLS mapuje tracki, ale czasem musimy znaleźć odpowiedni w DOM
                // W prostym przypadku index HLS = index textTracks (minus metadane)
                // Tutaj włączamy tryb 'hidden' dla wszystkich, HLS sam zarządza, który dostaje dane
                // Dla bezpieczeństwa: iterujemy i włączamy nasłuch na wszystkich potencjalnych
                for (let i = 0; i < video.textTracks.length; i++) {
                    const track = video.textTracks[i];
                    // Włączamy 'hidden' żeby eventy 'cuechange' leciały, ale bez renderowania
                    track.mode = 'hidden';
                    track.oncuechange = updateSubtitleText;
                }
            } else {
                setSubtitleText('');
            }
        }

        setCurrentSubtitle(index);
        setShowSubtitleMenu(false);
    };

    const changeQuality = (index: number) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = index;
            setCurrentQuality(index);
            setShowQualityMenu(false);
        }
    };

    // --- UI LOGIC ---
    const anyMenuOpen = showQualityMenu || showSubtitleMenu;

    const showControlsTemporary = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isPlaying && !isScrubbingTime && !isScrubbingVolume && !anyMenuOpen) {
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    }, [isPlaying, isScrubbingTime, isScrubbingVolume, anyMenuOpen]);

    const handleMouseMove = () => showControlsTemporary();
    const handleMouseLeave = () => {
        if (isPlaying && !isScrubbingTime && !isScrubbingVolume && !anyMenuOpen) {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            setShowControls(false);
        }
    };

    const handleVideoAreaClick = () => {
        if (!hasStarted) { togglePlay(); return; }
        if (anyMenuOpen) { setShowQualityMenu(false); setShowSubtitleMenu(false); return; }
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
            if (showControls) { setShowControls(false); if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current); }
            else showControlsTemporary();
        } else togglePlay();
    };

    const togglePlay = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
        if (e) e.stopPropagation();
        const v = videoRef.current;
        if (!v) return;
        setHasStarted(true);
        if (v.paused) { v.play(); setIsPlaying(true); showControlsTemporary(); }
        else { v.pause(); setIsPlaying(false); setShowControls(true); }
    }, [showControlsTemporary]);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        const newState = !isMuted;
        videoRef.current.muted = newState;
        setIsMuted(newState);
        if (!newState && volume === 0) setVolume(1);
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        const container = containerRef.current;
        const video = videoRef.current as IOSVideoElement;
        const doc = document as IOSDocument;
        if (!container || !video) return;
        const isFull = doc.fullscreenElement || doc.webkitFullscreenElement;
        if (!isFull) {
            if (container.requestFullscreen) {
                container.requestFullscreen().catch(() => { if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); });
            } else if (video.webkitEnterFullscreen) { video.webkitEnterFullscreen(); }
        } else {
            if (doc.exitFullscreen) { doc.exitFullscreen(); } else if (doc.webkitExitFullscreen) { doc.webkitExitFullscreen(); }
        }
    };

    // Scrubbing Helpers
    const getClientX = (e: any) => 'touches' in e ? e.touches[0].clientX : e.clientX;
    const calculatePercent = (cX: number, el: HTMLDivElement) => { const r = el.getBoundingClientRect(); return Math.max(0, Math.min(1, (cX - r.left) / r.width)); };
    const startTimelineScrub = (e: any) => { e.stopPropagation(); setIsScrubbingTime(true); handleTimelineScrub(getClientX(e)); };
    const handleTimelineScrub = (x: number) => {
        if (timelineRef.current && videoRef.current && duration) {
            const t = calculatePercent(x, timelineRef.current) * duration;
            setCurrentTime(t); videoRef.current.currentTime = t;
        }
    };
    const startVolumeScrub = (e: any) => { e.stopPropagation(); setIsScrubbingVolume(true); handleVolumeScrub(getClientX(e)); };
    const handleVolumeScrub = (x: number) => {
        if (volumeRef.current && videoRef.current) {
            const p = calculatePercent(x, volumeRef.current);
            setVolume(p); videoRef.current.volume = p; setIsMuted(p === 0);
        }
    };
    useEffect(() => {
        const mv = (e: any) => { const x = 'touches' in e ? e.touches[0].clientX : e.clientX; if (isScrubbingTime) handleTimelineScrub(x); if (isScrubbingVolume) handleVolumeScrub(x); };
        const up = () => { setIsScrubbingTime(false); setIsScrubbingVolume(false); };
        if (isScrubbingTime || isScrubbingVolume) { window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up); window.addEventListener('touchmove', mv, {passive:false}); window.addEventListener('touchend', up); }
        return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); window.removeEventListener('touchmove', mv); window.removeEventListener('touchend', up); };
    }, [isScrubbingTime, isScrubbingVolume, duration]);

    const handleTimeUpdate = () => { if (videoRef.current && !isScrubbingTime) setCurrentTime(videoRef.current.currentTime); };
    const handleDuration = () => { if (videoRef.current && !isNaN(videoRef.current.duration)) setDuration(videoRef.current.duration); };

    useEffect(() => {
        const doc = document as IOSDocument;
        const h = () => setIsFullscreen(!!doc.fullscreenElement || !!doc.webkitFullscreenElement);
        document.addEventListener('fullscreenchange', h);
        document.addEventListener('webkitfullscreenchange', h);
        const video = videoRef.current;
        const handleIOSEnd = () => setIsFullscreen(false);
        if(video) video.addEventListener('webkitendfullscreen', handleIOSEnd);
        return () => {
            document.removeEventListener('fullscreenchange', h);
            document.removeEventListener('webkitfullscreenchange', h);
            if(video) video.removeEventListener('webkitendfullscreen', handleIOSEnd);
        };
    }, []);

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    const volumePercent = isMuted ? 0 : volume * 100;
    const formatTime = (t: number) => { if (!t || isNaN(t)) return "00:00"; const m = Math.floor(t/60); const s = Math.floor(t%60); return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`; };
    const cursorClass = (!showControls && isPlaying && !anyMenuOpen) ? '!cursor-none' : 'cursor-auto';

    return (
        <div className="w-full flex flex-col gap-4">
            <div ref={containerRef} className={`relative w-full aspect-video bg-black border border-white/10 group select-none shadow-[0_0_50px_rgba(0,0,0,0.7)] ${cursorClass}`} onClick={handleVideoAreaClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>

                {!isFullscreen && (<><div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-800/70 z-20 pointer-events-none" /><div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-800/70 z-20 pointer-events-none" /></>)}

                <video ref={videoRef} poster={poster} className="w-full h-full object-contain bg-black" onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleDuration} onDurationChange={handleDuration} onPlay={() => {setIsPlaying(true); setHasStarted(true); showControlsTemporary();}} onPause={() => {setIsPlaying(false); setShowControls(true);}} playsInline crossOrigin="anonymous" />

                {/* --- CUSTOM SUBTITLES LAYER --- */}
                {/* Wyświetlamy tylko jeśli jest tekst i film ruszył */}
                {subtitleText && hasStarted && (
                    <div className="absolute bottom-16 md:bottom-20 left-0 w-full px-8 text-center pointer-events-none z-20 transition-all duration-200">
                        <span className="inline-block bg-black/60 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded text-white font-mono text-sm md:text-lg leading-snug shadow-lg border border-white/5">
                            {subtitleText}
                        </span>
                    </div>
                )}

                {/* BIG PLAY BUTTON */}
                <div className={`absolute inset-0 flex items-center justify-center cursor-pointer z-10 transition-all duration-300 ${(!hasStarted || (showControls && !isPlaying)) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity ${hasStarted ? 'opacity-100' : 'opacity-0'}`} />
                    <div onClick={togglePlay} className="relative flex items-center justify-center p-6 md:p-8 border border-zinc-500/50 hover:border-red-600 transition-all duration-300 group/btn shadow-2xl z-20 bg-black/20">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-400 group-hover/btn:border-red-600 transition-colors" /><div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-400 group-hover/btn:border-red-600 transition-colors" /><div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-zinc-400 group-hover/btn:border-red-600 transition-colors" /><div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-400 group-hover/btn:border-red-600 transition-colors" />
                        {isPlaying ? <Pause size={32} className="text-zinc-300 group-hover/btn:text-red-500" /> : <Play size={32} className="text-zinc-300 group-hover/btn:text-red-500 ml-1" />}
                    </div>
                </div>

                {hasStarted && (
                    <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-24 pb-4 px-4 md:px-6 flex flex-col gap-3 z-30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} onClick={(e)=>e.stopPropagation()}>
                        <div ref={timelineRef} className="w-full h-6 flex items-center cursor-pointer group/timeline relative z-50 touch-none" onMouseDown={startTimelineScrub} onTouchStart={startTimelineScrub}>
                            <div className="w-full h-1 bg-zinc-800 relative pointer-events-none group-hover/timeline:h-1.5 transition-all">
                                <div className="h-full bg-red-700 relative" style={{ width: `${progressPercent}%` }}><div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 shadow-[0_0_10px_rgba(220,38,38,1)] rounded-full scale-0 group-hover/timeline:scale-100 transition-transform" /></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[10px] md:text-xs text-zinc-400 tracking-widest -mt-2">
                            <div className="flex items-center gap-4"><button onClick={togglePlay} className="hover:text-white transition-colors p-2 -ml-2">{isPlaying ? <Pause size={16}/> : <Play size={16}/>}</button><span className="tabular-nums opacity-80">{formatTime(currentTime)} <span className="text-zinc-600">/</span> {formatTime(duration)}</span></div>
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-3 group/volume"><button onClick={toggleMute} className="hover:text-white p-1">{isMuted || volume===0 ? <VolumeX size={16}/> : <Volume2 size={16}/>}</button><div ref={volumeRef} className="w-16 md:w-24 h-6 flex items-center cursor-pointer touch-none" onMouseDown={startVolumeScrub} onTouchStart={startVolumeScrub}><div className="w-full h-1 bg-zinc-800 pointer-events-none"><div className="h-full bg-zinc-400 group-hover/volume:bg-red-700 transition-colors" style={{width:`${volumePercent}%`}}/></div></div></div>
                                <div className="hidden sm:block w-px h-4 bg-zinc-800 mx-2" />

                                {/* NAPISY */}
                                {subtitles.length > 0 && (<div className="relative"><button onClick={() => { setShowSubtitleMenu(!showSubtitleMenu); setShowQualityMenu(false); }} className={`hover:text-red-500 transition-colors p-1 flex items-center gap-2 ${showSubtitleMenu ? 'text-red-500' : ''}`} title="Napisy"><Captions size={16} /><span className="hidden sm:inline opacity-50 text-[9px]">{currentSubtitle === -1 ? 'OFF' : subtitles[currentSubtitle]?.lang.toUpperCase()}</span></button>{showSubtitleMenu && (<div className="absolute bottom-full right-0 mb-4 bg-black border border-white/10 shadow-xl p-1 min-w-[120px] flex flex-col z-50"><button onClick={() => changeSubtitle(-1)} className={`px-4 py-2 text-left hover:bg-zinc-900 hover:text-red-500 transition-colors text-[10px] tracking-widest ${currentSubtitle === -1 ? 'text-red-500' : 'text-zinc-400'}`}>[ WYŁĄCZ ]</button>{subtitles.map((track) => (<button key={track.id} onClick={() => changeSubtitle(track.id)} className={`px-4 py-2 text-left hover:bg-zinc-900 hover:text-red-500 transition-colors text-[10px] tracking-widest uppercase ${currentSubtitle === track.id ? 'text-red-500' : 'text-zinc-400'}`}>[ {track.name || track.lang} ]</button>))}</div>)}</div>)}

                                {/* JAKOŚĆ */}
                                {qualities.length > 0 && (<div className="relative"><button onClick={() => { setShowQualityMenu(!showQualityMenu); setShowSubtitleMenu(false); }} className={`hover:text-red-500 transition-colors p-1 flex items-center gap-2 ${showQualityMenu ? 'text-red-500' : ''}`} title="Jakość"><Settings size={16} /><span className="hidden sm:inline opacity-50 text-[9px]">{currentQuality === -1 ? 'AUTO' : `${qualities.find(q => q.index === currentQuality)?.height}P`}</span></button>{showQualityMenu && (<div className="absolute bottom-full right-0 mb-4 bg-black border border-white/10 shadow-xl p-1 min-w-[120px] flex flex-col z-50"><button onClick={() => changeQuality(-1)} className={`px-4 py-2 text-left hover:bg-zinc-900 hover:text-red-500 transition-colors text-[10px] tracking-widest ${currentQuality === -1 ? 'text-red-500' : 'text-zinc-400'}`}>[ AUTO ]</button>{qualities.map((q) => (<button key={q.index} onClick={() => changeQuality(q.index)} className={`px-4 py-2 text-left hover:bg-zinc-900 hover:text-red-500 transition-colors text-[10px] tracking-widest ${currentQuality === q.index ? 'text-red-500' : 'text-zinc-400'}`}>[ {q.height}P ]</button>))}</div>)}</div>)}

                                <button onClick={toggleFullscreen} className="hover:text-red-500 transition-colors p-1">{isFullscreen ? <Minimize size={16}/> : <Maximize size={16}/>}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <p className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] opacity-40 text-center uppercase transition-all duration-500">{isPlaying ? '[ STATUS: PROJEKCJA... ]' : '[ STATUS: GOTOWOŚĆ ]'}</p>
        </div>
    );
}