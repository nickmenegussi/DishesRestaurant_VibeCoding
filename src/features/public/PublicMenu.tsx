
import { useState, useMemo, useEffect } from "react";
import { Search, X, Filter, ChefHat } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useMenu } from "../../context/MenuContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Button } from "../../components/ui/Button";
import { cn } from "../../utils/cn";
import { generateSlug } from "../../utils/slug";

const DishSkeleton = () => (
  <div className="flex flex-col rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden h-full">
    <div className="aspect-[4/3] w-full bg-gray-100 animate-pulse" />
    <div className="p-6 space-y-4 flex-1">
      <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-50 rounded animate-pulse" />
      </div>
      <div className="pt-4 mt-auto flex justify-between items-center">
        <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

export default function PublicMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeMenus, listDishesByMenu, categories: globalCategories } = useMenu();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  
  const menuFromUrl = searchParams.get("menu");
  
  const [selectedMenu, setSelectedMenu] = useState<string | null>(menuFromUrl);
  const [currentDishes, setCurrentDishes] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    if (activeMenus.length > 0) {
      if (!selectedMenu) {
        setSelectedMenu(activeMenus[0].id);
      } else if (menuFromUrl && menuFromUrl !== selectedMenu) {
        setSelectedMenu(menuFromUrl);
      }
    }
  }, [activeMenus, menuFromUrl]);

  useEffect(() => {
    let isMounted = true;
    if (selectedMenu) {
      setIsDataLoading(true);
      listDishesByMenu(selectedMenu)
        .then(dishes => {
          if (isMounted) setCurrentDishes(dishes);
        })
        .finally(() => {
          if (isMounted) setIsDataLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [selectedMenu, listDishesByMenu]);

  const categories = useMemo(() => {
    const dishCategories = new Set(currentDishes.map(d => d.category));
    const relevantGlobalCategories = globalCategories
      .map(c => c.name)
      .filter(name => dishCategories.has(name));
      
    // Always include 'All' and any categories that have dishes, 
    // fallback to global list if dish list is empty (initial load)
    const displayCategories = relevantGlobalCategories.length > 0 
      ? relevantGlobalCategories 
      : globalCategories.map(c => c.name);

    return ['All', ...Array.from(new Set(displayCategories))];
  }, [globalCategories, currentDishes]);

  const filteredDishes = useMemo(() => {
    return currentDishes.filter(dish => {
      const matchesCategory = activeCategory === 'All' || dish.category === activeCategory;
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dish.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [currentDishes, activeCategory, searchQuery]);

  const updateMenu = (menuId: string) => {
    setSelectedMenu(menuId);
    setSearchParams({ menu: menuId });
    setActiveCategory('All');
  };


  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
      
      <div className="relative h-[400px] w-full overflow-hidden bg-primary shadow-2xl">
        <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2000&q=80" 
                alt="Restaurant Ambience" 
                className="h-full w-full object-cover opacity-30 mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        </div>

        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
                 <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                     <ChefHat className="w-8 h-8 text-white" />
                 </div>
            </div>
            <h1 className="mb-4 text-5xl font-black text-white sm:text-6xl tracking-tight drop-shadow-xl">
                Our Signature Menu
            </h1>
            <p className="mb-10 max-w-xl text-lg text-gray-200 font-medium">
                Explore a symphony of flavors curated specially for you.
            </p>

            <div className="w-full max-w-2xl transform translate-y-8 animate-fadeIn">
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ring-1 ring-black/5">
                    <div className="pl-6 text-gray-400">
                        <Search className="h-5 w-5" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search for dishes..."
                        className="flex-1 w-full border-none bg-transparent px-4 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 rounded-2xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-4 p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 border-b-2 overflow-x-auto no-scrollbar">
                  {activeMenus.map(menu => (
                      <button
                          key={menu.id}
                          onClick={() => updateMenu(menu.id)}
                          className={cn(
                              "px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap",
                              selectedMenu === menu.id 
                                  ? "bg-primary text-white shadow-md" 
                                  : "text-text-muted hover:bg-gray-50 hover:text-text-main"
                          )}
                      >
                          {menu.name}
                      </button>
                  ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1.5">
                        <Filter className="w-4 h-4" />
                        {filteredDishes.length} Items
                    </span>
                    <span className="h-4 w-px bg-gray-300" />
                    <span>{activeCategory}</span>
              </div>
          </div>

          <div className="mb-10 overflow-x-auto pb-4 no-scrollbar">
               <div className="flex items-center gap-3">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                            "whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all border",
                            activeCategory === category 
                                ? "bg-text-main text-white border-text-main shadow-lg shadow-text-main/20" 
                                : "bg-white text-text-muted border-gray-200 hover:border-gray-300 hover:text-text-main hover:bg-gray-50"
                        )}
                    >
                        {category}
                    </button>
                ))}
               </div>
          </div>

        <div className="min-h-[400px]">
            {isDataLoading ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => <DishSkeleton key={i} />)}
                </div>
            ) : filteredDishes.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDishes.map((dish) => (
                        <div 
                            key={dish.id} 
                            className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/20 cursor-pointer h-full"
                            onClick={() => navigate(`/dish/${generateSlug(dish.name)}`)}
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <img 
                                    src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"} 
                                    alt={dish.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="absolute right-4 top-4 rounded-xl bg-white/95 px-3 py-1.5 text-sm font-black text-text-main shadow-lg backdrop-blur-sm">
                                    ${dish.price.toFixed(2)}
                                </div>
                                
                                <div className="absolute left-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                     <span className="inline-block rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white shadow-lg">
                                        {dish.category}
                                     </span>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="text-xl font-bold text-text-main mb-2 leading-tight group-hover:text-primary transition-colors">
                                    {dish.name}
                                </h3>
                                
                                <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-text-muted flex-1">
                                    {dish.description || "A delicious masterful creation."}
                                </p>

                                <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-text-muted bg-gray-50 px-2 py-1 rounded">
                                       {dish.ingredients?.length || 0} ingredients
                                    </span>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isAuthenticated) {
                                                navigate("/auth/login", { state: { from: location } });
                                                return;
                                            }
                                            addToCart(dish);
                                        }}
                                        className="relative overflow-hidden group/btn rounded-xl bg-text-main px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary shadow-lg shadow-text-main/20 hover:shadow-primary/30 active:scale-95"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Add
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
                     <div className="mb-6 h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center">
                         <Search className="h-12 w-12 text-gray-300" />
                     </div>
                     <h3 className="text-2xl font-bold text-text-main">No dishes found</h3>
                     <p className="mt-2 text-text-muted max-w-md mx-auto">
                         We couldn't find any items matching "{searchQuery}" in the {activeCategory} category.
                     </p>
                     <Button 
                        variant="secondary" 
                        className="mt-8"
                        onClick={() => {
                            setSearchQuery("");
                            setActiveCategory("All");
                        }}
                     >
                         Clear Filters
                     </Button>
                </div>
            )}
        </div>
      </div>

      <footer className="mt-24 border-t border-gray-200 bg-white py-12">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-xl font-bold text-text-main">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                      <ChefHat className="w-5 h-5" />
                  </div>
                  Global Bites
              </div>
              <div className="text-sm text-text-muted font-medium">
                  © 2026 Global Bites Menu. Crafted with care.
              </div>
          </div>
      </footer>
    </div>
  );
}
