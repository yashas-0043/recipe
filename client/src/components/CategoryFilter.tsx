import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface CategoryFilterProps {
  onSelectCategory: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
}

const CategoryFilter = ({ onSelectCategory, selectedCategoryId }: CategoryFilterProps) => {
  const [location] = useLocation();
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleCategoryClick = (categoryId: number | null) => {
    onSelectCategory(categoryId);
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center space-x-2">
            <span className="font-medium text-neutral-dark">Filter by:</span>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 rounded-full bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-neutral-dark">Filter by:</span>
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id === 1 ? null : category.id)}
              className={`px-4 py-2 rounded-full ${
                (selectedCategoryId === category.id) || (selectedCategoryId === null && category.id === 1)
                  ? "bg-primary text-white"
                  : "bg-neutral-light hover:bg-gray-200 text-neutral-dark"
              } font-medium transition duration-150`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
