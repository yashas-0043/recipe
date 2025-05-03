import { useRoute } from "wouter";
import RecipeDetailView from "@/components/RecipeDetailView";
import { useLocation } from "wouter";

const RecipeDetail = () => {
  const [match, params] = useRoute("/recipe/:id");
  const [_, navigate] = useLocation();

  if (!match) {
    return null;
  }

  const handleClose = () => {
    navigate("/");
  };

  return (
    <RecipeDetailView recipeId={parseInt(params.id)} onClose={handleClose} />
  );
};

export default RecipeDetail;
