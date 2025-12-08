import React from 'react';
import { GOALS } from '../constants';
import { Map, Zap, Heart, Mountain } from 'lucide-react';

const Goals: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'mountain': return <Mountain className="w-8 h-8 text-white" strokeWidth={1} />;
      case 'compass': return <Map className="w-8 h-8 text-white" strokeWidth={1} />;
      case 'rocket': return <Zap className="w-8 h-8 text-white" strokeWidth={1} />;
      case 'heart': return <Heart className="w-8 h-8 text-white" strokeWidth={1} />;
      default: return <Mountain />;
    }
  };

  return (
    <div className="w-full py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-[#333333] pb-8">
            <div>
                <span className="text-[#86868b] text-xs font-semibold tracking-[0.2em] uppercase mb-2 block">Vision</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white">
                    미래 계획
                </h2>
            </div>
            <p className="text-[#86868b] text-sm mt-4 md:mt-0 font-normal max-w-sm text-right">
                단순한 꿈이 아닌, 실현 가능한 이정표들
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GOALS.map((goal, idx) => (
                <div 
                    key={goal.id} 
                    className="relative p-10 bg-[#1c1c1e] rounded-3xl transition-transform duration-300 hover:scale-[1.02] flex flex-col items-start gap-8"
                >
                    <div className="mb-2">
                        {getIcon(goal.icon)}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between h-full">
                        <div>
                            <h3 className="text-2xl font-semibold text-white mb-4 leading-tight break-keep">
                                {goal.title}
                            </h3>
                            <p className="text-[#a1a1a6] text-base leading-relaxed break-keep">
                                {goal.description}
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mt-8">
                            {goal.timeframe}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Goals;