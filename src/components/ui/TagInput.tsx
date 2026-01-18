import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"

export interface TagInputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ label, error, placeholder, value, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-semibold text-text-main">
          {label}
        </label>
      )}
      <div className={cn(
        "flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent",
        error && "border-red-500 focus-within:ring-red-500"
      )}>
        {value.map((tag) => (
          <span 
            key={tag} 
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-sm font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-primary hover:text-primary-hover focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
          placeholder={value.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
        />
      </div>
      <p className="text-xs text-text-muted">Type and press enter to add tags.</p>
      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  )
}
