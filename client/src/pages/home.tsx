import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import RecipeGrid from "@/components/RecipeGrid";
import Newsletter from "@/components/Newsletter";
import { useLocation } from "wouter";

const Home = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [showFavorites, setShowFavorites] = useState(false);
  const [location] = useLocation();

  // Parse URL parameters on location change
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const favoritesParam = params.get('favorites');
    
    if (categoryParam) {
      setSelectedCategoryId(categoryParam === 'all' ? null : Number(categoryParam));
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery(undefined);
    }
    
    setShowFavorites(favoritesParam === 'true');
  }, [location]);

  const handleSelectCategory = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  let title = "Featured Recipes";
  if (searchQuery) {
    title = `Search Results for "${searchQuery}"`;
  } else if (showFavorites) {
    title = "Favorite Recipes";
  } else if (selectedCategoryId !== null) {
    title = `${selectedCategoryId === 2 ? 'Breakfast' : 
             selectedCategoryId === 3 ? 'Lunch' :
             selectedCategoryId === 4 ? 'Dinner' :
             selectedCategoryId === 5 ? 'Dessert' :
             selectedCategoryId === 6 ? 'Vegetarian' :
             selectedCategoryId === 7 ? 'Seafood' : 'Recipes'}`;
  }

  return (
    <>
      <HeroSection />
      <CategoryFilter
        onSelectCategory={handleSelectCategory}
        selectedCategoryId={selectedCategoryId}
      />
      <RecipeGrid
        title={title}
        selectedCategoryId={selectedCategoryId}
        searchQuery={searchQuery}
        favorites={showFavorites}
      />
      <Newsletter />
    </>
  );
};

export default Home;
