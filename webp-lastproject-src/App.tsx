import React, { useState, useEffect, useRef } from 'react';
import { Trip } from './types';
import KaleidoscopeItem from './components/KaleidoscopeItem';
import ImageViewer from './components/ImageViewer';
import UploadModal from './components/UploadModal';
import Specs from './components/Specs';
import Goals from './components/Goals';
import Projects from './components/Projects';
import { CERTIFICATIONS } from './constants';
import { User, Camera, Code, ImagePlus, RotateCcw, Wine, Music, Droplets, ArrowRight, Award, CheckCircle2, Github, QrCode, X, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  // Use a new key 'vanderlust_trips_v3' to ensure a fresh start without old mock data
  const STORAGE_KEY = 'vanderlust_trips_v3';
  const PROFILE_IMG_KEY = 'vanderlust_profile_img';
  
  // GitHub URL Constant
  const GITHUB_URL = "https://github.com/Jeonghun-k"; 

  // State for Navigation View: 'home' | 'about' | 'specs' | 'project'
  const [view, setView] = useState<'home' | 'about' | 'specs' | 'project'>('home');
  
  // State to track if the Gallery section is currently in view (for nav highlighting)
  const [isGalleryActive, setIsGalleryActive] = useState(false);

  // Initialize state from Local Storage or fallback to empty array
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const savedTrips = localStorage.getItem(STORAGE_KEY);
      return savedTrips ? JSON.parse(savedTrips) : [];
    } catch (e) {
      console.error("Failed to load from local storage", e);
      return [];
    }
  });
  
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  
  // State for Profile Image
  const [profileImage, setProfileImage] = useState<string>('./me.jpg');
  const [profileImageError, setProfileImageError] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Load Profile Image from Storage
  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_IMG_KEY);
    if (savedProfile) {
      setProfileImage(savedProfile);
    }
  }, []);

  // State for Tastes Section Navigation
  const [activeTasteCategory, setActiveTasteCategory] = useState<string>('와인');

  // Life History Data
  const historyItems = [
    { year: '2002.05', desc: ['부산 영도구 출생', '1남 1녀 중 장남'] },
    { year: '2021.03', desc: ['경성대학교', '소프트웨어학과 입학'] },
    { year: '2024.05', desc: ['공군 병 전역 및', '임기제부사관 임관'] },
    { year: '2024.12', desc: ['임기제 부사관 전역'] },
    { year: '2025.01', desc: ['6개월 프랑스 리옹', '어학연수'] },
  ];

  // Hobbies / Tastes Data
  const hobbies = [
    {
      category: "와인",
      icon: <Wine size={18} />,
      description: "기억에 남는 빈티지와 노트들",
      items: [
        { name: "Domaine Guiberteau 2021", sub: "도멘 기베르토 2021" },
        { name: "Marsannay 2023", sub: "마르사네 2023" },
        { name: "Gevrey-chamberin 2021", sub: "제브레 샹베르탱 2021" },
        { name: "Cloudy Bay Sauvignon Blanc", sub: "클라우디 베이 소비뇽 블랑" },
        { name: "DOUDET -NAUDIN 2023", sub: "두데 노당 2023" }
      ]
    },
    {
      category: "클래식",
      icon: <Music size={18} />,
      description: "영감을 주는 선율과 교향곡",
      items: [
        { name: "Rachmaninoff - Piano Concerto No. 2", sub: "라흐마니노프 피아노협주곡 2번 2,3악장" },
        { name: "Bolcom - Graceful Ghost Rag", sub: "볼컴 우아한 유령" },
        { name: "Liszt - Liebestraum No. 3", sub: "리스트 사랑의 꿈" },
        { name: "Ravel - Piano Concerto in G Major", sub: "라벨 피아노협주곡 2악장" },
        { name: "Tchaikovsky - Violin Concerto", sub: "차이코프스키 바이올린협주곡 3악장" }
      ]
    },
    {
      category: "향수",
      icon: <Droplets size={18} />,
      description: "나를 표현하는 향기의 기록",
      items: [
        { name: "Byredo - Mojave Ghost", sub: "바이레도 - 모하비 고스트" },
        { name: "Acqua di Parma - Fico di Amalfi", sub: "아쿠아 디 파르마 - 피고 디 아말피" },
        { name: "Diptyque - Do Son", sub: "딥디크 - 도 손" },
        { name: "Frederic Malle - Portrait of a Lady", sub: "프레데릭 말 - 포트레이트 오브 어 레이디" },
        { name: "Daniel Truth - Bombshell", sub: "다니엘 트루스 - 밤쉘루스" }
      ]
    },
    {
      category: "사진",
      icon: <Camera size={18} />,
      description: "프레임 안에서 멈춘 시간의 미학",
      items: [] // Items are handled conditionally in render
    }
  ];

  // Save to Local Storage whenever trips change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error("Failed to save to local storage", e);
      // Alert user if quota exceeded
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("저장 용량이 부족하여 변경사항을 저장할 수 없습니다. 일부 앨범을 삭제해주세요.");
      }
    }
  }, [trips]);

  // Scroll Spy for Gallery Section
  useEffect(() => {
    if (view !== 'home') {
      setIsGalleryActive(false);
      return;
    }

    const handleScroll = () => {
      const gallerySection = document.getElementById('gallery-section');
      if (!gallerySection) return;

      const rect = gallerySection.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.6) {
        setIsGalleryActive(true);
      } else {
        setIsGalleryActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const openModal = (trip: Trip) => {
    setActiveTrip(trip);
  };

  const closeModal = () => {
    setActiveTrip(null);
  };

  const handleResetData = () => {
    if (window.confirm('모든 앨범 데이터를 완전히 삭제하시겠습니까? (복구 불가)')) {
      setTrips([]);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PROFILE_IMG_KEY);
      setProfileImage('./me.jpg');
    }
  };

  const handleNewTripUpload = (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        setProfileImageError(false);
        try {
          localStorage.setItem(PROFILE_IMG_KEY, result);
        } catch (error) {
          alert('이미지 용량이 너무 커서 저장되지 않을 수 있습니다.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Navigation Handlers ---

  const goHomeTop = () => {
    setView('home');
    window.scrollTo(0, 0); 
  };

  const goToGallery = () => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        const element = document.getElementById('gallery-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('gallery-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToAbout = () => {
    setView('about');
    window.scrollTo(0, 0); 
  };

  const goToSpecs = () => {
    setView('specs');
    window.scrollTo(0, 0);
  };

  const goToProjects = () => {
    setView('project');
    window.scrollTo(0, 0);
  };

  return (
    // Changed bg-black to bg-[#0a0a0a] for a matte black finish
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f7] selection:bg-white/20 selection:text-white">
      
      {/* --- FLOATING NAVIGATION (Sticky) --- */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-6 md:gap-8">
          {/* Red Badge - Click to go home top */}
          <div 
            onClick={goHomeTop}
            className="cursor-pointer w-14 h-14 md:w-16 md:h-16 bg-[#d00000] rounded-full flex flex-col justify-center items-center text-white shadow-xl hover:scale-105 transition-transform duration-300 ease-out z-50"
          >
              <span className="text-[9px] md:text-[10px] font-light leading-tight">jeonghun</span>
              <span className="text-xs md:text-sm font-bold leading-tight">KWAK</span>
          </div>

          {/* Menu Items */}
          <nav className="flex gap-6 md:gap-8 mix-blend-difference text-white">
              <div 
                  onClick={goToGallery}
                  className={`flex flex-col text-[10px] md:text-xs font-serif italic leading-tight cursor-pointer hover:text-red-500 transition-colors ${view === 'home' && isGalleryActive ? 'text-red-500' : ''}`}
              >
                  <span>Photo</span>
                  <span>Graph</span>
              </div>
              <div 
                  onClick={goToAbout}
                  className={`flex flex-col text-[10px] md:text-xs font-serif italic leading-tight cursor-pointer hover:text-red-500 transition-colors ${view === 'about' ? 'text-red-500' : ''}`}
              >
                  <span>About</span>
                  <span>Me</span>
              </div>
              <div 
                  onClick={goToSpecs}
                  className={`flex flex-col text-[10px] md:text-xs font-serif italic leading-tight cursor-pointer hover:text-red-500 transition-colors ${view === 'specs' ? 'text-red-500' : ''}`}
              >
                  <span>My</span>
                  <span>Specification</span>
              </div>
              <div 
                  onClick={goToProjects}
                  className={`flex flex-col text-[10px] md:text-xs font-serif italic leading-tight cursor-pointer hover:text-red-500 transition-colors ${view === 'project' ? 'text-red-500' : ''}`}
              >
                  <span>My</span>
                  <span>Project</span>
              </div>
          </nav>
      </div>

      {/* --- PAGE CONTENT --- */}
      
      {view === 'home' && (
        <>
            {/* --- HERO SECTION (Dark Ambient Style) --- */}
            <header className="relative w-full h-screen bg-[#000000] flex flex-col items-center justify-center overflow-hidden px-6">
                
                {/* Ambient Light Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Top Left - Purple/Blue Glow */}
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#1a0b2e] rounded-full blur-[150px] opacity-40 animate-pulse"></div>
                    {/* Bottom Right - Dark Blue Glow */}
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#0b1a2e] rounded-full blur-[120px] opacity-30"></div>
                </div>

                <div className="z-10 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
                    <h1 className="text-[7rem] md:text-[14rem] script-font text-white mb-0 md:mb-4 leading-none select-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        Flâneur
                    </h1>
                    <p className="text-sm md:text-xl font-light text-[#86868b] mt-2 md:mt-0 tracking-[0.2em] uppercase">
                        산책자 : 여유로운 삶을 추구하다
                    </p>
                </div>

                {/* Scroll Down Indicator */}
                <div 
                    onClick={goToGallery}
                    className="absolute bottom-12 flex flex-col items-center gap-2 cursor-pointer animate-bounce text-[#86868b] hover:text-white transition-colors duration-300"
                >
                    <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
                    <ChevronDown size={20} strokeWidth={1} />
                </div>
            </header>

            {/* --- KALEIDOSCOPE GALLERY --- */}
            <section id="gallery-section" className="py-40 bg-transparent min-h-screen">
                <div className="text-center mb-32 px-6 flex flex-col items-center">
                    <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">나를 만든 경험</h2>
                    
                    <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-[#1c1c1e] rounded-full hover:bg-[#2c2c2e] transition-colors duration-300 border border-[#333]"
                    >
                    <ImagePlus size={20} className="text-white"/>
                    <span className="text-white text-sm font-medium">앨범 추가하기</span>
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    {trips.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-[#333] rounded-3xl">
                            <p className="text-[#555]">아직 등록된 앨범이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24 justify-items-center">
                            {trips.map((trip) => (
                                <KaleidoscopeItem 
                                    key={trip.id} 
                                    trip={trip} 
                                    onClick={() => openModal(trip)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
      )}

      {view === 'about' && (
        // Changed container to flex-col and added padding-top to allow scrolling content
        <div className="min-h-screen flex flex-col items-center bg-[#0a0a0a] pt-32 pb-20 px-6">
            
            {/* --- PROFILE & INTRO --- */}
            <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-32 mb-40 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-full md:w-1/3 flex flex-col justify-center items-center gap-6">
                    {/* Minimalist Profile Container */}
                    <div className="w-64 h-64 rounded-full bg-[#1c1c1e] flex items-center justify-center shadow-2xl overflow-hidden border border-[#333]">
                        {!profileImageError ? (
                            <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={() => setProfileImageError(true)}
                            />
                        ) : (
                            <User size={80} strokeWidth={1} className="text-[#86868b]" />
                        )}
                    </div>

                    {/* Change Photo Button */}
                    <input 
                        type="file" 
                        ref={profileInputRef}
                        onChange={handleProfileImageChange}
                        className="hidden" 
                        accept="image/*"
                    />
                    <button 
                        onClick={() => profileInputRef.current?.click()}
                        className="flex items-center gap-2 text-[#86868b] hover:text-white transition-colors text-xs tracking-widest uppercase border border-[#333] px-4 py-2 rounded-full hover:bg-[#1c1c1e]"
                    >
                        <Camera size={14} />
                        <span>Change Photo</span>
                    </button>
                </div>
                
                <div className="w-full md:w-2/3 space-y-10">
                    <div className="space-y-4">
                        <span className="text-[#86868b] text-xs font-semibold tracking-[0.2em] uppercase">Introduction</span>
                        <h2 className="text-4xl md:text-6xl font-serif text-white font-medium tracking-tight">곽정훈</h2>
                    </div>
                    
                    <div className="text-[#a1a1a6] leading-9 font-normal text-xl space-y-8">
                        <p>
                            안녕하세요 저는 다양한 문화들을 알아가고, 경험하고픈 경성대 2학년 곽정훈입니다. 제가 가장 좋아하는 단어가있는데요. 바로 <strong className="text-white">Just Do It</strong> 입니다. 공부든, 경험이든, 낯선 곳으로 가는것이든 말이죠.
                        </p>
                        <p>
                            이 웹사이트는 저의 취향을 담은 자기소개 사이트입니다. 제 소개, 스팩, 프로젝트들을 확인 하실수있습니다. 방문하는 분들에게 연속되는 이미지 잔상으로 보여드리고 싶었습니다.
                        </p>
                    </div>

                    <div className="flex gap-8 pt-6 border-t border-[#333]">
                        <div className="flex items-center gap-3 text-[#86868b] text-sm font-medium uppercase tracking-wider">
                            <Code size={18} /> <span>Developer</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LIFE HISTORY --- */}
            <section className="w-full max-w-7xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 mb-40">
                {/* Header with Lines */}
                <div className="flex items-center justify-center gap-6 md:gap-10 w-full mb-20 md:mb-28">
                    <div className="h-[1px] bg-[#333] flex-1 max-w-xs"></div>
                    <h3 className="font-serif text-3xl md:text-4xl text-white tracking-wide">Life History</h3>
                    <div className="h-[1px] bg-[#333] flex-1 max-w-xs"></div>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 w-full text-center">
                    {historyItems.map((item, index) => (
                        <div key={index} className="flex flex-col items-center group cursor-default">
                             <div className="text-4xl md:text-5xl font-serif text-[#f5f5f7] mb-8 group-hover:text-[#ff453a] transition-colors duration-300 whitespace-nowrap leading-none">
                                {item.year}
                             </div>
                             <div className="text-[#86868b] text-sm md:text-base leading-relaxed font-normal">
                                {item.desc.map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < item.desc.length - 1 && <br/>}
                                    </React.Fragment>
                                ))}
                             </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- TASTES SECTION (SIDEBAR LAYOUT) --- */}
            <section className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24">
                    
                    {/* Left: Navigation Sidebar - Reduced width */}
                    <div className="w-full md:w-1/5 flex flex-col md:sticky md:top-32 h-fit flex-shrink-0">
                         <div className="mb-8 md:mb-12 pb-4 border-b border-[#333]">
                             <span className="text-[#86868b] text-xs font-semibold tracking-[0.2em] uppercase mb-2 block">Curated</span>
                             <h3 className="font-serif text-3xl md:text-4xl text-white">취미</h3>
                         </div>
                         
                         <div className="flex flex-col gap-1">
                            {hobbies.map((hobby) => (
                                <button
                                    key={hobby.category}
                                    onClick={() => setActiveTasteCategory(hobby.category)}
                                    className={`group flex items-center justify-between w-full p-4 rounded-xl text-left transition-all duration-300 ${
                                        activeTasteCategory === hobby.category 
                                        ? 'bg-[#1c1c1e] text-white' 
                                        : 'text-[#86868b] hover:text-[#d1d1d1] hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`transition-colors duration-300 ${
                                            activeTasteCategory === hobby.category ? 'text-[#ff453a]' : 'text-[#555] group-hover:text-[#888]'
                                        }`}>
                                            {hobby.icon}
                                        </span>
                                        <span className={`text-base md:text-lg font-serif tracking-wide ${
                                            activeTasteCategory === hobby.category ? 'font-medium' : 'font-light'
                                        }`}>
                                            {hobby.category}
                                        </span>
                                    </div>
                                    {activeTasteCategory === hobby.category && (
                                        <ArrowRight size={14} className="text-[#ff453a] animate-in fade-in slide-in-from-left-2" />
                                    )}
                                </button>
                            ))}
                         </div>
                    </div>

                    {/* Right: Content Area */}
                    <div className="flex-1 min-h-[500px] border-l border-[#333] border-opacity-0 md:border-opacity-100 pl-0 md:pl-12 pt-4 md:pt-0">
                        {hobbies.map((hobby) => {
                            if (hobby.category !== activeTasteCategory) return null;
                            
                            return (
                                <div key={hobby.category} className="animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="mb-12">
                                        <h4 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-tight">
                                            {hobby.category}
                                        </h4>
                                        <p className="text-[#86868b] text-sm tracking-widest uppercase font-medium">
                                            {hobby.description}
                                        </p>
                                    </div>

                                    {/* Conditional Render for Photography vs List */}
                                    {hobby.category === '사진' ? (
                                        <div className="text-[#a1a1a6] text-lg font-light leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <p className="mb-8">
                                                셔터를 누르는 순간, 흐르던 시간은 멈추고 찰나는 영원이 됩니다.
                                            </p>
                                            <p className="mb-8">
                                                저에게 사진은 단순한 기록을 넘어, 무심코 지나칠 수 있는 일상의 조각들을 저만의 시선으로 재해석하는 과정입니다. 
                                                완벽한 구도나 기술적인 선명함보다는, 그 순간의 공기와 온도, 그리고 피사체에 담긴 이야기를 뷰파인더에 담아내려 노력합니다.
                                            </p>
                                            <p>
                                                낯선 도시의 골목길에서, 혹은 매일 걷는 산책로에서 마주하는 빛과 그림자의 유희는 저에게 끊임없는 영감을 줍니다.
                                            </p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-0">
                                            {hobby.items.map((item, i) => {
                                                const itemMain = typeof item === 'string' ? item : item.name;
                                                const itemSub = typeof item === 'string' ? null : item.sub;
                                                
                                                return (
                                                <li 
                                                    key={i} 
                                                    className={`
                                                        group transition-all duration-300 border-b relative overflow-hidden
                                                        ${i === 0 ? 'py-10 border-[#ff453a]/30' : 'py-6 border-[#1c1c1e] hover:border-[#333] flex items-baseline gap-8'}
                                                    `}
                                                >
                                                    {i === 0 ? (
                                                        <div className="relative pl-2">
                                                            {/* Background Number */}
                                                            <span className="absolute -top-4 -left-6 text-[5rem] md:text-[6rem] font-serif font-bold text-[#ff453a] opacity-10 select-none leading-none">01</span>
                                                            
                                                            {/* Foreground Content */}
                                                            <div className="relative z-10 flex flex-col gap-2">
                                                                <span className="text-[#ff453a] text-xs font-bold tracking-[0.3em] uppercase">My Best Pick</span>
                                                                <span className="text-3xl md:text-5xl font-serif text-white font-medium leading-tight whitespace-nowrap group-hover:text-[#ff453a] transition-colors">
                                                                    {itemMain}
                                                                </span>
                                                                {itemSub && (
                                                                    <span className="text-base text-[#888] font-normal mt-1 block">
                                                                        {itemSub}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="text-[#333] font-mono text-xs md:text-sm w-8 group-hover:text-[#ff453a] transition-colors duration-300 flex-shrink-0">
                                                                {i + 1 < 10 ? `0${i + 1}` : i + 1}
                                                            </span>
                                                            <div className="flex flex-col">
                                                                <span className="text-[#a1a1a6] text-xl md:text-2xl font-light tracking-wide group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                                                                    {itemMain}
                                                                </span>
                                                                {itemSub && (
                                                                    <span className="text-sm text-[#555] group-hover:text-[#888] font-normal mt-1 transition-colors duration-300">
                                                                        {itemSub}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </li>
                                            )})}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
      )}

      {view === 'specs' && (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 flex flex-col items-center">
             
             {/* Header */}
             <div className="flex flex-col items-center mb-24 animate-in fade-in slide-in-from-top-4 duration-700">
                <span className="text-[#86868b] text-xs font-semibold tracking-[0.2em] uppercase mb-4">Achievement</span>
                <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight">자격증 및 기술</h2>
             </div>

             {/* 1. Certification Timeline */}
             <section className="w-full max-w-7xl mx-auto mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 px-6">
                <h3 className="text-2xl font-serif text-white mb-16 flex items-center gap-3">
                    <Award className="text-[#ff453a]" size={28} />
                    <span>Certification Timeline</span>
                </h3>
                
                {/* Responsive Timeline Container: Vertical on Mobile, Horizontal on Desktop */}
                <div className="relative">
                    {/* Desktop Horizontal Line */}
                    <div className="hidden md:block absolute top-[5px] left-0 w-full h-[1px] bg-[#333]"></div>
                    
                    {/* Mobile Vertical Line */}
                    <div className="md:hidden absolute left-[5px] top-0 bottom-0 w-[1px] bg-[#333]"></div>

                    <div className="flex flex-col md:flex-row gap-12 md:gap-0">
                        {[...CERTIFICATIONS].reverse().map((cert, index) => (
                            <div key={cert.id} className="relative pl-8 md:pl-0 md:pt-10 group flex-1 min-w-[180px]">
                                
                                {/* Dot - Responsive positioning */}
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#333] group-hover:bg-[#ff453a] group-hover:scale-150 transition-all duration-300 border border-[#0a0a0a] 
                                    left-[1px] top-2 
                                    md:left-0 md:top-[1px]
                                "></div>
                                
                                <div className="flex flex-col gap-2 pr-4">
                                    <span className="font-mono text-[#ff453a] text-sm font-medium block">
                                        {cert.date}
                                    </span>
                                    <div>
                                        <h4 className="text-lg md:text-xl text-white font-medium mb-1 group-hover:translate-x-1 md:group-hover:translate-x-0 md:group-hover:-translate-y-1 transition-transform duration-300 leading-tight">
                                            {cert.title}
                                        </h4>
                                        <p className="text-[#86868b] text-xs md:text-sm">{cert.issuer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </section>

             {/* 2. Certification List Table */}
             <section className="w-full max-w-4xl mx-auto mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                 <div className="flex items-center justify-between mb-8 border-b border-[#333] pb-4">
                     <h3 className="text-xl font-serif text-white">전체 목록</h3>
                     <span className="text-[#86868b] text-xs font-mono">TOTAL {CERTIFICATIONS.length}</span>
                 </div>

                 <div className="w-full overflow-hidden rounded-2xl border border-[#1c1c1e] bg-[#111]">
                     <div className="grid grid-cols-12 bg-[#1c1c1e] py-4 px-6 text-xs text-[#86868b] font-semibold uppercase tracking-wider">
                         <div className="col-span-3 md:col-span-2">Date</div>
                         <div className="col-span-6 md:col-span-5">Title</div>
                         <div className="col-span-3 md:col-span-5 text-right md:text-left">Issuer</div>
                     </div>
                     <div className="divide-y divide-[#1c1c1e]">
                         {CERTIFICATIONS.map((cert) => (
                             <div key={cert.id} className="grid grid-cols-12 py-5 px-6 hover:bg-white/5 transition-colors items-center group">
                                 <div className="col-span-3 md:col-span-2 text-[#ff453a] font-mono text-xs md:text-sm">
                                     {cert.date}
                                 </div>
                                 <div className="col-span-6 md:col-span-5 text-white font-medium text-sm md:text-base pr-4">
                                     {cert.title}
                                     {cert.description && (
                                         <p className="hidden md:block text-[#666] text-xs mt-1 font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                                             {cert.description}
                                         </p>
                                     )}
                                 </div>
                                 <div className="col-span-3 md:col-span-5 text-[#86868b] text-xs md:text-sm text-right md:text-left">
                                     {cert.issuer}
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </section>

             {/* 3. Specs (Skills) Component Integration */}
             <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                 <Specs />
                 
                 {/* Github Button & QR Code */}
                 <div className="w-full flex justify-center gap-4 bg-black pb-32 -mt-20">
                     <a 
                        href={GITHUB_URL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1c1c1e] border border-[#333] hover:border-[#666] hover:bg-[#2c2c2e] transition-all duration-300 group"
                     >
                        <Github size={16} className="text-[#86868b] group-hover:text-white transition-colors" />
                        <span className="text-xs text-[#86868b] group-hover:text-white font-medium tracking-wide transition-colors">GitHub Profile</span>
                     </a>
                     
                     <button
                        onClick={() => setIsQrModalOpen(true)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1c1c1e] border border-[#333] hover:border-[#666] hover:bg-[#2c2c2e] transition-all duration-300 group"
                        title="Show GitHub QR Code"
                     >
                        <QrCode size={16} className="text-[#86868b] group-hover:text-white transition-colors" />
                     </button>
                 </div>
             </div>

             {/* 4. Goals Component Integration */}
             <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                 <Goals />
             </div>

        </div>
      )}

      {/* --- NEW PROJECT SECTION --- */}
      {view === 'project' && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
           <Projects />
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="w-full py-24 text-center bg-[#0a0a0a] border-t border-[#1c1c1e]">
        <div className="flex flex-col items-center gap-6">
            <h3 className="font-serif text-2xl text-white">VANDERLUST</h3>
            <p className="text-[#86868b] text-xs">
                © {new Date().getFullYear()} All rights reserved.
            </p>
            {/* Reset Button */}
            <button 
              onClick={handleResetData}
              className="mt-4 flex items-center gap-2 text-[#333] hover:text-[#ff453a] transition-colors text-xs uppercase tracking-widest"
            >
               <RotateCcw size={12} /> Clear All Data
            </button>
        </div>
      </footer>


      {/* --- MODAL (Image Viewer) --- */}
      {activeTrip && (
        <ImageViewer 
            activeTrip={activeTrip}
            onClose={closeModal} 
        />
      )}

      {/* --- MODAL (Upload) --- */}
      {isUploadModalOpen && (
        <UploadModal 
            onClose={() => setIsUploadModalOpen(false)} 
            onUpload={handleNewTripUpload}
        />
      )}
      
      {/* --- MODAL (QR Code) --- */}
      {isQrModalOpen && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center gap-6 max-w-xs w-full shadow-2xl animate-in zoom-in-95 duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
             <button 
               onClick={() => setIsQrModalOpen(false)}
               className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
             >
               <X size={20} />
             </button>

             <h3 className="text-black font-serif text-2xl font-medium">Scan to GitHub</h3>
             
             {/* QR Code Image using public API */}
             <div className="p-2 border-2 border-gray-100 rounded-xl">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=000000&bgcolor=ffffff&data=${encodeURIComponent(GITHUB_URL)}`} 
                    alt="GitHub QR Code" 
                    className="w-48 h-48 mix-blend-multiply"
                 />
             </div>
             
             <p className="text-gray-500 text-xs text-center leading-relaxed">
               카메라로 스캔하여<br/>깃허브 프로필로 바로 이동하세요.
             </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;