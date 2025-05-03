import { RecipeWithParsedFields } from "@shared/schema";

export interface Ingredient {
  name: string;
  amount: string;
}

export type Difficulty = "easy" | "medium" | "hard";

export function getDifficultyClassName(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "difficulty-easy";
    case "medium":
      return "difficulty-medium";
    case "hard":
      return "difficulty-hard";
    default:
      return "difficulty-medium";
  }
}

export function formatPreparationTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} min`;
}

export function getRelatedRecipes(recipes: RecipeWithParsedFields[], currentRecipe: RecipeWithParsedFields): RecipeWithParsedFields[] {
  // Filter recipes by the same category and exclude current recipe
  const sameCategory = recipes.filter(
    (recipe) => recipe.categoryId === currentRecipe.categoryId && recipe.id !== currentRecipe.id
  );
  
  // Return up to 3 related recipes
  return sameCategory.slice(0, 3);
}
