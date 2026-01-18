
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import { useMenu } from "../../context/MenuContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { generateSlug } from "../../utils/slug";
import { Button } from "../../components/ui/Button";
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, toggleFavorite } = useFavorites();
  const { allDishes, isLoading } = useMenu();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const favoriteDishes = useMemo(() => {
    return allDishes.filter(dish => favorites.includes(dish.id));
  }, [allDishes, favorites]);

  if (isLoading) {
    return (
       <div className="min-h-screen pt-20 flex items-center justify-center">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans pt-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-text-main sm:text-4xl tracking-tight">Your Favorites</h1>
              <p className="mt-2 text-text-muted">A collection of your most loved dishes.</p>
           </div>
           <Button variant="secondary" onClick={() => navigate("/menu")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
           </Button>
        </div>

        {favoriteDishes.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
             {favoriteDishes.map((dish) => (
                <div 
                    key={dish.id} 
                    className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/20 cursor-pointer h-full"
                    onClick={() => navigate(`/dish/${generateSlug(dish.name)}`)}
                >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img 
                            src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"} 
                            alt={dish.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                             e.stopPropagation();
                             toggleFavorite(dish.id);
                          }}
                          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-colors shadow-sm z-10"
                          title="Remove from favorites"
                        >
                           <Heart className="h-5 w-5 fill-current" />
                        </button>
                        
                        {/* Price Tag */}
                        <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-3 py-1.5 text-sm font-black text-text-main shadow-lg backdrop-blur-sm">
                            ${dish.price.toFixed(2)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-xl font-bold text-text-main mb-2 leading-tight group-hover:text-primary transition-colors">
                            {dish.name}
                        </h3>
                        
                        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-text-muted flex-1">
                            {dish.description || "A delicious masterful creation."}
                        </p>

                        <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between">
                             <span className="inline-block rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                                {dish.category}
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
                                    <ShoppingCart className="w-4 h-4" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 border-dashed border-2 border-gray-200">
               <div className="mb-6 h-32 w-32 bg-red-50 rounded-full flex items-center justify-center">
                   <Heart className="h-12 w-12 text-red-200" />
               </div>
               <h3 className="text-2xl font-bold text-text-main">No favorites yet</h3>
               <p className="mt-2 text-text-muted max-w-md mx-auto">
                   Start exploring our menu and click the heart icon to save your favorite dishes here.
               </p>
               <Button 
                  className="mt-8 bg-primary hover:bg-primary-hover text-white rounded-xl px-8 py-4 h-auto text-lg font-bold shadow-xl shadow-primary/20"
                  onClick={() => navigate("/menu")}
               >
                   Explore Menu
               </Button>
          </div>
        )}
      </div>
    </div>
  );
}
