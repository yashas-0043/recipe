import { useQuery } from "@tanstack/react-query";
import { RecipeWithParsedFields } from "@shared/schema";
import RecipeCard from "./RecipeCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface RecipeGridProps {
  title: string;
  selectedCategoryId: number | null;
  searchQuery?: string;
  favorites?: boolean;
}

const RecipeGrid = ({ title, selectedCategoryId, searchQuery, favorites }: RecipeGridProps) => {
  const [displayLimit, setDisplayLimit] = useState(6);
  
  const { data: allRecipes, isLoading } = useQuery<RecipeWithParsedFields[]>({
    queryKey: ["/api/recipes"],
  });

  const filteredRecipes = allRecipes
    ? allRecipes.filter((recipe) => {
        // Filter by category
        const matchesCategory = selectedCategoryId 
          ? recipe.categoryId === selectedCategoryId 
          : true;
        
        // Filter by search query
        const matchesSearch = searchQuery
          ? recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
          
        // Filter by favorites
        const matchesFavorite = favorites
          ? recipe.favorite
          : true;
          
        return matchesCategory && matchesSearch && matchesFavorite;
      })
    : [];

  const displayedRecipes = filteredRecipes.slice(0, displayLimit);
  const hasMore = filteredRecipes.length > displayLimit;

  const loadMore = () => {
    setDisplayLimit(prev => prev + 6);
  };

  // Reset display limit when filters change
  useEffect(() => {
    setDisplayLimit(6);
  }, [selectedCategoryId, searchQuery, favorites]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden h-80 animate-pulse">
              <div className="bg-gray-300 h-48"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="recipes">
      <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">{title}</h2>
      
      {displayedRecipes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-heading mb-2">No recipes found</h3>
          <p className="text-gray-500">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={loadMore}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition duration-300 font-medium"
              >
                Load More Recipes
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipeGrid;
