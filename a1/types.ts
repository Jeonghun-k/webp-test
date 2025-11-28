
export interface Nutrition {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tips: string;
  nutrition: Nutrition;
  imageUrl?: string;
}

export enum AppView {
  HOME = 'HOME',
  SELECTION = 'SELECTION',
  RESULT = 'RESULT',
  COOKING = 'COOKING',
}

export interface IngredientChipProps {
  name: string;
  onRemove: (name: string) => void;
}
