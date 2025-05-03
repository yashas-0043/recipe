import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { RecipeWithParsedFields } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { getDifficultyClassName, formatPreparationTime } from "@/lib/recipes";
import { Button } from "@/components/ui/button";
import { Share2, Printer, Heart, X } from "lucide-react";
import RelatedRecipes from "./RelatedRecipes";
import { useToast } from "@/hooks/use-toast";

interface RecipeDetailViewProps {
  recipeId: number;
  onClose: () => void;
}

const RecipeDetailView = ({ recipeId, onClose }: RecipeDetailViewProps) => {
  const [ingredientChecked, setIngredientChecked] = useState<boolean[]>([]);
  const { toast } = useToast();

  const { data: recipe, isLoading } = useQuery<RecipeWithParsedFields>({
    queryKey: [`/api/recipes/${recipeId}`],
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST",
        `/api/recipes/${recipeId}/favorite`,
        {}
      );
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${recipeId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
    },
  });

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate();
  };

  const handleShareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.title,
        text: recipe?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "The recipe link has been copied to your clipboard.",
      });
    }
  };

  const handlePrintRecipe = () => {
    window.print();
  };

  const toggleIngredientCheck = (index: number) => {
    const newChecked = [...(ingredientChecked.length ? ingredientChecked : Array(recipe?.ingredients.length).fill(false))];
    newChecked[index] = !newChecked[index];
    setIngredientChecked(newChecked);
  };

  if (isLoading || !recipe) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-pulse">
          <div className="h-64 bg-gray-300"></div>
          <div className="p-6">
            <div className="h-8 bg-gray-300 w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 w-full mb-4"></div>
            <div className="h-4 bg-gray-200 w-full mb-4"></div>
            <div className="h-4 bg-gray-200 w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-full p-2 shadow hover:text-primary"
              onClick={handleToggleFavorite}
            >
              <Heart
                size={20}
                className={recipe.favorite ? "fill-primary text-primary" : ""}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-full p-2 shadow hover:text-primary"
              onClick={handleShareRecipe}
            >
              <Share2 size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-full p-2 shadow hover:text-primary"
              onClick={handlePrintRecipe}
            >
              <Printer size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-heading font-bold">
              {recipe.title}
            </h2>

            <div className="flex items-center mt-2 md:mt-0">
              <div className="flex items-center mr-4">
                <svg
                  className="w-4 h-4 text-gray-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{formatPreparationTime(recipe.prepTime)}</span>
              </div>
              <div className="flex items-center mr-4">
                <svg
                  className="w-4 h-4 text-gray-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-sm">{recipe.category}</span>
              </div>
              <span
                className={`${getDifficultyClassName(
                  recipe.difficulty
                )} text-xs px-2 py-1 rounded-lg`}
              >
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{recipe.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-heading font-semibold mb-4">
                Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 mr-2"
                      checked={ingredientChecked[index] || false}
                      onChange={() => toggleIngredientCheck(index)}
                    />
                    <span
                      style={{
                        textDecoration: ingredientChecked[index]
                          ? "line-through"
                          : "none",
                        opacity: ingredientChecked[index] ? 0.6 : 1,
                      }}
                    >
                      {ingredient.amount} {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-heading font-semibold mb-4">
                Instructions
              </h3>
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-8 bg-neutral-light p-4 rounded-lg">
                <h3 className="text-lg font-heading font-semibold mb-2">
                  Chef's Tips
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {recipe.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-heading font-semibold mb-3">
                  Nutrition Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-neutral-light p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Calories</p>
                    <p className="font-semibold">{recipe.nutritionInfo.calories}</p>
                  </div>
                  <div className="bg-neutral-light p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Protein</p>
                    <p className="font-semibold">{recipe.nutritionInfo.protein}</p>
                  </div>
                  <div className="bg-neutral-light p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Carbs</p>
                    <p className="font-semibold">{recipe.nutritionInfo.carbs}</p>
                  </div>
                  <div className="bg-neutral-light p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Fat</p>
                    <p className="font-semibold">{recipe.nutritionInfo.fat}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <RelatedRecipes recipeId={recipe.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailView;
