import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all recipes
  app.get("/api/recipes", async (req, res) => {
    try {
      const recipes = await storage.getAllRecipes();
      
      // Parse the JSON strings to objects
      const parsedRecipes = recipes.map((recipe) => ({
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients as string),
        instructions: JSON.parse(recipe.instructions as string),
        nutritionInfo: JSON.parse(recipe.nutritionInfo as string),
        tips: JSON.parse(recipe.tips as string),
      }));
      
      res.json(parsedRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Get recipe by ID
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipeId = parseInt(req.params.id);
      const recipe = await storage.getRecipeById(recipeId);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      // Get category name
      const category = await storage.getCategoryById(recipe.categoryId);
      
      // Parse the JSON strings to objects
      const parsedRecipe = {
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients as string),
        instructions: JSON.parse(recipe.instructions as string),
        nutritionInfo: JSON.parse(recipe.nutritionInfo as string),
        tips: JSON.parse(recipe.tips as string),
        category: category?.name,
      };
      
      res.json(parsedRecipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  // Get recipes by category
  app.get("/api/recipes/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const recipes = await storage.getRecipesByCategory(categoryId);
      
      // Parse the JSON strings to objects
      const parsedRecipes = recipes.map((recipe) => ({
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients as string),
        instructions: JSON.parse(recipe.instructions as string),
        nutritionInfo: JSON.parse(recipe.nutritionInfo as string),
        tips: JSON.parse(recipe.tips as string),
      }));
      
      res.json(parsedRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes by category" });
    }
  });

  // Search recipes
  app.get("/api/recipes/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const recipes = await storage.searchRecipes(query);
      
      // Parse the JSON strings to objects
      const parsedRecipes = recipes.map((recipe) => ({
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients as string),
        instructions: JSON.parse(recipe.instructions as string),
        nutritionInfo: JSON.parse(recipe.nutritionInfo as string),
        tips: JSON.parse(recipe.tips as string),
      }));
      
      res.json(parsedRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to search recipes" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Toggle favorite status
  app.post("/api/recipes/:id/favorite", async (req, res) => {
    try {
      const recipeId = parseInt(req.params.id);
      const updatedRecipe = await storage.toggleFavorite(recipeId);
      
      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      // Parse the JSON strings to objects
      const parsedRecipe = {
        ...updatedRecipe,
        ingredients: JSON.parse(updatedRecipe.ingredients as string),
        instructions: JSON.parse(updatedRecipe.instructions as string),
        nutritionInfo: JSON.parse(updatedRecipe.nutritionInfo as string),
        tips: JSON.parse(updatedRecipe.tips as string),
      };
      
      res.json(parsedRecipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to update favorite status" });
    }
  });

  // Get related recipes (based on same category)
  app.get("/api/recipes/:id/related", async (req, res) => {
    try {
      const recipeId = parseInt(req.params.id);
      const recipe = await storage.getRecipeById(recipeId);
      
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      // Get recipes from the same category
      const relatedRecipes = (await storage.getRecipesByCategory(recipe.categoryId))
        .filter((r) => r.id !== recipe.id) // Exclude the current recipe
        .slice(0, 3); // Limit to 3 related recipes
      
      // Parse the JSON strings to objects
      const parsedRelatedRecipes = relatedRecipes.map((recipe) => ({
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients as string),
        instructions: JSON.parse(recipe.instructions as string),
        nutritionInfo: JSON.parse(recipe.nutritionInfo as string),
        tips: JSON.parse(recipe.tips as string),
      }));
      
      res.json(parsedRelatedRecipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch related recipes" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
