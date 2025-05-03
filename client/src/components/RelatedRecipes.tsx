import { useQuery } from "@tanstack/react-query";
import { RecipeWithParsedFields } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { getDifficultyClassName, formatPreparationTime } from "@/lib/recipes";

interface RelatedRecipesProps {
  recipeId: number;
}

const RelatedRecipes = ({ recipeId }: RelatedRecipesProps) => {
  const [location, navigate] = useLocation();
  
  const { data: relatedRecipes, isLoading } = useQuery<RecipeWithParsedFields[]>({
    queryKey: [`/api/recipes/${recipeId}/related`],
  });

  const handleRelatedRecipeClick = (id: number) => {
    navigate(`/recipe/${id}`);
  };

  if (isLoading) {
    return (
      <>
        <h3 className="text-xl font-heading font-semibold mb-4">You Might Also Like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-neutral-light rounded-lg overflow-hidden h-40 animate-pulse">
              <div className="bg-gray-300 h-28"></div>
              <div className="p-3">
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (!relatedRecipes || relatedRecipes.length === 0) {
    return null;
  }

  return (
    <>
      <h3 className="text-xl font-heading font-semibold mb-4">
        You Might Also Like
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {relatedRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-neutral-light rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition duration-300"
            onClick={() => handleRelatedRecipeClick(recipe.id)}
          >
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-28 object-cover"
            />
            <div className="p-3">
              <h4 className="font-heading font-medium text-sm line-clamp-1">
                {recipe.title}
              </h4>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>{formatPreparationTime(recipe.prepTime)}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RelatedRecipes;
