import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { generateRecipeImage } from '../services/geminiService';

interface Props {
  recipe: Recipe;
  onCook: () => void;
  onBack: () => void;
  onUpdateRecipe: (updatedRecipe: Recipe) => void;
}

export const RecipeCard: React.FC<Props> = ({ recipe, onCook, onBack, onUpdateRecipe }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const nutritionData = [
    { name: '탄수화물', value: recipe.nutrition.carbs, color: '#FBBF24' },
    { name: '단백질', value: recipe.nutrition.protein, color: '#F87171' },
    { name: '지방', value: recipe.nutrition.fat, color: '#60A5FA' },
  ];

  useEffect(() => {
    // Generate image if it doesn't exist
    if (!recipe.imageUrl && !isGeneratingImage) {
      setIsGeneratingImage(true);
      generateRecipeImage(recipe)
        .then((url) => {
          if (url) {
            onUpdateRecipe({ ...recipe, imageUrl: url });
          }
        })
        .finally(() => {
          setIsGeneratingImage(false);
        });
    }
  }, [recipe.id]); // Only run when recipe ID changes (or initial mount)

  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto pb-24">
      <div className="bg-white rounded-2xl shadow-xl relative overflow-hidden">
        {/* Generated Image or Placeholder */}
        <div className="h-64 md:h-96 w-full bg-gray-200 relative group overflow-hidden">
           {recipe.imageUrl ? (
             <img 
               src={recipe.imageUrl} 
               alt={recipe.name}
               className="w-full h-full object-cover animate-fade-in"
             />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
               <svg className="animate-spin h-8 w-8 text-brand-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span className="text-sm font-medium text-gray-500">AI가 요리 이미지를 그리고 있어요...</span>
             </div>
           )}
           
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
             <div className="text-white">
                <span className="inline-block px-2 py-1 bg-brand-500 text-xs font-bold rounded mb-2">AI RECOMMENDATION</span>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight shadow-sm">{recipe.name}</h2>
             </div>
           </div>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-gray-600 text-lg mb-8 italic border-l-4 border-brand-200 pl-4">"{recipe.description}"</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Nutrition Chart */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">영양 밸런스</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nutritionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {nutritionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '10px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <span className="text-3xl font-extrabold text-gray-800">{recipe.nutrition.calories}</span>
                <span className="text-sm text-gray-500 ml-1">kcal</span>
              </div>
            </div>

            {/* Ingredients List (Receipt Style) */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-brand-500 rounded-full mr-2"></span>
                준비물 체크리스트
              </h3>
              <ul className="space-y-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center text-base border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                    <span className="text-gray-700 font-medium">{ing}</span>
                    <div className="text-brand-500 bg-brand-50 p-1 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cooking Tips */}
          <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 flex gap-3">
             <div className="text-2xl">💡</div>
             <div>
                <h4 className="font-bold text-yellow-800 text-sm mb-1">셰프의 비밀 팁</h4>
                <p className="text-yellow-900 text-sm leading-relaxed">{recipe.tips}</p>
             </div>
          </div>
        </div>

        {/* Receipt jagged edge effect */}
        <div className="receipt-edge"></div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
        <div className="flex gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-gray-200/50">
          <button 
            onClick={onBack}
            className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            뒤로가기
          </button>
          <button 
            onClick={onCook}
            className="flex-[2] py-3 px-6 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>요리 시작하기</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};