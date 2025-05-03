import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-accent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
              Discover Delicious Meals for Every Occasion
            </h2>
            <p className="mt-4 text-lg md:text-xl">
              Explore our collection of 10 handpicked recipes that are easy to make and incredibly tasty.
            </p>
            <Link href="/#recipes">
              <Button className="mt-6 bg-white text-primary font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-neutral-light transition duration-300">
                Start Cooking Now
              </Button>
            </Link>
          </div>
          <div className="hidden md:block md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Cooking ingredients and utensils"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
