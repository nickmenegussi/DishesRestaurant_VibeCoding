import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function CategoryManager() {
  const { categories, addCategory, deleteCategory } = useMenu();
  const [newCategory, setNewCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  if (!isOpen) {
    return (
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Manage Categories
      </Button>
    );
  }

  return (
    <Card className="p-4 border-primary/20 bg-primary/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-main">Manage Categories</h3>
        <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-main">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(category => (
          <Badge key={category.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
            {category.name} <span className="text-xs opacity-50">({category.count})</span>
            <button 
              onClick={() => deleteCategory(category.id)}
              className="ml-1 rounded-full p-0.5 hover:bg-red-100 hover:text-red-500"
              title="Delete Category"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input 
          placeholder="New Category Name" 
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="h-9 text-sm"
        />
        <Button type="submit" size="sm">
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </form>
    </Card>
  );
}
