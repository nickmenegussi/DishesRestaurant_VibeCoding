import { useState, useEffect } from "react"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Share2, ArrowLeft, ChefHat, Sparkles, ShoppingCart, Info, Heart } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { cn } from "../../utils/cn";
import { useFavorites } from "../../context/FavoritesContext";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { useMenu } from "../../context/MenuContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function DishDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getDishBySlug, activeMenus, listDishesByMenu, isLoading } = useMenu();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const location = useLocation();
  
  const dish = slug ? getDishBySlug(slug) : undefined;
  const [featuredMenus, setFeaturedMenus] = useState<any[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  useEffect(() => {
    if (dish && activeMenus.length > 0) {
      const loadFeaturedMenus = async () => {
        setLoadingMenus(true);
        const menuPromises = activeMenus.map(async (menu) => {
          const dishes = await listDishesByMenu(menu.id);
          return dishes.some(d => d.id === dish.id) ? menu : null;
        });
        const found = (await Promise.all(menuPromises)).filter(Boolean);
        setFeaturedMenus(found);
        setLoadingMenus(false);
      };
      loadFeaturedMenus();
    }
  }, [dish, activeMenus, listDishesByMenu]);

  if (isLoading && !dish) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         <p className="text-text-muted">Loading dish details...</p>
      </div>
    );
  }

  if (!dish) {
     return (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
           <h2 className="text-2xl font-bold">Dish not found</h2>
           <p className="text-text-muted text-center max-w-md">The dish you are looking for does not exist or has been removed from our current seasonal menu.</p>
           <Button onClick={() => navigate("/")} variant="secondary">Back to Menu</Button>
        </div>
     );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-text-muted">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link to="/menu" className="hover:text-primary transition-colors">{dish.category || 'Menu'}</Link>
        <span>/</span>
        <span className="font-semibold text-text-main">{dish.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* Left Column: Visual Assets */}
        <div className="space-y-6">
          <div className="group relative aspect-square overflow-hidden rounded-3xl bg-gray-100 shadow-2xl">
            <img 
              src={dish.image} 
              alt={dish.name} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            {dish.status === 'Sold Out' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <span className="rounded-full bg-white px-6 py-2 text-xl font-black uppercase tracking-widest text-black">Sold Out</span>
              </div>
            )}
          </div>
          
          {/* Thumbnails (Mocked for now as we usually only have one image per dish) */}
          <div className="flex gap-4">
             <div className="h-20 w-20 overflow-hidden rounded-xl border-2 border-primary ring-2 ring-primary/20 ring-offset-2">
               <img src={dish.image} className="h-full w-full object-cover" />
             </div>
             {/* Additional mock thumbnails to match reference */}
             <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 grayscale opacity-50">
                <ChefHat className="h-8 w-8 text-gray-300" />
             </div>
             <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 grayscale opacity-50">
                <Info className="h-8 w-8 text-gray-300" />
             </div>
          </div>
        </div>

        {/* Right Column: Culinary Details */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tight text-text-main sm:text-6xl">{dish.name}</h1>
              <p className="text-xl font-medium text-text-muted">{dish.category}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-2xl bg-[#E6F4EA] px-6 py-3 text-3xl font-black text-[#1E8E3E]">
                ${dish.price.toFixed(2)}
              </div>
              <div className="flex flex-wrap gap-2">
                {dish.tags?.map(tag => (
                   <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm bg-gray-50 border-gray-200">
                     {tag}
                   </Badge>
                )) || (
                  <>
                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-gray-50 border-gray-200">Vegetarian</Badge>
                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-gray-50 border-gray-200">Chef's Special</Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* AI INSIGHT SECTION - Premium Card */}
          <Card className="relative overflow-hidden border-none bg-white p-8 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 inline-flex items-center rounded-md bg-[#34A853] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
              AI INSIGHT
            </div>
            
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-text-main/90 font-medium">
                {dish.description || "Experience a masterfully crafted culinary journey where traditional flavors meet modern technique."}
              </p>

              {dish.pairing && (
                <div className="rounded-2xl bg-primary/5 p-4 border border-primary/10">
                  <h4 className="text-xs font-black uppercase tracking-wider text-primary mb-1">Chef's Pairing Suggestion</h4>
                  <p className="text-sm italic text-text-main">"{dish.pairing}"</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Generated based on chef's recipe notes and seasonal availability</span>
              </div>
            </div>
          </Card>

          {/* Primary Action */}
          <Button 
            size="lg" 
            className="group h-16 w-full text-xl font-bold transition-all hover:shadow-xl active:scale-[0.98] bg-black hover:bg-black/90 text-white border-none rounded-2xl"
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/auth/login", { state: { from: location } });
                return;
              }
              addToCart(dish);
            }}
            disabled={dish.status === 'Sold Out'}
          >
            <ShoppingCart className="mr-3 h-6 w-6 transition-transform group-hover:-rotate-12" />
            Add to Order - ${dish.price.toFixed(2)}
          </Button>

          {/* Featured In Section */}
          <div className="space-y-6 pt-12">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-text-main">Featured In</h3>
              <p className="text-sm text-text-muted">This dish is currently curated for the following seasonal menus.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {loadingMenus ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
                ))
              ) : featuredMenus.length > 0 ? (
                featuredMenus.map((menu) => (
                  <Card key={menu.id} className="group relative flex flex-col items-start p-5 overflow-hidden transition-all hover:shadow-md hover:ring-2 hover:ring-primary/20 border-gray-100">
                     <Badge variant="success" className="mb-3 uppercase text-[10px] tracking-tighter">AVAILABLE</Badge>
                     <h4 className="font-black text-lg group-hover:text-primary transition-colors">{menu.name}</h4>
                     <p className="mt-1 text-[10px] text-text-muted line-clamp-2">{menu.description}</p>
                     <Link to="/menu" className="mt-4 flex items-center text-[10px] font-black text-primary hover:underline">
                        VIEW FULL MENU →
                     </Link>
                  </Card>
                ))
              ) : (
                <div className="col-span-full rounded-2xl bg-gray-50 p-6 text-center italic text-text-muted border border-dashed border-gray-200">
                  Currently excluded from specific catalogs.
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col items-center gap-8 pt-12 border-t border-gray-100">
            <p className="text-xs font-semibold text-text-muted italic flex items-center gap-2">
              <Info className="h-3 w-3" />
              Ingredients are ethically sourced from local organic farms within 100 miles.
            </p>
            
            <div className="flex gap-4">
              <Button variant="secondary" size="lg" className="rounded-xl px-10 border-gray-200" onClick={() => navigate("/menu")}>
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Menu
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="rounded-xl px-10 border-gray-200"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Check out ${dish.name} at Global Bites!`,
                      text: `I found this delicious ${dish.name} on Global Bites. Looks amazing!`,
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                     // Fallback
                     navigator.clipboard.writeText(window.location.href);
                     alert("Link copied to clipboard!");
                  }
                }}
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share Dish
              </Button>
               <Button 
                variant="secondary" 
                size="lg" 
                className={cn("rounded-xl px-6 border-gray-200", isFavorite(dish.id) ? "text-red-500 bg-red-50 border-red-200" : "text-gray-400")}
                onClick={() => toggleFavorite(dish.id)}
              >
                <Heart className={cn("h-6 w-6", isFavorite(dish.id) && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
