import { useState, useEffect, useMemo } from "react";
import { 
  Edit2, 
  Trash2, 
  Plus, 
  Filter, 
  Search, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Layers,
  Settings
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMenu } from "../../context/MenuContext";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { useToast } from "../../components/ui/Toast";
import { CategoryManager } from "./CategoryManager";
import { ConfirmModal } from "../../components/ui/Modal";
import { Checkbox } from "../../components/ui/Checkbox";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../utils/cn";

export default function DishList() {
  const { 
    dishes, 
    deleteDish, 
    toggleDishStatus, 
    isLoading, 
    refresh, 
    activeMenus,
    pagination,
    listDishes
  } = useMenu();
  
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Param Constants
  const currentPage = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "active"; // active, archived, all

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync with URL State & Initial Fetch
  useEffect(() => {
    const isActive = statusFilter === 'all' ? undefined : (statusFilter === 'active');
    
    // Use listDishes directly with current pagination and search state
    listDishes(currentPage, searchQuery, true, isActive);
  }, [currentPage, searchQuery, statusFilter, listDishes]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDish(deleteId);
      addToast("Dish deleted permanently", "success");
      setDeleteId(null);
    } catch (error) {
      addToast("Failed to delete dish", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleDishStatus(id, !currentStatus);
      addToast(`Dish ${!currentStatus ? 'activated' : 'archived'}`, "success");
    } catch (error) {
      addToast("Failed to update status", "error");
    }
  };

  const updateUrlParams = (updates: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) newParams.delete(key);
      else newParams.set(key, String(value));
    });
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUrlParams({ q: e.target.value || null, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  // Derive active categories from dishes
  const activeCategories = useMemo(() => {
    return Array.from(new Set(dishes.map(d => d.category)));
  }, [dishes]);

  const isDataEmpty = !isLoading && dishes.length === 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text-main sm:text-5xl">
            Inventory <span className="text-primary">Vault</span>
          </h1>
          <p className="mt-2 text-lg font-medium text-text-muted/60">Manage your culinary creations and menu availability.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             variant="secondary" 
             onClick={() => {
                const isActive = statusFilter === 'all' ? undefined : (statusFilter === 'active');
                refresh(true, isActive);
             }}
             disabled={isLoading}
             className="h-12 border-gray-100 bg-white px-6 font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-text-muted"
           >
             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" /> : <Settings className="mr-2 h-4 w-4" />}
             Sync
           </Button>
           <Button 
             onClick={() => navigate('/admin/menu/add')}
             className="h-12 rounded-2xl bg-text-main px-8 font-bold text-white shadow-xl shadow-text-main/20 hover:bg-primary transition-all active:scale-95"
           >
             <Plus className="mr-2 h-5 w-5 stroke-[3]" />
             New Creation
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
          <StatCard 
            title="Storage Units" 
            value={pagination.total} 
            trend={{ value: 0, isPositive: true }}
            icon={Package}
          />
          <StatCard 
            title="Active Menus" 
            value={activeMenus.length} 
            trend={{ value: 0, isPositive: true }}
            icon={Layers}
          />
          <StatCard 
            title="Classifications" 
            value={activeCategories.length} 
            trend={{ value: 0, isPositive: true }}
            icon={Filter}
          />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-text-main">Dish Repository</h2>
            <p className="text-text-muted/60 font-medium text-sm">Review item availability and price points across your catalog.</p>
          </div>
          <CategoryManager />
      </div>

      {/* Filters Card */}
      <Card className="overflow-hidden border-none bg-white p-2 shadow-2xl shadow-gray-200/50 ring-1 ring-black/5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted/30" />
            <input 
              type="text"
              placeholder="Search by name, category or menu identity..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-14 w-full rounded-xl border-none bg-surface-muted/50 pl-12 pr-4 font-bold text-text-main placeholder:text-text-muted/30 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-surface-muted/50 rounded-xl">
            {(['active', 'archived', 'all'] as const).map((status) => (
              <button
                key={status}
                onClick={() => updateUrlParams({ status, page: 1 })}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all",
                  statusFilter === status 
                    ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                    : "text-text-muted/40 hover:text-text-muted"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* List Table */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl shadow-gray-200/40">
        {isLoading && dishes.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] transition-all">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 font-black text-primary text-xs uppercase tracking-[0.2em] animate-pulse">Syncing catalog</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-primary/5">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40 whitespace-nowrap">Preview</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40 whitespace-nowrap">Item Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40 whitespace-nowrap">Classification</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40 whitespace-nowrap">Placement</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40 whitespace-nowrap">Financials</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40 whitespace-nowrap">Visibility</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40 whitespace-nowrap">Commands</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y divide-gray-50", isLoading && dishes.length > 0 && "opacity-40")}>
              {isDataEmpty ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center text-text-muted">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-surface-muted border border-dashed border-gray-200 mb-6 font-black text-text-muted/20 text-4xl">?</div>
                    <p className="text-2xl font-black text-text-main">No Matches Found</p>
                    <p className="mt-2 font-medium max-w-sm mx-auto">Try adjusting your search or switching filters.</p>
                    <Button 
                      variant="ghost" 
                      onClick={() => updateUrlParams({ q: null, status: 'active', page: 1 })}
                      className="mt-6 font-bold"
                    >
                      Reset Catalog Filter
                    </Button>
                  </td>
                </tr>
              ) : (
                dishes.map((dish: any) => (
                  <tr key={dish.id} className={cn(
                    "group transition-all hover:bg-surface-muted/50",
                    !dish.active && "opacity-60 bg-surface-muted/30"
                  )}>
                    <td className="px-6 py-5">
                      <div className="relative h-14 w-14 overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-surface-muted ring-1 ring-black/5">
                         {dish.image ? (
                           <img src={dish.image} alt={dish.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                         ) : (
                           <Package className="h-6 w-6 text-text-muted/20 m-auto absolute inset-0" />
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col gap-0.5">
                         <span className="font-extrabold text-text-main text-[16px] leading-tight group-hover:text-primary transition-colors">{dish.name}</span>
                         <span className="text-[10px] font-black text-text-muted/40 uppercase tracking-widest">REF-{dish.id.slice(0, 8)}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="secondary" className="bg-blue-50/50 text-blue-600 border-blue-100 text-[10px] font-black uppercase tracking-tighter px-2.5 py-1">
                        {dish.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {dish.menu_dishes?.length > 0 ? (
                            dish.menu_dishes.map((md: any, idx: number) => (
                              <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black uppercase px-1.5 py-0.5">
                                {md.menus?.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-[9px] font-black text-rose-500/40 uppercase tracking-widest italic tracking-tighter">Unassigned</span>
                          )}
                       </div>
                    </td>
                    <td className="px-6 py-5 font-black text-text-main text-[17px]">
                      <span className="text-primary/40 mr-0.5 text-xs font-medium">$</span>{dish.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <Checkbox 
                           checked={dish.active} 
                           onChange={() => handleToggleStatus(dish.id, !!dish.active)}
                           className="h-5 w-5 rounded-md border-gray-200"
                         />
                         <span className={cn(
                           "text-[10px] font-black uppercase tracking-widest",
                           dish.active ? "text-green-600" : "text-rose-500"
                         )}>
                           {dish.active ? "Active" : "Archived"}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Button 
                           variant="secondary"
                           size="sm"
                           onClick={() => navigate(`/admin/menu/edit/${dish.id}`)}
                           className="h-9 px-3 rounded-xl border-gray-200 bg-white hover:bg-primary hover:text-white text-text-main transition-all shadow-sm font-bold"
                         >
                           <Edit2 className="h-3.5 w-3.5 mr-2" />
                           Manage
                         </Button>
                         <Button 
                           variant="secondary"
                           size="sm"
                           onClick={() => setDeleteId(dish.id)}
                           className="h-9 px-3 rounded-xl border-gray-200 bg-white hover:bg-rose-500 hover:text-white text-rose-500 transition-all shadow-sm"
                         >
                           <Trash2 className="h-3.5 w-3.5" />
                         </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isDataEmpty && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-50 p-6 bg-white gap-4">
             <p className="text-sm font-bold text-text-muted">
               Entry <span className="text-text-main">{(currentPage - 1) * pagination.pageSize + 1}-{Math.min(currentPage * pagination.pageSize, pagination.total)}</span> of <span className="text-text-main">{pagination.total}</span>
             </p>
             
             <div className="flex items-center gap-2">
               <Button 
                 variant="secondary" size="sm" 
                 disabled={currentPage <= 1 || isLoading}
                 onClick={() => handlePageChange(currentPage - 1)}
                 className="h-10 w-10 p-0 rounded-xl border-gray-100"
               >
                 <ChevronLeft className="h-5 w-5" />
               </Button>
               
               <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button
                      key={p}
                      variant={currentPage === p ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => handlePageChange(p)}
                      className={cn("h-10 w-10 p-0 rounded-xl font-black text-xs", currentPage === p ? "shadow-lg shadow-primary/20" : "text-text-muted/60")}
                    >
                      {String(p).padStart(2, '0')}
                    </Button>
                  ))}
               </div>

               <Button 
                 variant="secondary" size="sm" 
                 disabled={currentPage >= totalPages || isLoading}
                 onClick={() => handlePageChange(currentPage + 1)}
                 className="h-10 w-10 p-0 rounded-xl border-gray-100"
               >
                 <ChevronRight className="h-5 w-5" />
               </Button>
             </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Destroy Record?"
        message="This will permanently purge this dish and all its relations from the database. This action is irreversible."
        confirmLabel={isDeleting ? "Purging..." : "Purge Dish"}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
