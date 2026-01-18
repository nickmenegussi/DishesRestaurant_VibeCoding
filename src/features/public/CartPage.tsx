
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Button } from "../../components/ui/Button";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart, checkout } = useCart();

  // Constants for fees (could be moved to context or config later)
  const SERVICE_FEE = 1.60;
  const DELIVERY_FEE = 0.00; // Free
  const TAX_RATE = 0.08;
  const ESTIMATED_TAX = totalPrice * TAX_RATE;
  const FINAL_TOTAL = totalPrice + SERVICE_FEE + DELIVERY_FEE + ESTIMATED_TAX;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center bg-surface-background">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
           <ShoppingBag className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-text-main">Your cart is empty</h2>
          <p className="mt-2 text-lg text-text-muted">Looks like you haven't added any dishes yet.</p>
        </div>
        <Link to="/menu">
          <Button size="lg" className="h-12 px-8 text-lg">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
                
                {/* Left Column: Cart Items */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-sm font-bold text-primary tracking-wider uppercase">Order Summary</span>
                            <h1 className="text-4xl font-extrabold text-text-main mt-1">Checkout Your Meal</h1>
                        </div>
                        {/* Option to clear cart */}
                         <button 
                            onClick={clearCart} 
                            className="text-sm text-red-500 hover:text-red-600 hover:underline font-medium"
                        >
                            Clear Order
                        </button>
                    </div>

                    <div className="space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="group flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-primary/20">
                                {/* Image */}
                                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                
                                {/* Content */}
                                <div className="flex flex-1 flex-col sm:flex-row items-center justify-between w-full text-center sm:text-left">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-text-main">{item.name}</h3>
                                        <p className="text-sm text-text-muted max-w-[250px] line-clamp-2 sm:mx-0 mx-auto">
                                            {item.description || item.category}
                                        </p>
                                        <div className="text-lg font-bold text-primary mt-2">
                                            ${item.price.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                                        <div className="flex items-center gap-3 bg-surface-muted rounded-xl px-2 py-1">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-white text-text-main shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-6 text-center font-bold text-text-main">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-white shadow-sm hover:bg-primary-hover transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                        
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-extrabold text-text-main mb-6">Payment Summary</h2>
                        
                        {/* Promo Code */}
                        <div className="mb-8">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Promo Code</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter code" 
                                    className="flex-1 bg-surface-muted border-none rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <Button className="px-6 rounded-xl bg-text-main text-white hover:bg-black">
                                    Apply
                                </Button>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-4 mb-8 border-b border-gray-100 pb-8">
                             <div className="flex justify-between items-center text-text-muted font-medium">
                                 <span>Subtotal</span>
                                 <span className="text-text-main font-bold">${totalPrice.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-text-muted font-medium">
                                 <span>Service Fee</span>
                                 <span className="text-text-main font-bold">${SERVICE_FEE.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center text-text-muted font-medium">
                                 <span>Delivery</span>
                                 <span className="text-primary font-bold">Free</span>
                             </div>
                             <div className="flex justify-between items-center text-text-muted font-medium">
                                 <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                                 <span className="text-text-main font-bold">${ESTIMATED_TAX.toFixed(2)}</span>
                             </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mb-8">
                             <span className="text-lg font-bold text-text-muted">Total Placed</span>
                             <span className="text-3xl font-extrabold text-text-main">${FINAL_TOTAL.toFixed(2)}</span>
                        </div>

                        {/* CTA */}
                        <Button 
                            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20"
                            onClick={async () => {
                                try {
                                    await checkout();
                                } catch (e) {
                                    // Error handled in context
                                }
                            }}
                        >
                            Place Order
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        
                        <div className="mt-6 flex justify-center text-text-muted text-sm font-medium">
                             <span className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Secure Checkout Process
                             </span>
                        </div>
                    </div>

                    {/* Support Box */}
                    <div className="mt-8 bg-yellow-50 rounded-2xl p-6 border border-yellow-100 flex items-center gap-4">
                         <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
                             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                         </div>
                         <div>
                             <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Need Support?</p>
                             <p className="text-lg font-bold text-text-main">Call us at +12 345 67890</p>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
}
