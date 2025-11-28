import React, { useState, KeyboardEvent } from 'react';
import { IngredientChipProps } from '../types';

const IngredientChip: React.FC<IngredientChipProps> = ({ name, onRemove }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-900 mr-2 mb-2 animate-fade-in-up">
    {name}
    <button
      onClick={() => onRemove(name)}
      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-brand-500 hover:bg-brand-200 focus:outline-none"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </span>
);

interface Props {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

export const IngredientInput: React.FC<Props> = ({ ingredients, setIngredients }) => {
  const [input, setInput] = useState('');

  const addIngredient = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Prevent duplicate submission during IME composition (Korean/Japanese/Chinese)
    if (e.nativeEvent.isComposing) return;
    
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  const removeIngredient = (name: string) => {
    setIngredients(ingredients.filter(i => i !== name));
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="재료 입력 (예: 계란, 양파, 스팸)"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 outline-none transition-all"
        />
        <button
          onClick={addIngredient}
          className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-brand-100 whitespace-nowrap"
        >
          추가
        </button>
      </div>
      
      <div className="flex flex-wrap min-h-[60px] p-4 bg-white rounded-xl border border-dashed border-gray-300">
        {ingredients.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic">
            냉장고가 텅 비었네요... 재료를 넣어주세요!
          </div>
        ) : (
          ingredients.map(ing => (
            <IngredientChip key={ing} name={ing} onRemove={removeIngredient} />
          ))
        )}
      </div>
    </div>
  );
};