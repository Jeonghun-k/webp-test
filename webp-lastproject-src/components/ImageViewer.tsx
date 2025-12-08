import React, { useEffect, useState } from 'react';
import { Trip } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
  activeTrip: Trip;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ activeTrip, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset index when trip changes (though currently we unmount/remount modal)
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeTrip.id]);

  const onNext = () => {
    setCurrentImageIndex((prev) => 
        prev === activeTrip.images.length - 1 ? 0 : prev + 1
    );
  };

  const onPrev = () => {
    setCurrentImageIndex((prev) => 
        prev === 0 ? activeTrip.images.length - 1 : prev - 1
    );
  };

  // Auto-play functionality
  useEffect(() => {
    // If there's only 1 or 0 images, no need to auto-play
    if (!activeTrip.images || activeTrip.images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === activeTrip.images.length - 1 ? 0 : prev + 1
      );
    }, 2000); // Changed to 2 seconds interval as requested

    // Clear interval on unmount or when image changes (resets the timer for manual interaction)
    return () => clearInterval(timer);
  }, [currentImageIndex, activeTrip.images.length]);
  
  const currentImageUrl = activeTrip.images[currentImageIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTrip]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/95 backdrop-blur-xl">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-4 text-[#86868b] hover:text-white transition-colors duration-300 group"
      >
        <span className="text-xs uppercase tracking-widest mr-2 opacity-0 group-hover:opacity-100 transition-opacity">Close Album</span>
        <X size={28} strokeWidth={1} className="inline-block" />
      </button>

      {/* Navigation - Left */}
      <button 
        onClick={onPrev}
        className="absolute left-2 md:left-10 z-40 p-6 text-[#86868b] hover:text-white transition-all hover:-translate-x-1 focus:outline-none hidden md:block"
        disabled={activeTrip.images.length <= 1}
      >
        <ChevronLeft size={56} strokeWidth={0.5} />
      </button>

      {/* Navigation - Right */}
      <button 
        onClick={onNext}
        className="absolute right-2 md:right-10 z-40 p-6 text-[#86868b] hover:text-white transition-all hover:translate-x-1 focus:outline-none hidden md:block"
        disabled={activeTrip.images.length <= 1}
      >
        <ChevronRight size={56} strokeWidth={0.5} />
      </button>

      {/* Main Content Area */}
      <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-20 gap-10 md:gap-20">
        
        {/* Image Container - Improved sizing logic */}
        <div 
          className="relative flex-1 w-full h-full max-h-[70vh] md:max-h-[85vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500"
        >
            {/* 
              object-contain ensures the image is never cropped and always fully visible.
              max-w-full and max-h-full ensure it stays within the container.
            */}
            <img 
                key={currentImageUrl}
                src={currentImageUrl} 
                alt={`${activeTrip.title} - ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain shadow-2xl"
            />
            
            {/* Mobile Navigation Areas */}
            <div className="absolute inset-y-0 left-0 w-1/4 md:hidden z-10" onClick={(e) => { e.stopPropagation(); onPrev(); }}></div>
            <div className="absolute inset-y-0 right-0 w-1/4 md:hidden z-10" onClick={(e) => { e.stopPropagation(); onNext(); }}></div>
            
            {/* Image Counter Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1c1c1e]/80 text-[#f5f5f7] px-4 py-2 rounded-full text-xs font-mono tracking-widest backdrop-blur-md flex items-center gap-2">
                <span>{currentImageIndex + 1} / {activeTrip.images.length}</span>
                {/* Auto-play indicator */}
                {activeTrip.images.length > 1 && (
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" title="Auto-playing" />
                )}
            </div>
        </div>

        {/* Text Details - Static for the album */}
        <div 
           className="w-full md:max-w-xs xl:max-w-sm text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 flex flex-col justify-center flex-shrink-0"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-8 bg-white/50"></div>
                <span className="text-[#86868b] uppercase tracking-widest text-xs font-medium">{activeTrip.location}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 leading-tight break-keep">
                {activeTrip.title}
            </h2>
            
            <p className="text-[#a1a1a6] leading-7 text-sm font-normal mb-8 break-keep">
                {activeTrip.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-[#636366] uppercase tracking-widest font-mono border-t border-[#333333] pt-6">
                <span>Date</span>
                <span className="text-[#86868b]">{activeTrip.date}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;