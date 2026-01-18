import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../../../context/MenuContext";
import { useCart } from "../../../context/CartContext";
import { ShoppingBag } from "lucide-react";
import { generateSlug } from "../../../utils/slug";

export function PopularDishesSection() {
  const { activeMenus, listDishesByMenu } = useMenu();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [dishes, setDishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    if (activeMenus.length > 0) {
      const fetchPopular = async () => {
        setIsLoading(true);
        try {
          const menuDishes = await listDishesByMenu(activeMenus[0].id);
          
          if (isMounted) {
            setDishes(menuDishes.slice(0, 6));
          }
        } catch (error) {
          console.error("Failed to load popular dishes:", error);
        } finally {
           if (isMounted) setIsLoading(false);
        }
      };
      
      fetchPopular();
    } else {
        const timer = setTimeout(() => setIsLoading(false), 3000);
        return () => clearTimeout(timer);
    }
    
    return () => { isMounted = false; };
  }, [activeMenus, listDishesByMenu]);


  return (
    <div className="bg-surface-muted py-20 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h2 className="text-4xl font-extrabold text-text-main mb-4">Fast Food Menus</h2>
           <p className="text-text-muted max-w-2xl mx-auto">
             Order your favorite fast food items from our exclusive menu.
           </p>
        </div>
        
        {isLoading ? (
             <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="bg-white rounded-3xl p-6 h-[400px] animate-pulse border border-dashed border-gray-200">
                    <div className="flex justify-center -mt-12 mb-6">
                        <div className="h-40 w-40 rounded-full bg-gray-200 ring-4 ring-white" />
                    </div>
                    <div className="space-y-4 mt-8 px-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
                    </div>
                 </div>
               ))}
            </div>
        ) : dishes.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish) => (
                <div key={dish.id} className="group relative bg-white rounded-3xl p-6 transition-all hover:shadow-xl hover:-translate-y-2 border border-gray-100">
                    <div className="flex justify-center -mt-12 mb-6">
                        <div className="relative h-40 w-40">
                             <img
                                src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
                                alt={dish.name}
                                className="h-full w-full object-cover rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 ring-4 ring-white"
                            />
                        </div>
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-bold text-text-main mb-1">
                            {dish.name}
                        </h3>
                        <p className="text-sm text-text-muted mb-4 line-clamp-2 h-10">{dish.description}</p>
                        
                        <div className="flex items-center justify-between mt-4 bg-gray-50 rounded-2xl p-2 px-4">
                            <span className="text-lg font-bold text-primary">${dish.price?.toFixed(2)}</span>
                            
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(dish);
                                }}
                                className="h-10 w-10 rounded-xl bg-accent text-white flex items-center justify-center shadow-sm hover:bg-yellow-400 transition-colors"
                            >
                                <ShoppingBag className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <span className="absolute inset-0 cursor-pointer rounded-3xl" onClick={() => navigate(`/dish/${generateSlug(dish.name)}`)} />
                </div>
              ))}
            </div>
        ) : (
             <div className="text-center py-12">
                <p className="text-text-muted">Currently updating our popular menu. Check back soon!</p>
             </div>
        )}
      </div>
    </div>
  );
}
