import React from 'react';
import { PROJECTS } from '../constants';
import { ExternalLink, FolderGit2 } from 'lucide-react';

const Projects: React.FC = () => {
  return (
    <div className="w-full py-40 bg-[#0a0a0a] min-h-screen px-6">
      <div className="max-w-6xl mx-auto">
         <div className="flex flex-col items-center mb-24 text-center animate-in fade-in slide-in-from-top-4 duration-700">
             <span className="text-[#86868b] text-xs font-semibold tracking-[0.2em] uppercase mb-4">Portfolio</span>
             <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                프로젝트
            </h2>
             <p className="text-[#86868b] mt-4 max-w-xl">
                아이디어를 코드로 실현한 결과물들입니다.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, index) => (
                <div 
                    key={project.id} 
                    className="bg-[#1c1c1e] rounded-3xl p-8 border border-[#333] hover:border-[#666] transition-all duration-300 group flex flex-col h-full animate-in fade-in slide-in-from-bottom-8"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-3 bg-black/50 rounded-2xl text-white group-hover:text-[#ff453a] transition-colors">
                             <FolderGit2 size={24} />
                        </div>
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noreferrer" className="text-[#86868b] hover:text-white transition-colors">
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>
                    
                    <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#ff453a] transition-colors">
                        {project.title}
                    </h3>
                    
                    <p className="text-[#a1a1a6] text-sm leading-relaxed mb-8 flex-1">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.techStack.map((tech, i) => (
                            <span key={i} className="text-[10px] font-mono uppercase tracking-wider text-[#86868b] bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default Projects;