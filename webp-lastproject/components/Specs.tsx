import React from 'react';
import { SKILLS } from '../constants';
import { Cpu, Palette, Globe } from 'lucide-react';

const Specs: React.FC = () => {
  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Tech': return <Cpu size={20} />;
      case 'Creative': return <Palette size={20} />;
      case 'Language': return <Globe size={20} />;
      default: return <Cpu size={20} />;
    }
  };

  return (
    <div className="w-full py-40 bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center mb-24 text-center">
             <span className="text-[#86868b] text-xs font-semibold tracking-[0.2em] uppercase mb-4">Capabilities</span>
             <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                스펙 및 기술
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
            {SKILLS.map((skill, idx) => (
                <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-4 text-white text-xl font-medium">
                            <span className="text-[#86868b]">{getIcon(skill.category)}</span>
                            <span>{skill.name}</span>
                        </div>
                        <span className="text-[#86868b] font-mono text-sm">{skill.level}%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="h-[2px] w-full bg-[#333333] rounded-none overflow-hidden relative">
                        {/* Animated Bar */}
                        <div 
                            className="h-full bg-white transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Specs;