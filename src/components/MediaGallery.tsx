'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface MediaItem {
    url: string;
    type: 'image' | 'video';
    order: number;
}

interface MediaGalleryProps {
    media: MediaItem[];
}

export default function MediaGallery({ media }: MediaGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    const sortedMedia = [...media].sort((a, b) => a.order - b.order);
    const currentMedia = sortedMedia[selectedIndex];

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const nextMedia = () => {
        setSelectedIndex((prev) => (prev + 1) % sortedMedia.length);
    };

    const prevMedia = () => {
        setSelectedIndex((prev) => (prev - 1 + sortedMedia.length) % sortedMedia.length);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextMedia();
        } else if (isRightSwipe) {
            prevMedia();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setSelectedIndex((prev) => (prev - 1 + sortedMedia.length) % sortedMedia.length);
            }
            if (e.key === 'ArrowRight') {
                setSelectedIndex((prev) => (prev + 1) % sortedMedia.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [sortedMedia.length]);

    if (!media || media.length === 0) return null;

    return (
        <div className="space-y-4">
            {/* Main Carousel */}
            <div
                ref={carouselRef}
                className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Media Item */}
                {currentMedia.type === 'image' ? (
                    <Image
                        src={currentMedia.url}
                        alt="Event media"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="relative w-full h-full">
                        <video
                            src={currentMedia.url}
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                        />
                    </div>
                )}

                {/* Navigation Arrows */}
                {sortedMedia.length > 1 && (
                    <>
                        <button
                            onClick={prevMedia}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                            aria-label="Previous media"
                        >
                            <ChevronLeft className="w-6 h-6 text-slate-900" />
                        </button>
                        <button
                            onClick={nextMedia}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                            aria-label="Next media"
                        >
                            <ChevronRight className="w-6 h-6 text-slate-900" />
                        </button>

                        {/* Media Counter */}
                        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium z-10">
                            {selectedIndex + 1} / {sortedMedia.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {sortedMedia.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {sortedMedia.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${idx === selectedIndex
                                ? 'ring-2 ring-pink-500'
                                : 'ring-1 ring-slate-700 hover:ring-slate-600'
                                } transition-all`}
                        >
                            {item.type === 'image' ? (
                                <Image
                                    src={item.url}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="relative w-full h-full bg-slate-800">
                                    <video
                                        src={item.url}
                                        className="w-full h-full object-cover"
                                        muted
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <Play className="w-5 h-5 text-white" fill="currentColor" />
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
