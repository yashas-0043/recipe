import { useState } from "react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeWithParsedFields } from "@shared/schema";
import { getDifficultyClassName, formatPreparationTime } from "@/lib/recipes";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

interface RecipeCardProps {
  recipe: RecipeWithParsedFields;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(recipe.favorite);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST",
        `/api/recipes/${recipe.id}/favorite`,
        {}
      );
      return await response.json();
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate();
  };

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="recipe-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer">
        <div className="relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-0 right-0 mt-3 mr-3">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-full p-2 shadow hover:text-primary"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={`${isFavorite ? "fill-primary text-primary" : ""}`}
              />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 bg-white bg-opacity-90 m-3 px-2 py-1 rounded-lg text-xs font-medium">
            <span>{formatPreparationTime(recipe.prepTime)}</span>
          </div>
          <div className="absolute bottom-0 right-0 m-3">
            <span className={`${getDifficultyClassName(recipe.difficulty)} text-xs px-2 py-1 rounded-lg`}>
              {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-heading font-semibold text-lg mb-1 line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
              {recipe.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
