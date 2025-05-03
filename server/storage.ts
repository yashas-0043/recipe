import { recipes, categories, type Recipe, type InsertRecipe, type Category, type InsertCategory } from "@shared/schema";

export interface IStorage {
  // Recipe operations
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  getRecipesByCategory(categoryId: number): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  toggleFavorite(id: number): Promise<Recipe | undefined>;
  searchRecipes(query: string): Promise<Recipe[]>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class MemStorage implements IStorage {
  private recipes: Map<number, Recipe>;
  private categories: Map<number, Category>;
  private recipeCurrentId: number;
  private categoryCurrentId: number;

  constructor() {
    this.recipes = new Map();
    this.categories = new Map();
    this.recipeCurrentId = 1;
    this.categoryCurrentId = 1;
    
    // Initialize with default categories and recipes
    this.initializeData();
  }

  // Recipe operations
  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipesByCategory(categoryId: number): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(
      (recipe) => recipe.categoryId === categoryId
    );
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.recipeCurrentId++;
    const recipe: Recipe = { ...insertRecipe, id };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async updateRecipe(id: number, recipeUpdate: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const existingRecipe = this.recipes.get(id);
    if (!existingRecipe) return undefined;

    const updatedRecipe = { ...existingRecipe, ...recipeUpdate };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async toggleFavorite(id: number): Promise<Recipe | undefined> {
    const recipe = this.recipes.get(id);
    if (!recipe) return undefined;

    const updatedRecipe = { ...recipe, favorite: !recipe.favorite };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(
      (recipe) => 
        recipe.title.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Initialize with sample data
  private async initializeData() {
    // Create categories
    const categoryData = [
      { name: "All" },
      { name: "Breakfast" },
      { name: "Lunch" },
      { name: "Dinner" },
      { name: "Dessert" },
      { name: "Vegetarian" },
      { name: "Seafood" },
      { name: "Baking" }
    ];
    
    categoryData.forEach(cat => {
      this.createCategory(cat);
    });

    // Create recipes with initial data
    const recipeData: InsertRecipe[] = [
      {
        title: "Avocado & Berry Breakfast Bowl",
        description: "A nutrient-packed breakfast bowl with fresh berries, avocado, and granola.",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 25,
        difficulty: "easy",
        categoryId: 2, // Breakfast
        ingredients: JSON.stringify([
          { name: "ripe avocado, sliced", amount: "1" },
          { name: "mixed berries (strawberries, blueberries, raspberries)", amount: "1 cup" },
          { name: "granola", amount: "1/2 cup" },
          { name: "honey or maple syrup", amount: "2 tbsp" },
          { name: "Greek yogurt", amount: "1/4 cup" },
          { name: "chia seeds", amount: "1 tbsp" },
          { name: "fresh mint leaves for garnish", amount: "a few" }
        ]),
        instructions: JSON.stringify([
          "Start by washing all berries thoroughly and patting them dry with a paper towel.",
          "Cut the avocado in half, remove the pit, and slice each half into thin pieces.",
          "In a bowl, spread the Greek yogurt as the base layer.",
          "Arrange the avocado slices and mixed berries on top of the yogurt.",
          "Sprinkle granola and chia seeds over the fruit.",
          "Drizzle with honey or maple syrup according to taste.",
          "Garnish with fresh mint leaves and serve immediately."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "320",
          protein: "12g",
          carbs: "42g",
          fat: "15g"
        }),
        tips: JSON.stringify([
          "For meal prep, store the components separately and assemble just before eating.",
          "You can substitute Greek yogurt with coconut yogurt for a dairy-free version.",
          "Add a scoop of protein powder to the yogurt for an extra protein boost."
        ]),
        favorite: false
      },
      {
        title: "Margherita Pizza",
        description: "Classic homemade pizza with tomato sauce, fresh mozzarella, and basil leaves.",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 45,
        difficulty: "medium",
        categoryId: 4, // Dinner
        ingredients: JSON.stringify([
          { name: "pizza dough", amount: "1 ball (about 250g)" },
          { name: "tomato sauce", amount: "1/2 cup" },
          { name: "fresh mozzarella, sliced", amount: "200g" },
          { name: "fresh basil leaves", amount: "a handful" },
          { name: "extra virgin olive oil", amount: "2 tbsp" },
          { name: "salt", amount: "to taste" },
          { name: "black pepper", amount: "to taste" }
        ]),
        instructions: JSON.stringify([
          "Preheat your oven to the highest temperature (usually 500°F/260°C) with a pizza stone or inverted baking sheet inside.",
          "Stretch the pizza dough to about 12 inches in diameter on a piece of parchment paper.",
          "Spread the tomato sauce evenly across the dough, leaving a small border for the crust.",
          "Arrange the mozzarella slices on top of the sauce.",
          "Carefully transfer the pizza with the parchment paper onto the preheated stone/sheet in the oven.",
          "Bake for 8-10 minutes until the crust is golden and the cheese is bubbling.",
          "Remove from the oven, top with fresh basil leaves, drizzle with olive oil, and season with salt and pepper.",
          "Slice and serve immediately."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "285",
          protein: "12g",
          carbs: "30g",
          fat: "14g"
        }),
        tips: JSON.stringify([
          "For the best texture, use high-protein flour for the dough.",
          "Let the dough rest at room temperature for at least 30 minutes before stretching.",
          "Use San Marzano tomatoes for the most authentic sauce.",
          "For a crispy bottom, slide the pizza onto a preheated pizza stone or steel."
        ]),
        favorite: false
      },
      {
        title: "Lemon Garlic Salmon",
        description: "Perfectly grilled salmon with a tangy lemon garlic sauce and fresh herbs.",
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 30,
        difficulty: "easy",
        categoryId: 4, // Dinner
        ingredients: JSON.stringify([
          { name: "salmon fillets", amount: "4 (about 150g each)" },
          { name: "lemons", amount: "2" },
          { name: "garlic cloves, minced", amount: "4" },
          { name: "olive oil", amount: "3 tbsp" },
          { name: "fresh dill, chopped", amount: "2 tbsp" },
          { name: "salt", amount: "to taste" },
          { name: "black pepper", amount: "to taste" },
          { name: "butter", amount: "2 tbsp" }
        ]),
        instructions: JSON.stringify([
          "Preheat your grill or oven to 375°F (190°C).",
          "In a small bowl, mix the juice of 1 lemon, minced garlic, 2 tbsp olive oil, 1 tbsp dill, salt, and pepper.",
          "Pat the salmon fillets dry and place them on a lined baking sheet.",
          "Brush the salmon with the marinade, ensuring even coverage.",
          "Slice the remaining lemon and place the slices on and around the salmon.",
          "Grill or bake for 12-15 minutes until the salmon flakes easily with a fork.",
          "While cooking, melt butter in a small pan and add the remaining dill and a splash of lemon juice.",
          "Serve the salmon drizzled with the herb butter and garnish with fresh dill."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "320",
          protein: "29g",
          carbs: "3g",
          fat: "22g"
        }),
        tips: JSON.stringify([
          "For the best flavor, marinate the salmon for 30 minutes before cooking.",
          "Don't overcook the salmon - it should still be slightly translucent in the middle.",
          "Use a fish spatula to easily flip and remove the salmon without breaking it.",
          "Serve with steamed vegetables and rice for a complete meal."
        ]),
        favorite: false
      },
      {
        title: "Triple Chocolate Cake",
        description: "Decadent triple chocolate cake with fresh berries and chocolate ganache.",
        imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 60,
        difficulty: "hard",
        categoryId: 5, // Dessert
        ingredients: JSON.stringify([
          { name: "all-purpose flour", amount: "2 cups" },
          { name: "granulated sugar", amount: "2 cups" },
          { name: "unsweetened cocoa powder", amount: "3/4 cup" },
          { name: "baking powder", amount: "2 tsp" },
          { name: "baking soda", amount: "1.5 tsp" },
          { name: "salt", amount: "1 tsp" },
          { name: "eggs", amount: "2" },
          { name: "milk", amount: "1 cup" },
          { name: "vegetable oil", amount: "1/2 cup" },
          { name: "vanilla extract", amount: "2 tsp" },
          { name: "boiling water", amount: "1 cup" },
          { name: "dark chocolate chips", amount: "1 cup" },
          { name: "heavy cream", amount: "1 cup" },
          { name: "milk chocolate, chopped", amount: "200g" },
          { name: "fresh mixed berries", amount: "2 cups" }
        ]),
        instructions: JSON.stringify([
          "Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.",
          "In a large bowl, whisk together flour, sugar, cocoa, baking powder, baking soda, and salt.",
          "Add eggs, milk, oil, and vanilla; beat on medium speed for 2 minutes.",
          "Stir in boiling water and chocolate chips (batter will be thin). Pour into prepared pans.",
          "Bake for 30-35 minutes until a toothpick inserted in center comes out clean.",
          "Cool in pans for 10 minutes, then remove to wire racks to cool completely.",
          "For the ganache, heat heavy cream until just simmering. Pour over chopped chocolate and let sit for 1 minute. Stir until smooth.",
          "Place one cake layer on a serving plate. Spread with 1/3 of the ganache.",
          "Top with second cake layer. Pour remaining ganache over top, letting it drip down sides.",
          "Arrange fresh berries on top. Refrigerate for at least 1 hour before serving."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "450",
          protein: "6g",
          carbs: "52g",
          fat: "25g"
        }),
        tips: JSON.stringify([
          "For extra moisture, don't overbake the cake - remove from oven as soon as a toothpick comes out clean.",
          "For the smoothest ganache, use high-quality chocolate with at least 70% cocoa content.",
          "The cake layers can be made a day ahead and wrapped in plastic wrap until assembly.",
          "For a professional finish, use a bench scraper to smooth the ganache on the sides of the cake."
        ]),
        favorite: false
      },
      {
        title: "Creamy Garlic Pasta",
        description: "Homemade pasta in a rich, creamy garlic sauce with fresh parmesan cheese.",
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 40,
        difficulty: "medium",
        categoryId: 4, // Dinner
        ingredients: JSON.stringify([
          { name: "fettuccine pasta", amount: "8 oz" },
          { name: "butter", amount: "4 tbsp" },
          { name: "garlic cloves, minced", amount: "6" },
          { name: "heavy cream", amount: "1 cup" },
          { name: "cream cheese", amount: "3 oz" },
          { name: "grated Parmesan cheese", amount: "1 cup" },
          { name: "salt", amount: "to taste" },
          { name: "black pepper", amount: "to taste" },
          { name: "fresh parsley, chopped", amount: "2 tbsp" }
        ]),
        instructions: JSON.stringify([
          "Cook pasta according to package directions until al dente. Reserve 1/2 cup of pasta water before draining.",
          "While pasta cooks, melt butter in a large skillet over medium heat.",
          "Add minced garlic and sauté for 1-2 minutes until fragrant but not browned.",
          "Reduce heat to medium-low. Add heavy cream and cream cheese, stirring until cream cheese is melted and smooth.",
          "Gradually stir in the Parmesan cheese until melted and sauce is creamy.",
          "Season with salt and pepper to taste.",
          "Add drained pasta to the sauce, tossing to coat. If sauce is too thick, add reserved pasta water a little at a time.",
          "Serve immediately, garnished with additional Parmesan cheese and fresh parsley."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "520",
          protein: "15g",
          carbs: "40g",
          fat: "35g"
        }),
        tips: JSON.stringify([
          "For the best flavor, use freshly grated Parmesan cheese instead of pre-packaged.",
          "Don't rinse the pasta after cooking - the starch helps the sauce cling to the noodles.",
          "If the sauce gets too thick, add a splash of pasta water to thin it to your desired consistency.",
          "For extra flavor, add sautéed mushrooms or peas to the finished dish."
        ]),
        favorite: false
      },
      {
        title: "Mediterranean Quinoa Salad",
        description: "Refreshing salad with quinoa, cucumber, tomatoes, feta cheese, and olive oil dressing.",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 15,
        difficulty: "easy",
        categoryId: 3, // Lunch
        ingredients: JSON.stringify([
          { name: "quinoa", amount: "1 cup" },
          { name: "vegetable broth", amount: "2 cups" },
          { name: "cucumber, diced", amount: "1 medium" },
          { name: "cherry tomatoes, halved", amount: "1 cup" },
          { name: "red bell pepper, diced", amount: "1" },
          { name: "red onion, finely chopped", amount: "1/4 cup" },
          { name: "kalamata olives, pitted and halved", amount: "1/2 cup" },
          { name: "feta cheese, crumbled", amount: "1/2 cup" },
          { name: "fresh parsley, chopped", amount: "1/4 cup" },
          { name: "fresh mint leaves, chopped", amount: "2 tbsp" },
          { name: "extra virgin olive oil", amount: "1/4 cup" },
          { name: "lemon juice", amount: "2 tbsp" },
          { name: "garlic clove, minced", amount: "1" },
          { name: "dried oregano", amount: "1 tsp" },
          { name: "salt", amount: "to taste" },
          { name: "black pepper", amount: "to taste" }
        ]),
        instructions: JSON.stringify([
          "Rinse quinoa thoroughly under cold water using a fine mesh strainer.",
          "In a medium saucepan, bring vegetable broth to a boil. Add quinoa, reduce heat to low, cover, and simmer for 15 minutes.",
          "Remove from heat and let stand, covered, for 5 minutes. Fluff with a fork and let cool completely.",
          "In a large bowl, combine cooled quinoa, cucumber, tomatoes, bell pepper, red onion, olives, feta cheese, parsley, and mint.",
          "In a small bowl, whisk together olive oil, lemon juice, garlic, oregano, salt, and pepper.",
          "Pour dressing over the salad and toss gently to combine.",
          "For best flavor, refrigerate for at least 30 minutes before serving to allow the flavors to meld."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "270",
          protein: "8g",
          carbs: "30g",
          fat: "15g"
        }),
        tips: JSON.stringify([
          "For extra protein, add chickpeas or grilled chicken.",
          "This salad keeps well in the refrigerator for up to 3 days, making it perfect for meal prep.",
          "Toast the quinoa in a dry pan before cooking for a nuttier flavor.",
          "For a vegan version, simply omit the feta cheese or substitute it with a plant-based alternative."
        ]),
        favorite: false
      },
      {
        title: "Spicy Thai Basil Chicken",
        description: "A fragrant stir-fry with chicken, Thai basil, and chili peppers in a savory sauce.",
        imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 25,
        difficulty: "medium",
        categoryId: 4, // Dinner
        ingredients: JSON.stringify([
          { name: "boneless chicken thighs, diced", amount: "1 lb" },
          { name: "Thai bird's eye chilies, sliced", amount: "3-5" },
          { name: "garlic cloves, minced", amount: "4" },
          { name: "shallots, sliced", amount: "3" },
          { name: "Thai basil leaves", amount: "1 cup" },
          { name: "vegetable oil", amount: "2 tbsp" },
          { name: "oyster sauce", amount: "1 tbsp" },
          { name: "fish sauce", amount: "1 tbsp" },
          { name: "dark soy sauce", amount: "1 tbsp" },
          { name: "sugar", amount: "1 tsp" },
          { name: "water", amount: "2 tbsp" },
          { name: "green beans, trimmed", amount: "1 cup" },
          { name: "red bell pepper, sliced", amount: "1" },
          { name: "jasmine rice, cooked", amount: "2 cups" }
        ]),
        instructions: JSON.stringify([
          "In a small bowl, mix together oyster sauce, fish sauce, dark soy sauce, sugar, and water. Set aside.",
          "Heat oil in a wok or large skillet over high heat until smoking.",
          "Add chilies, garlic, and shallots. Stir-fry for 30 seconds until fragrant.",
          "Add chicken and stir-fry for 2-3 minutes until it starts to brown.",
          "Add green beans and red bell pepper. Stir-fry for another 2 minutes.",
          "Pour in the sauce mixture and stir to coat evenly. Cook for 1-2 minutes until chicken is cooked through.",
          "Turn off the heat and stir in the Thai basil leaves until wilted.",
          "Serve immediately over jasmine rice with extra chili slices on the side if desired."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "380",
          protein: "30g",
          carbs: "28g",
          fat: "16g"
        }),
        tips: JSON.stringify([
          "Adjust the number of chilies based on your spice preference.",
          "Thai basil is traditional, but you can substitute with Italian basil if necessary.",
          "Have all ingredients prepped before starting to cook as this dish comes together quickly.",
          "For an authentic experience, serve with a fried egg on top."
        ]),
        favorite: false
      },
      {
        title: "Apple Cinnamon Oatmeal",
        description: "Warm, comforting oatmeal with fresh apples, cinnamon, and maple syrup.",
        imageUrl: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 15,
        difficulty: "easy",
        categoryId: 2, // Breakfast
        ingredients: JSON.stringify([
          { name: "rolled oats", amount: "1 cup" },
          { name: "water", amount: "1.5 cups" },
          { name: "milk (any kind)", amount: "1 cup" },
          { name: "apples, diced", amount: "2 medium" },
          { name: "cinnamon", amount: "1 tsp" },
          { name: "salt", amount: "1/4 tsp" },
          { name: "maple syrup", amount: "2 tbsp" },
          { name: "butter", amount: "1 tbsp" },
          { name: "vanilla extract", amount: "1/2 tsp" },
          { name: "chopped walnuts", amount: "1/4 cup" },
          { name: "raisins", amount: "2 tbsp" }
        ]),
        instructions: JSON.stringify([
          "In a medium saucepan, combine water, milk, oats, and salt. Bring to a simmer over medium heat.",
          "Add diced apples and cinnamon. Cook for 5-7 minutes, stirring occasionally, until oats are tender and creamy.",
          "Remove from heat and stir in butter, maple syrup, and vanilla extract.",
          "Let stand for 2 minutes to thicken.",
          "Serve hot, topped with additional diced apple, chopped walnuts, raisins, and a drizzle of maple syrup."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "310",
          protein: "8g",
          carbs: "52g",
          fat: "10g"
        }),
        tips: JSON.stringify([
          "Use a mix of sweet and tart apple varieties for the best flavor.",
          "For a creamier texture, use steel-cut oats and increase cooking time to 20-25 minutes.",
          "Prepare a large batch and refrigerate for quick breakfasts during the week.",
          "For extra protein, stir in a spoonful of nut butter before serving."
        ]),
        favorite: false
      },
      {
        title: "Classic French Ratatouille",
        description: "Traditional vegetable stew from Provence with eggplant, zucchini, peppers, and tomatoes.",
        imageUrl: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 50,
        difficulty: "medium",
        categoryId: 6, // Vegetarian
        ingredients: JSON.stringify([
          { name: "eggplant, diced", amount: "1 large" },
          { name: "zucchini, diced", amount: "2 medium" },
          { name: "yellow squash, diced", amount: "1 medium" },
          { name: "red bell pepper, diced", amount: "1" },
          { name: "yellow bell pepper, diced", amount: "1" },
          { name: "onion, diced", amount: "1 large" },
          { name: "garlic cloves, minced", amount: "4" },
          { name: "crushed tomatoes", amount: "28 oz can" },
          { name: "fresh thyme", amount: "4 sprigs" },
          { name: "fresh rosemary", amount: "1 sprig" },
          { name: "bay leaf", amount: "1" },
          { name: "olive oil", amount: "1/4 cup" },
          { name: "salt", amount: "to taste" },
          { name: "black pepper", amount: "to taste" },
          { name: "fresh basil, chopped", amount: "1/4 cup" }
        ]),
        instructions: JSON.stringify([
          "Place diced eggplant in a colander, sprinkle with salt, and let sit for 20 minutes to draw out moisture. Rinse and pat dry.",
          "Heat 2 tbsp olive oil in a large pot over medium heat. Add onions and sauté until translucent, about 5 minutes.",
          "Add garlic and cook for another minute until fragrant.",
          "Add bell peppers and cook for 5 minutes until they start to soften.",
          "Add eggplant, zucchini, and yellow squash. Cook for 5-7 minutes, stirring occasionally.",
          "Add crushed tomatoes, thyme, rosemary, and bay leaf. Season with salt and pepper.",
          "Reduce heat to low, cover, and simmer for 30 minutes, stirring occasionally.",
          "Remove the herb sprigs and bay leaf. Taste and adjust seasoning if needed.",
          "Stir in fresh basil and drizzle with remaining olive oil before serving.",
          "Serve warm or at room temperature, as a side dish or with crusty bread."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "180",
          protein: "4g",
          carbs: "22g",
          fat: "10g"
        }),
        tips: JSON.stringify([
          "For the best flavor, make ratatouille a day ahead and reheat - the flavors intensify overnight.",
          "Serve with grilled polenta, crusty bread, or as a topping for pasta.",
          "For a more elegant presentation, slice vegetables thinly and arrange in concentric circles before baking.",
          "Leftovers can be pureed and used as a flavorful pasta sauce."
        ]),
        favorite: false
      },
      {
        title: "Blueberry Lemon Pancakes",
        description: "Fluffy buttermilk pancakes with fresh blueberries and lemon zest, topped with maple syrup.",
        imageUrl: "https://images.unsplash.com/photo-1590137876181-2a5a7e340308?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        prepTime: 30,
        difficulty: "easy",
        categoryId: 2, // Breakfast
        ingredients: JSON.stringify([
          { name: "all-purpose flour", amount: "2 cups" },
          { name: "sugar", amount: "3 tbsp" },
          { name: "baking powder", amount: "1 tbsp" },
          { name: "baking soda", amount: "1/2 tsp" },
          { name: "salt", amount: "1/4 tsp" },
          { name: "buttermilk", amount: "2 cups" },
          { name: "eggs", amount: "2" },
          { name: "unsalted butter, melted", amount: "3 tbsp" },
          { name: "vanilla extract", amount: "1 tsp" },
          { name: "lemon zest", amount: "2 tbsp" },
          { name: "fresh blueberries", amount: "1.5 cups" },
          { name: "maple syrup", amount: "for serving" },
          { name: "additional butter", amount: "for cooking" }
        ]),
        instructions: JSON.stringify([
          "In a large bowl, whisk together flour, sugar, baking powder, baking soda, and salt.",
          "In a separate bowl, whisk together buttermilk, eggs, melted butter, vanilla extract, and lemon zest.",
          "Pour the wet ingredients into the dry ingredients and stir just until combined. Do not overmix.",
          "Gently fold in 1 cup of blueberries.",
          "Heat a griddle or non-stick pan over medium heat. Add a small pat of butter to coat the surface.",
          "For each pancake, pour about 1/4 cup of batter onto the griddle and cook until bubbles form on the surface, about 2-3 minutes.",
          "Flip and cook for another 1-2 minutes until golden brown and cooked through.",
          "Serve warm, topped with remaining fresh blueberries and maple syrup."
        ]),
        nutritionInfo: JSON.stringify({
          calories: "290",
          protein: "8g",
          carbs: "45g",
          fat: "9g"
        }),
        tips: JSON.stringify([
          "For extra fluffy pancakes, let the batter rest for 5-10 minutes before cooking.",
          "If using frozen blueberries, do not thaw them before adding to the batter.",
          "Keep cooked pancakes warm in a 200°F oven while you finish cooking the batch.",
          "For a delicious twist, add a tablespoon of poppy seeds to the batter."
        ]),
        favorite: false
      }
    ];

    recipeData.forEach(recipe => {
      this.createRecipe(recipe);
    });
  }
}

export const storage = new MemStorage();
