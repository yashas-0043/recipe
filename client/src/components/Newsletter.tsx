import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate subscription
    setTimeout(() => {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-[#5E9E94] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-heading font-bold leading-tight">
              Get New Recipes Every Week
            </h2>
            <p className="mt-2">
              Subscribe to our newsletter for fresh recipe ideas, cooking tips, and more.
            </p>
          </div>
          <div className="md:w-1/2">
            <form className="flex flex-col sm:flex-row" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="mt-2 sm:mt-0 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg sm:rounded-l-none transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
