import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  prepTime: integer("prep_time").notNull(), // in minutes
  difficulty: text("difficulty").notNull(), // 'easy', 'medium', 'hard'
  categoryId: integer("category_id").notNull(),
  instructions: text("instructions").notNull(), // stored as JSON string
  ingredients: text("ingredients").notNull(), // stored as JSON string
  nutritionInfo: text("nutrition_info").notNull(), // stored as JSON string
  tips: text("tips").notNull(), // stored as JSON string
  favorite: boolean("favorite").default(false),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).pick({
  title: true,
  description: true,
  imageUrl: true,
  prepTime: true,
  difficulty: true,
  categoryId: true,
  instructions: true,
  ingredients: true,
  nutritionInfo: true,
  tips: true,
  favorite: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

// Type for the frontend with parsed JSON fields
export type RecipeWithParsedFields = Omit<Recipe, 'instructions' | 'ingredients' | 'nutritionInfo' | 'tips'> & {
  instructions: string[];
  ingredients: {
    name: string;
    amount: string;
  }[];
  nutritionInfo: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  tips: string[];
  category?: string;
};
