'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
// ZMIANA: Dodano import 'Minimize'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface StalkerPlayerProps {
    src: string;
}

export default function StalkerPlayer({ src }: StalkerPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<HTMLDivElement | null>(null);
    const volumeRef = useRef<HTMLDivElement | null>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Stan odtwarzania
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    // Stan UI
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Flagi szorowania
    const [isScrubbingTime, setIsScrubbingTime] = useState(false);
    const [isScrubbingVolume, setIsScrubbingVolume] = useState(false);

    // --- WYKRYWANIE FULLSCREENA ---
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    // --- LOGIKA WIDOCZNOŚCI ---

    const showControlsTemporary = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

        if (isPlaying && !isScrubbingTime && !isScrubbingVolume) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    }, [isPlaying, isScrubbingTime, isScrubbingVolume]);

    // Obsługa myszki (Desktop)
    const handleMouseMove = () => {
        showControlsTemporary();
    };

    const handleMouseLeave = () => {
        if (isPlaying && !isScrubbingTime && !isScrubbingVolume) {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            setShowControls(false);
        }
    };

    // Obsługa kliknięcia (Mobile + Desktop Click)
    const handleVideoAreaClick = () => {
        const isMobile = window.innerWidth < 1024;

        if (isMobile) {
            if (showControls) {
                setShowControls(false);
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            } else {
                showControlsTemporary();
            }
        } else {
            togglePlay();
        }
    };

    // --- HELPERY DOTYKOWE ---
    const getClientX = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if ('touches' in e) {
            return e.touches[0].clientX;
        }
        return (e as React.MouseEvent).clientX;
    };

    const formatTime = (time: number) => {
        if (!time || isNaN(time) || time === Infinity) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // --- VIDEO LOGIC ---

    const togglePlay = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
        if (e) e.stopPropagation();

        const v = videoRef.current;
        if (!v) return;

        if (v.paused) {
            v.play();
            setIsPlaying(true);
            showControlsTemporary();
        } else {
            v.pause();
            setIsPlaying(false);
            setShowControls(true);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        }
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
        if (!containerRef.current) return;
        if (!document.fullscreenElement && !(containerRef.current as any).webkitDisplayingFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if ((videoRef.current as any).webkitEnterFullscreen) {
                (videoRef.current as any).webkitEnterFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // --- CORE ENGINE (SCRUBBING) ---
    useEffect(() => {
        if (isScrubbingTime || isScrubbingVolume) {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            setShowControls(true);
        } else if (isPlaying) {
            showControlsTemporary();
        }
    }, [isScrubbingTime, isScrubbingVolume, isPlaying, showControlsTemporary]);

    const calculatePercent = (clientX: number, element: HTMLDivElement) => {
        const rect = element.getBoundingClientRect();
        const x = clientX - rect.left;
        let percent = x / rect.width;
        return Math.max(0, Math.min(1, percent));
    };

    const handleTimelineScrub = (clientX: number) => {
        if (timelineRef.current && videoRef.current && duration > 0) {
            const percent = calculatePercent(clientX, timelineRef.current);
            const newTime = percent * duration;
            setCurrentTime(newTime);
            videoRef.current.currentTime = newTime;
        }
    };

    const startTimelineScrub = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setIsScrubbingTime(true);
        const x = getClientX(e);
        handleTimelineScrub(x);
    };

    const handleVolumeScrub = (clientX: number) => {
        if (volumeRef.current && videoRef.current) {
            const percent = calculatePercent(clientX, volumeRef.current);
            setVolume(percent);
            videoRef.current.volume = percent;
            setIsMuted(percent === 0);
        }
    };

    const startVolumeScrub = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setIsScrubbingVolume(true);
        const x = getClientX(e);
        handleVolumeScrub(x);
    };

    // --- GLOBAL LISTENERS ---
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
            if (isScrubbingTime) handleTimelineScrub(x);
            if (isScrubbingVolume) handleVolumeScrub(x);
        };

        const handleUp = () => {
            setIsScrubbingTime(false);
            setIsScrubbingVolume(false);
        };

        if (isScrubbingTime || isScrubbingVolume) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isScrubbingTime, isScrubbingVolume, duration]);

    // --- SYNC ---
    const handleTimeUpdate = () => {
        if (videoRef.current && !isScrubbingTime) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleDurationChange = () => {
        if (videoRef.current) {
            const d = videoRef.current.duration;
            if (!isNaN(d) && d !== Infinity) setDuration(d);
        }
    };

    useEffect(() => {
        const v = videoRef.current;
        if (v && v.readyState >= 1) handleDurationChange();
    }, [src]);

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    const volumePercent = isMuted ? 0 : volume * 100;

    // --- LOGIKA KURSORA ---
    const cursorClass = (!showControls && isPlaying) ? '!cursor-none' : 'cursor-auto';
    const videoCursorClass = (!showControls && isPlaying) ? '!cursor-none' : 'cursor-pointer';

    return (
        <div className="w-full flex flex-col gap-4">
            <div
                ref={containerRef}
                className={`relative w-full aspect-video bg-black border border-white/10 group select-none shadow-[0_0_50px_rgba(0,0,0,0.7)] ${cursorClass}`}
                onClick={handleVideoAreaClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* DEKORACJE - Ukrywamy na fullscreen */}
                {!isFullscreen && (
                    <>
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-800/70 z-20 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-800/70 z-20 pointer-events-none" />
                    </>
                )}

                <video
                    ref={videoRef}
                    src={src}
                    className={`w-full h-full object-contain bg-black ${videoCursorClass}`}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleDurationChange}
                    onDurationChange={handleDurationChange}
                    onCanPlay={handleDurationChange}
                    onPlay={() => {
                        setIsPlaying(true);
                        showControlsTemporary();
                    }}
                    onPause={() => {
                        setIsPlaying(false);
                        setShowControls(true);
                    }}
                    playsInline
                />

                {/* --- ŚRODKOWY PRZYCISK --- */}
                <div
                    className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] cursor-pointer z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div
                        className="relative flex items-center justify-center p-6 md:p-8 bg-transparent border border-zinc-500/50 hover:border-red-600 transition-all duration-300 group/btn shadow-2xl box-border"
                        onClick={togglePlay}
                    >
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-400 group-hover/btn:border-red-600 transition-colors" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-400 group-hover/btn:border-red-600 transition-colors" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-zinc-400 group-hover/btn:border-red-600 transition-colors" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-400 group-hover/btn:border-red-600 transition-colors" />

                        {isPlaying ? (
                            <Pause size={32} className="text-zinc-300 group-hover/btn:text-red-500" />
                        ) : (
                            <Play size={32} className="text-zinc-300 group-hover/btn:text-red-500 ml-1" />
                        )}
                    </div>
                </div>

                {/* --- DOLNY PASEK KONTROLNY --- */}
                <div
                    className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-4 px-4 md:px-6 flex flex-col gap-3 z-30 transition-opacity duration-300 
                    ${showControls ? 'opacity-100' : 'opacity-0'}`}
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* TIMELINE */}
                    <div
                        ref={timelineRef}
                        className="w-full h-6 flex items-center cursor-pointer group/timeline relative z-50 touch-none"
                        onMouseDown={startTimelineScrub}
                        onTouchStart={startTimelineScrub}
                    >
                        <div className="w-full h-1 bg-zinc-800 relative pointer-events-none group-hover/timeline:h-1.5 transition-all">
                            <div className="h-full bg-red-700 relative" style={{ width: `${progressPercent}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 md:w-3 md:h-3 bg-red-500 shadow-[0_0_10px_rgba(220,38,38,1)] rounded-full scale-100 md:scale-0 group-hover/timeline:scale-100 transition-transform" />
                            </div>
                        </div>
                    </div>

                    {/* PRZYCISKI DOLNE */}
                    <div className="flex items-center justify-between font-mono text-[10px] md:text-xs text-zinc-400 tracking-widest -mt-2">
                        <div className="flex items-center gap-4 md:gap-6">
                            <button onClick={togglePlay} className="hover:text-white transition-colors focus:outline-none p-2 -ml-2">
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <span className="tabular-nums opacity-80 select-none">
                                {formatTime(currentTime)} <span className="text-zinc-600 mx-1">/</span> {formatTime(duration)}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="hidden sm:flex items-center gap-3 group/volume">
                                <button onClick={toggleMute} className="hover:text-white transition-colors p-1">
                                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                                <div
                                    ref={volumeRef}
                                    className="w-16 md:w-24 h-6 flex items-center cursor-pointer relative touch-none"
                                    onMouseDown={startVolumeScrub}
                                    onTouchStart={startVolumeScrub}
                                >
                                    <div className="w-full h-1 bg-zinc-800 pointer-events-none">
                                        <div className="h-full bg-zinc-400 group-hover/volume:bg-red-700 transition-colors" style={{ width: `${volumePercent}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="hidden sm:block w-px h-4 bg-zinc-800 mx-2" />

                            {/* PRZYCISK FULLSCREEN (ZMIANA IKONY I TEKSTU) */}
                            <button onClick={toggleFullscreen} className="hover:text-red-500 transition-colors uppercase flex items-center gap-2 p-1">
                                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                                <span className="hidden sm:inline opacity-50">
                                    {isFullscreen ? '[ ZMNIEJSZ ]' : '[ POWIĘKSZ ]'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATUS */}
            <p className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] opacity-40 text-center uppercase transition-all duration-500">
                {isPlaying ? '[ STATUS: PROJEKCJA... ]' : '[ STATUS: GOTOWOŚĆ ]'}
            </p>
        </div>
    );
}