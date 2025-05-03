import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm.293 4.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414zM11 12a1 1 0 10-2 0v3a1 1 0 102 0v-3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <h1 className="ml-2 text-2xl font-heading font-bold text-neutral-dark">
                  CookBook
                </h1>
              </a>
            </Link>
          </div>

          <div className="hidden md:flex space-x-4">
            <Link href="/">
              <a className="text-neutral-dark hover:text-primary font-medium">
                Home
              </a>
            </Link>
            <Link href="/?category=all">
              <a className="text-neutral-dark hover:text-primary font-medium">
                Categories
              </a>
            </Link>
            <Link href="/?favorites=true">
              <a className="text-neutral-dark hover:text-primary font-medium">
                Favorites
              </a>
            </Link>
          </div>

          <div className="flex items-center">
            <form onSubmit={handleSearch} className="relative md:w-64">
              <Input
                type="text"
                placeholder="Search recipes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </form>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-4 md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/">
                    <a className="text-lg font-medium py-2 hover:text-primary">
                      Home
                    </a>
                  </Link>
                  <Link href="/?category=all">
                    <a className="text-lg font-medium py-2 hover:text-primary">
                      Categories
                    </a>
                  </Link>
                  <Link href="/?favorites=true">
                    <a className="text-lg font-medium py-2 hover:text-primary">
                      Favorites
                    </a>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
