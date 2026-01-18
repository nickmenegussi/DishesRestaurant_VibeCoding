import { useState, useEffect } from "react"
import { Upload, Sparkles, Save, Trash2, Camera, Settings, Loader2, ArrowLeft } from "lucide-react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useMenu } from "../../context/MenuContext"
import { useAnalytics } from "../../context/AnalyticsContext"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Select } from "../../components/ui/Select"
import { Textarea } from "../../components/ui/Textarea"
import { TagInput } from "../../components/ui/TagInput"
import { Card } from "../../components/ui/Card"
import { useToast } from "../../components/ui/Toast"

export default function DishForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { categories, dishes, addDish, updateDish, activeMenus, attachDishToMenu, detachDishFromMenu, listDishesByMenu, getAISuggestions, uploadImage } = useMenu();
  const { logAIAction } = useAnalytics();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    ingredients: [] as string[],
    status: "active",
    image: "",
    selectedMenus: [] as string[],
    pairing: "",
    ingredient_suggestions: [] as string[],
    tags: [] as string[],
    aiInsights: null as { 
      pairing?: string; 
      ingredient_suggestions?: string[];
      tags?: string[];
    } | null
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [initialMenus, setInitialMenus] = useState<string[]>([]);
  const [hasAIApplied, setHasAIApplied] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const dish = dishes.find(d => d.id === id);
      if (dish) {
        setFormData({
            name: dish.name,
            price: dish.price.toString(),
            category: dish.category,
            description: dish.description || "",
            ingredients: dish.ingredients || [],
            status: dish.active ? "active" : "inactive",
            image: dish.image || "",
            selectedMenus: [], // Will load below
            pairing: dish.pairing || "",
            ingredient_suggestions: dish.ingredient_suggestions || [],
            tags: dish.tags || [],
            aiInsights: null,
        });
        if (dish.image) setImagePreview(dish.image);
        
        const loadAssociations = async () => {
          const menuPromises = activeMenus.map(async (m) => {
             const dishesInMenu = await listDishesByMenu(m.id);
             return dishesInMenu.some(d => d.id === id) ? m.id : null;
          });
          const associatedMenuIds = (await Promise.all(menuPromises)).filter(mid => mid !== null) as string[];
          setFormData(prev => ({ ...prev, selectedMenus: associatedMenuIds }));
          setInitialMenus(associatedMenuIds);
        };
        loadAssociations();
      }
    }
  }, [id, isEdit, dishes, activeMenus, listDishesByMenu]);

  useEffect(() => {
    return () => {
      if (hasAIApplied && !isSubmitting) {
        logAIAction('discarded');
      }
    };
  }, [hasAIApplied, isSubmitting, logAIAction]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Important: clear the value so selecting the same file again triggers onChange
      e.target.value = '';
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  const handleGenerateAI = async () => {
    if (!formData.name) {
      setErrors(prev => ({...prev, name: "Dish name is required for AI suggestions"}))
      addToast("Please enter a dish name first.", 'error');
      return;
    }
    
    setIsGenerating(true)
    try {
      let imageBase64;
      if (imageFile) {
        imageBase64 = await convertToBase64(imageFile);
      }

      const suggestions = await getAISuggestions(formData.name, formData.ingredients, imageBase64);
      
      if (!suggestions) throw new Error("No suggestions returned");

      // Log AI generation
      logAIAction('generated');
      setHasAIApplied(true);

      setFormData(prev => {
        return {
          ...prev,
          description: suggestions.description || prev.description,
          pairing: suggestions.pairing || prev.pairing,
          ingredient_suggestions: suggestions.ingredient_suggestions || prev.ingredient_suggestions,
          tags: suggestions.tags || prev.tags,
          aiInsights: {
            pairing: suggestions.pairing || "",
            ingredient_suggestions: suggestions.ingredient_suggestions || [],
            tags: suggestions.tags || []
          }
        };
      });
      
      addToast("AI suggestions applied successfully!", 'success');
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      addToast(error.message || "AI generation failed. Please try again.", 'error');
    } finally {
      setIsGenerating(false)
    }
  }

  const applySuggestedTags = () => {
    if (formData.aiInsights?.tags) {
      const currentTags = new Set(formData.tags);
      formData.aiInsights.tags.forEach(tag => {
        if (tag) currentTags.add(tag.trim());
      });
      handleChange('tags', Array.from(currentTags));
      addToast("Applied all suggested tags!", 'success');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    // Validate all required fields
    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = "Dish name is required";
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = "Name must be between 2 and 100 characters";
    }
    
    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be 0 or greater";
    }
    
    if (formData.description && formData.description.trim().length > 0) {
      if (formData.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      } else if (formData.description.length > 500) {
        newErrors.description = "Description must be 500 characters or less";
      }
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.ingredients || formData.ingredients.length === 0) {
      newErrors.ingredients = "Add at least one ingredient";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        let imageUrl = formData.image;
        
        if (imageFile) {
          try {
            addToast("Uploading image...", 'info');
            imageUrl = await uploadImage(imageFile);
          } catch (uploadError: any) {
            console.error("Image upload failed:", uploadError);
            addToast(uploadError.message || "Failed to upload image", 'error');
            setIsSubmitting(false);
            return;
          }
        }

        const payload = {
          name: formData.name.trim(),
          category: formData.category,
          price: parseFloat(formData.price),
          status: (formData.status === 'active' ? 'Available' : 'Sold Out') as 'Available' | 'Sold Out',
          active: formData.status === 'active',
          image: imageUrl || undefined,
          description: formData.description || undefined,
          ingredients: formData.ingredients || [],
          pairing: formData.pairing || undefined,
          ingredient_suggestions: formData.ingredient_suggestions || [],
          tags: formData.tags || []
        };

        if (isEdit) {
          await updateDish(id, payload);
          
          if (hasAIApplied) {
            logAIAction('applied', id);
          }
          
          const toAdd = formData.selectedMenus.filter(mid => !initialMenus.includes(mid));
          const toRemove = initialMenus.filter(mid => !formData.selectedMenus.includes(mid));
          
          await Promise.all([
            ...toAdd.map(mid => attachDishToMenu(mid, id)),
            ...toRemove.map(mid => detachDishFromMenu(mid, id))
          ]);
          
          addToast("Dish updated successfully!", 'success');
        } else {
          const newDish = await addDish(payload, formData.selectedMenus);
          if (hasAIApplied && newDish?.id) {
            logAIAction('applied', newDish.id);
          }
          addToast("Dish created successfully!", 'success');
        }
        
        navigate('/admin/menu');
      } catch (error: any) {
        console.error("Submit Error:", error);
        
        if (error.message?.includes('logged in')) {
          addToast("Please log in to create dishes", 'error');
        } else if (error.message?.includes('Permission denied')) {
          addToast("You don't have permission to perform this action", 'error');
        } else if (error.message?.includes('Description must be')) {
          addToast(error.message, 'error');
          setErrors(prev => ({ ...prev, description: error.message }));
        } else {
          addToast(error.message || `Failed to ${isEdit ? 'update' : 'create'} dish`, 'error');
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      addToast("Please fix the errors before submitting", 'error');
    }
  }


  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
      
      <div className="flex items-center justify-between">
         <div className="space-y-1">
           <div className="flex items-center gap-2 text-sm text-text-muted">
             <Link to="/admin/menu" className="flex items-center gap-1 hover:text-primary transition-colors">
               <ArrowLeft className="h-4 w-4" />
               Back to List
             </Link>
             <span>/</span>
             <span className="text-primary">{isEdit ? 'Edit Dish' : 'Add New Dish'}</span>
           </div>
           <h1 className="text-3xl font-bold tracking-tight text-text-main">{isEdit ? 'Edit Dish' : 'Add New Dish'}</h1>
           <p className="text-text-muted">{isEdit ? 'Update your menu item details and associations.' : 'Create a new menu item with AI-powered descriptions and automated tagging.'}</p>
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6 space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
               <div className="text-primary">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
               </div>
               <h2 className="text-lg font-bold">Basic Information</h2>
             </div>

             <div className="space-y-4">
               <Input 
                 label="Dish Name" 
                 placeholder="e.g. Spicy Miso Ramen"
                 value={formData.name}
                 onChange={(e) => handleChange('name', e.target.value)}
                 error={errors.name}
               />
               
               <div className="grid gap-4 sm:grid-cols-2">
                 <Input 
                   label="Price (USD)" 
                   placeholder="0.00"
                   type="number"
                   value={formData.price}
                   onChange={(e) => handleChange('price', e.target.value)}
                   error={errors.price}
                 />
                 <Select 
                   label="Category"
                   options={categories.map(c => ({ label: c.name, value: c.name }))}
                   value={formData.category}
                   onChange={(e) => handleChange('category', e.target.value)}
                   error={errors.category}
                 />
               </div>

               <TagInput 
                 label="Ingredients (Technical)"
                 placeholder="Add ingredient..."
                 value={formData.ingredients}
                 onChange={(tags) => handleChange('ingredients', tags)}
                 error={errors.ingredients}
               />

                <TagInput 
                  label="Tags (UI Badges)"
                  placeholder="e.g. Vegetarian, Spicy..."
                  value={formData.tags}
                  onChange={(tags) => handleChange('tags', tags)}
                />

                 {formData.aiInsights?.tags && (
                   <div className="flex flex-wrap items-center gap-2 pt-1">
                     <span className="text-xs font-bold text-primary flex items-center gap-1">
                       <Sparkles className="h-3 w-3" />
                       Suggested Tags:
                     </span>
                     {formData.aiInsights.tags.map(tag => (
                       <span key={tag} className="text-[10px] bg-primary/5 text-primary px-1.5 py-0.5 rounded-md border border-primary/10">
                         {tag}
                       </span>
                     ))}
                     <button 
                       type="button" 
                       onClick={applySuggestedTags}
                       className="text-xs underline text-text-muted hover:text-primary transition-colors ml-auto"
                     >
                       Apply All
                     </button>
                   </div>
                 )}
              </div>
          </Card>

          <Card className="relative overflow-hidden p-6 space-y-6">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles className="h-32 w-32 text-primary" />
             </div>
             
             <div className="flex items-center justify-between border-b border-gray-100 pb-4">
               <div className="flex items-center gap-2">
                 <Sparkles className="h-5 w-5 text-primary" />
                 <h2 className="text-lg font-bold">AI Assistant</h2>
               </div>
               <Button 
                  type="button" 
                  variant="primary" 
                  className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                  onClick={handleGenerateAI} 
                  disabled={isGenerating}
                >
                   {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                   <span className="font-bold">Generate All Options</span>
                </Button>
             </div>

               <div className="space-y-4">
                <div>
                  <Textarea 
                    label="Dish Description"
                    placeholder="Automate this with AI..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={errors.description}
                    rows={4}
                  />
                  <p className="mt-1 text-xs text-text-muted">
                    {formData.description.length}/500 characters
                  </p>
                </div>
                
                <Input 
                  label="Chef's Pairing"
                  placeholder="e.g. Chilled Mango Lassi"
                  value={formData.pairing}
                  onChange={(e) => handleChange('pairing', e.target.value)}
                />

                <TagInput 
                  label="Creative Enhancements"
                  placeholder="Add suggestion..."
                  value={formData.ingredient_suggestions}
                  onChange={(tags) => handleChange('ingredient_suggestions', tags)}
                />
              </div>

              {formData.aiInsights && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 rounded-2xl bg-primary/[0.03] border border-primary/10">
                  {formData.aiInsights.pairing && (
                    <div className="space-y-2">
                       <h4 className="text-xs font-bold uppercase tracking-wider text-primary">AI Pairing Suggestion</h4>
                       <p className="text-sm text-text-main leading-relaxed italic">"{formData.aiInsights.pairing}"</p>
                    </div>
                  )}
                  {formData.aiInsights.ingredient_suggestions && formData.aiInsights.ingredient_suggestions.length > 0 && (
                    <div className="space-y-2">
                       <h4 className="text-xs font-bold uppercase tracking-wider text-primary">AI Creative Enhancements</h4>
                       <ul className="space-y-1">
                         {formData.aiInsights.ingredient_suggestions.map((s, i) => (
                           <li key={i} className="text-sm text-text-main flex items-start gap-2">
                             <div className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
                             {s}
                           </li>
                         ))}
                       </ul>
                    </div>
                  )}
                </div>
              )}
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card className="p-6 space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
               <Camera className="h-5 w-5 text-primary" />
               <h2 className="text-lg font-bold">Dish Media</h2>
             </div>

             <label 
               htmlFor="image-upload"
               className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-surface-muted/50 p-4 text-center transition-colors hover:bg-surface-muted relative min-h-[200px] overflow-hidden cursor-pointer w-full"
             >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-sm font-medium text-text-main">
                         Drag and drop image or <span className="text-primary hover:underline">browse</span>
                       </p>
                       <p className="text-xs text-text-muted">PNG, JPG up to 10MB</p>
                    </div>
                  </>
                )}
             </label>
             <input 
                id="image-upload"
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />

             
             <div className="flex gap-3">
               <label 
                className="flex-1"
                htmlFor="image-upload"
               >
                 <Button 
                   type="button" 
                   variant="secondary" 
                   className="w-full font-bold" 
                   // Pointer-events none because the label handles the click
                   style={{ pointerEvents: 'none' }}
                 >
                   <Camera className="h-4 w-4 mr-2" />
                   {imagePreview ? 'Change Photo' : 'Upload Photo'}
                 </Button>
               </label>
               {imagePreview && (
                 <Button type="button" variant="danger" className="flex-1" onClick={() => {
                   setImageFile(null);
                   setImagePreview("");
                   handleChange('image', "");
                 }}>
                   <Trash2 className="h-4 w-4 mr-2" />
                   Remove
                 </Button>
               )}
             </div>

          </Card>

          <Card className="p-6 space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
               <Settings className="h-5 w-5 text-primary" />
               <h2 className="text-lg font-bold">Publishing</h2>
             </div>

             <div className="flex items-center justify-between rounded-xl bg-surface-muted p-3">
               <span className="text-sm font-medium text-text-main">Status</span>
               <div className="flex items-center gap-2">
                 <span className="h-2 w-2 rounded-full bg-primary" />
                 <span className="text-sm font-bold text-primary">Active</span>
               </div>
             </div>
             
             <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-main">Show in Featured</span>
                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                </button>
             </div>

             <div className="space-y-3 pt-4 border-t border-gray-100">
                <span className="text-sm font-bold text-text-main">Available in Menus</span>
                <div className="grid grid-cols-1 gap-2">
                  {activeMenus.map((menu: any) => (
                    <label key={menu.id} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.selectedMenus.includes(menu.id)}
                        onChange={(e) => {
                          const newMenus = e.target.checked 
                            ? [...formData.selectedMenus, menu.id]
                            : formData.selectedMenus.filter((id: string) => id !== menu.id);
                          handleChange('selectedMenus', newMenus);
                        }}
                      />
                      <span className="text-sm font-medium text-text-main">{menu.name}</span>
                    </label>
                  ))}
                </div>
              </div>

             <div className="pt-4 border-t border-gray-100">
               <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
                 {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                 {isSubmitting ? "Saving..." : "Save Dish"}
               </Button>
               <div className="mt-3 text-center">
                 <button type="button" className="text-sm font-medium text-text-muted hover:text-text-main">
                   Discard Changes
                 </button>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </form>
  )
}
