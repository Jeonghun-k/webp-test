import React from 'react';
import { Recipe } from '../types';

interface Props {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onBack: () => void;
}

export const RecipeList: React.FC<Props> = ({ recipes, onSelect, onBack }) => {
  return (
    <div className="flex flex-col h-full animate-fade-in pb-20 w-full max-w-6xl mx-auto">
      <div className="px-6 py-6 bg-white/50 backdrop-blur sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between mb-4 rounded-b-xl">
         <button 
           onClick={onBack}
           className="text-gray-500 hover:text-gray-800 flex items-center gap-1"
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
           </svg>
           <span className="hidden md:inline font-medium">다시 선택하기</span>
         </button>
         <h2 className="font-bold text-xl text-gray-800">추천 레시피 ({recipes.length})</h2>
         <div className="w-6 md:w-20"></div> {/* Spacer for center alignment */}
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-center mb-8 text-lg">
          재료를 분석하여 3가지 요리를 찾았어요.<br/>
          가장 마음에 드는 요리를 선택해주세요! 👩‍🍳
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe, idx) => (
            <div 
              key={recipe.id}
              onClick={() => onSelect(recipe)}
              className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-200 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 group-hover:bg-brand-500 transition-colors"></div>
              
              <div className="mb-4 mt-2">
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                          {recipe.name}
                      </h3>
                  </div>
                  <span className="inline-block text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-full group-hover:bg-brand-50 group-hover:text-brand-600 mb-3">
                      🔥 {recipe.nutrition.calories} kcal
                  </span>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed h-16">
                      {recipe.description}
                  </p>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400 mb-2 font-medium">주요 재료</p>
                  <div className="flex flex-wrap gap-1.5">
                      {recipe.ingredients.slice(0, 4).map((ing, i) => (
                          <span key={i} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                              {ing}
                          </span>
                      ))}
                      {recipe.ingredients.length > 4 && (
                          <span className="text-xs text-gray-400 px-1 py-1">+</span>
                      )}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};