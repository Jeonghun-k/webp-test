import React, { useState } from 'react';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import { CookingMode } from './components/CookingMode';
import { RecipeList } from './components/RecipeList';
import { generateRecipesFromIngredients } from './services/geminiService';
import { AppView, Recipe } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (ingredients.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const generatedRecipes = await generateRecipesFromIngredients(ingredients);
      setRecipes(generatedRecipes);
      setView(AppView.SELECTION);
    } catch (err) {
      console.error(err);
      setError("앗! 셰프가 잠시 쉬고 있어요. 인터넷 연결이나 API 키를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView(AppView.RESULT);
    // Image generation is now handled inside RecipeCard component
  };

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    // Update the selected recipe