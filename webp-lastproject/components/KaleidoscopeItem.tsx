import React, { useMemo, useState, useEffect } from 'react';
import { Trip } from '../types';

interface KaleidoscopeItemProps {
  trip: Trip;
  onClick: () => void;
}

const KaleidoscopeItem: React.FC<KaleidoscopeItemProps> = ({ trip, onClick }) => {
  const SLICE_COUNT = 40; 
  const slices = useMemo(() => Array.from({ length: SLICE_COUNT }), []);

  // Double Buffering State
  const [frontImage, setFrontImage] = useState(trip.images[0]);
  const [backImage, setBackImage] = useState(trip.images.length > 1 ? trip.images[1] : trip.images[0]);
  const [showFront, setShowFront] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (trip.images.length <= 1) return;

    const interval = setInterval(() => {
      
      setCurrentIndex((prevIndex) => {
        const nextIdx = (prevIndex + 1) % trip.images.length;
        const subsequentIdx = (nextIdx + 1) % trip.images.length;

        // Toggle Buffer
        setShowFront((prevShowFront) => {
           const isNowShowingFront = !prevShowFront;
           
           // Schedule the update of the HIDDEN layer
           setTimeout(() => {
             if (isNowShowingFront) {
                 setBackImage(trip.images[subsequentIdx]);
             } else {
                 setFrontImage(trip.images[subsequentIdx]);
             }
           }, 1000); 

           return isNowShowingFront;
        });

        return nextIdx;
      });

    }, 3000);

    return () => clearInterval(interval);
  }, [trip.images]); 

  const safeTitle = typeof trip.title === 'string' ? trip.title : 'Untitled';
  const titleParts = safeTitle.split(' ');
  const displayTitle = titleParts.length > 1 
    ? <>{titleParts[0]}<br/><span className="text-slate-500">{titleParts.slice(1).join(' ')}</span></> 
    : safeTitle;

  const safeDate = typeof trip.date === 'string' ? trip.date : '';

  return (
    <div className="group relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center select-none m-4 isolation-isolate">
        
      {/* The Kaleidoscope Ring */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden animate-[spin_60s_linear_infinite] group-hover:animate-[spin_10s_linear_infinite] transition-all duration-700 cursor-pointer z-0"
        onClick={onClick}
      >
        {slices.map((_, index) => {
            const rotation = (360 / SLICE_COUNT) * index;
            const bgPositionX = (index / SLICE_COUNT) * 100;
            
            return (
            <div
                key={index}
                className="absolute top-1/2 left-1/2 origin-left"
                style={{
                    transform: `translateY(-50%) rotate(${rotation}deg)`,
                    width: '50%', 
                    height: `${(3.14 * 100) / SLICE_COUNT + 1}%`, 
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', 
                }}
            >
                {/* Layer 1: Front Image */}
                <div 
                    className="w-[100vh] h-[100%] absolute top-0 left-0 transition-opacity duration-1000 ease-in-out"
                    style={{
                        backgroundImage: `url(${frontImage})`,
                        backgroundSize: 'cover', 
                        backgroundPosition: `${bgPositionX}% center`, 
                        filter: 'saturate(1.2) contrast(1.1)',
                        opacity: showFront ? 1 : 0,
                        zIndex: 2
                    }}
                />

                {/* Layer 2: Back Image */}
                <div 
                    className="w-[100vh] h-[100%] absolute top-0 left-0 transition-opacity duration-1000 ease-in-out"
                    style={{
                        backgroundImage: `url(${backImage})`,
                        backgroundSize: 'cover', 
                        backgroundPosition: `${bgPositionX}% center`, 
                        filter: 'saturate(1.2) contrast(1.1)',
                        opacity: showFront ? 0 : 1,
                        zIndex: 1
                    }}
                />
            </div>
            );
        })}
        {/* Inner shadow */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] pointer-events-none z-10"></div>
      </div>

      {/* The Center "Eye" */}
      <div 
        className="absolute w-32 h-32 bg-[#1c1c1e] rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center z-20 cursor-pointer group-hover:scale-95 transition-transform duration-300 border border-[#333333]"
        onClick={onClick}
      >
          <h3 className="text-white font-serif font-black text-xl leading-none uppercase tracking-tighter">
            {displayTitle}
          </h3>
          <p className="text-[10px] text-[#86868b] mt-2 font-mono tracking-[0.2em] uppercase">
            {safeDate.split('.')[0]}
          </p>
          <p className="text-[9px] text-[#636366] mt-1 font-mono">
             {trip.images.length} PHOTOS
          </p>
      </div>

      {/* Thumbnail Overlay */}
      <div 
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-24 h-16 bg-white p-1 shadow-2xl transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
          <div className="w-full h-full overflow-hidden bg-slate-200 relative">
             <img src={frontImage} alt="thumbnail-front" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showFront ? 'opacity-100' : 'opacity-0'}`} />
             <img src={backImage} alt="thumbnail-back" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showFront ? 'opacity-0' : 'opacity-100'}`} />
            
            <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[8px] px-1 z-10">
                {currentIndex + 1}/{trip.images.length}
            </div>
          </div>
          {/* Tape effect */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/30 rotate-2 backdrop-blur-sm shadow-sm"></div>
      </div>

    </div>
  );
};

export default KaleidoscopeItem;