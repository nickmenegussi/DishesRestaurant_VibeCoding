import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { menuService, aiService, authService } from '../../backend/index';
import { generateSlug } from '../utils/slug';

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Dish {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'Available' | 'Sold Out';
  image?: string; // Made optional to support dishes without images
  description?: string;
  ingredients?: string[];
  active?: boolean;
  pairing?: string;
  ingredient_suggestions?: string[];
  tags?: string[];
}

interface MenuContextType {
  categories: Category[];
  dishes: Dish[];
  allDishes: Dish[]; // Add this
  activeMenus: any[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  addDish: (dish: Omit<Dish, 'id'>, menuIds?: string[]) => Promise<any>;
  updateDish: (id: string, updates: Partial<Dish>) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
  toggleDishStatus: (id: string, active: boolean) => Promise<void>;
  attachDishToMenu: (menuId: string, dishId: string) => Promise<void>;
  detachDishFromMenu: (menuId: string, dishId: string) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => void;
  getDishBySlug: (slug: string) => Dish | undefined;
  listDishesByMenu: (menuId: string) => Promise<Dish[]>;
  listDishes: (page: number, search?: string, admin?: boolean, isActive?: boolean) => Promise<void>;
  refresh: (admin?: boolean, isActive?: boolean) => Promise<void>;
  getAISuggestions: (name: string, ingredients: string[], imageBase64?: string) => Promise<any>;
  uploadImage: (file: File) => Promise<string>;
}


const MenuContext = createContext<MenuContextType | undefined>(undefined);

// MenuProvider

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [allDishes, setAllDishes] = useState<Dish[]>([]); // New State
  const [activeMenus, setActiveMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 8, total: 0 });

const listDishes = useCallback(async (page: number = 1, search?: string, admin = false, isActive?: boolean) => {
    setIsLoading(true);
    try {
      const result = await menuService.listDishesPaginated({ 
        page, 
        pageSize: pagination.pageSize, 
        search, 
        admin,
        active: isActive 
      });
      
      if (result && 'data' in result) {
        setDishes(result.data.map((d: any) => ({
          ...d,
          status: d.active ? 'Available' : 'Sold Out',
          ingredients: d.ingredients || [],
          pairing: d.pairing || null,
          ingredient_suggestions: d.ingredient_suggestions || [],
          tags: d.tags || []
        })));
        setPagination(prev => ({ ...prev, total: result.total || 0, page }));
      }
    } catch (error) {
      console.error("Failed to load dishes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageSize]);

  // Load static metadata (Menus, Category tags)
  const fetchMetadata = useCallback(async (admin = false) => {
    try {
      const [fetchedMenus, fetchedDishes] = await Promise.all([
        menuService.getMenus(admin),
        menuService.getDishes({ admin })
      ]);
      
      setActiveMenus(fetchedMenus);
      
      const dishesArray = Array.isArray(fetchedDishes) ? fetchedDishes : (fetchedDishes as any).data || [];
      
      // Store ALL dishes for client-side search/slug-matching
      // Map to ensure shape consistency
      const mappedDishes = dishesArray.map((d: any) => ({
          ...d,
          status: d.active ? 'Available' : 'Sold Out',
          ingredients: d.ingredients || [],
          pairing: d.pairing || null,
          ingredient_suggestions: d.ingredient_suggestions || [],
          tags: d.tags || []
      }));

      setAllDishes(mappedDishes);
      
      const uniqueCats = Array.from(new Set(mappedDishes.map((d: any) => d.category).filter(Boolean)));
      
      setCategories(uniqueCats.map(c => ({ 
        id: c as string, 
        name: c as string, 
        count: mappedDishes.filter((d: any) => d.category === c).length 
      })));
    } catch (error) {
      console.error("Failed to fetch menu metadata:", error);
    }
  }, []);

  const refresh = useCallback(async (admin = false, isActive?: boolean) => {
    setIsLoading(true);
    await Promise.all([
      fetchMetadata(admin),
      listDishes(1, undefined, admin, isActive) // Start with page 1 for refresh
    ]);
    setIsLoading(false);
  }, [fetchMetadata, listDishes]);

  // Initial Boot
  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

const addDish = useCallback(async (dishData: Omit<Dish, 'id'>, menuIds: string[] = []) => {
    setIsLoading(true);
    try {
      // Check authentication before attempting insert
      const session = await authService.getSession();
      if (!session) {
        throw new Error("You must be logged in to create dishes");
      }
      
      // Validate description length if provided
      if (dishData.description && (dishData.description.length < 10 || dishData.description.length > 500)) {
        throw new Error("Description must be between 10 and 500 characters");
      }
      
      // Ensure ingredients is always an array and handle new schema fields
      const dishPayload = {
        name: dishData.name,
        category: dishData.category,
        price: dishData.price,
        status: dishData.status,
        active: dishData.active,
        image: dishData.image || null, // Handle optional image
        description: dishData.description || null, // Handle optional description
        ingredients: Array.isArray(dishData.ingredients) ? dishData.ingredients : [],
        pairing: dishData.pairing || null, // Handle optional pairing
        ingredient_suggestions: Array.isArray(dishData.ingredient_suggestions) ? dishData.ingredient_suggestions : [],
        tags: Array.isArray(dishData.tags) ? dishData.tags : []
      };
      
      const newDish = await menuService.createDish(dishPayload);
      
      // Link to menus if provided
      if (newDish && menuIds.length > 0) {
        await Promise.all(menuIds.map(menuId => menuService.attachDish(menuId, newDish.id)));
      }
      
      await refresh(true); // Re-fetch to sync
      return newDish;
    } catch (error: any) {
      console.error("Failed to add dish:", error);
      
      // Handle specific errors with friendly messages
      if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
        throw new Error("Permission denied. Please ensure you are logged in as an admin.");
      }
      
      if (error.message?.includes('Description must be')) {
        throw new Error(error.message);
      }
      
      if (error.message?.includes('null value in column')) {
        const columnName = error.message.match(/column "([^"]+)"/)?.[1];
        if (columnName) {
          throw new Error(`Missing required field: ${columnName}. Please fill in all required fields.`);
        }
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const updateDish = useCallback(async (id: string, updates: Partial<Dish>) => {
    setIsLoading(true);
    try {
      await menuService.updateDish(id, updates);
      setDishes(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    } catch (error) {
      console.error("Failed to update dish:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDish = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await menuService.deleteDish(id);
      setDishes(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Failed to delete dish:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleDishStatus = useCallback(async (id: string, active: boolean) => {
    setIsLoading(true);
    try {
      await menuService.toggleDishActive(id, active);
      setDishes(prev => prev.map(d => d.id === id ? { ...d, active, status: active ? 'Available' : 'Sold Out' } : d));
    } catch (error) {
      console.error("Failed to toggle dish status:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (name: string) => {
    // Categories are derived from Dishes or Menus in our backend schema.
    // If the user wants a new category, they usually create a Menu or a Dish with that category.
    // For now, we'll just keep the local sync if needed, but the backend is the source of truth.
    if (!categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        const newCategory: Category = { id: name, name, count: 0 };
        setCategories(prev => [...prev, newCategory]);
    }
  }, [categories]);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const getDishBySlug = useCallback((slug: string) => {
     // Use allDishes instead of paginated "dishes"
     // Check both current paginated dishes AND allDishes to be safe
     const target = allDishes.length > 0 ? allDishes : dishes;
     return target.find(d => generateSlug(d.name) === slug);
  }, [dishes, allDishes]);

  const attachDishToMenu = useCallback(async (menuId: string, dishId: string) => {
    setIsLoading(true);
    try {
        await menuService.attachDish(menuId, dishId);
    } catch (error) {
        console.error("Failed to attach dish to menu:", error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  }, []);

  const detachDishFromMenu = useCallback(async (menuId: string, dishId: string) => {
    setIsLoading(true);
    try {
        await menuService.detachDish(menuId, dishId);
    } catch (error) {
        console.error("Failed to detach dish from menu:", error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  }, []);

const listDishesByMenu = useCallback(async (menuId: string) => {
      setIsLoading(true);
      try {
          const fetched = await menuService.getMenuDishes(menuId);
          return fetched.map((d: any) => ({
              ...d,
              status: d.active ? 'Available' : 'Sold Out',
              ingredients: d.ingredients || [],
              pairing: d.pairing || null,
              ingredient_suggestions: d.ingredient_suggestions || [],
              tags: d.tags || []
          }));
      } catch (error) {
          console.error("Failed to load menu dishes:", error);
          return [];
      } finally {
          setIsLoading(false);
      }
  }, []);

  const getAISuggestions = useCallback(async (name: string, ingredients: string[], imageBase64?: string) => {
    return aiService.getSuggestions(name, ingredients, imageBase64);
  }, []);

const uploadImage = useCallback(async (file: File): Promise<string> => {
    // Check authentication first
    const session = await authService.getSession();
    if (!session) {
      throw new Error("You must be logged in to upload images");
    }
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error("Please upload an image file (PNG, JPG, GIF, etc.)");
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error("Image must be less than 10MB");
    }
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!fileExt || !allowedExts.includes(fileExt)) {
      throw new Error("Invalid file format. Please use JPG, PNG, GIF, or WebP");
    }
    
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    // IMPORTANT: Path must NOT start with "/" for Supabase Storage
    const filePath = fileName;

    // Import supabase client once to avoid multiple GoTrueClient instances
    const { supabase } = await import('../../backend/client');
    
    try {
      // Upload to Supabase Storage 'dishes' bucket (must be public)
      const { data, error } = await supabase.storage
        .from('dishes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type // Set correct content type
        });

      if (error) {
        console.error('Storage upload error:', error);
        
        // Handle specific storage errors with friendly messages
        if (error.message.includes('Bucket not found')) {
          throw new Error('Storage bucket "dishes" not found. Please create a public bucket named "dishes" in Supabase.');
        }
        
        if (error.message.includes('permission')) {
          throw new Error('Storage permission denied. Please ensure the "dishes" bucket is public and RLS policies allow uploads.');
        }
        
        if (error.message.includes('too large')) {
          throw new Error('File is too large. Maximum size is 10MB.');
        }
        
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get public URL - Supabase getPublicUrl doesn't return an error object
      const { data: urlData } = supabase.storage
        .from('dishes')
        .getPublicUrl(data.path);

      if (!urlData?.publicUrl) {
        throw new Error('Image uploaded but failed to get public URL. Please try again.');
      }

      return urlData.publicUrl;
    } catch (error: any) {
      // Re-throw our custom errors
      if (error.message.includes('Storage bucket') || 
          error.message.includes('permission') || 
          error.message.includes('too large') ||
          error.message.includes('Invalid file format')) {
        throw error;
      }
      
      // Handle network/general errors
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      console.error('Unexpected upload error:', error);
      throw new Error('An unexpected error occurred while uploading the image. Please try again.');
    }
  }, []);

  return (
    <MenuContext.Provider value={{
      categories,
      dishes,
      allDishes,
      activeMenus,
      isLoading,
      pagination,
      addDish,
      updateDish,
      deleteDish,
      toggleDishStatus,
      attachDishToMenu,
      detachDishFromMenu,
      addCategory,
      deleteCategory,
      getDishBySlug,
      listDishesByMenu,
      listDishes,
      refresh,
      getAISuggestions,
      uploadImage
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
