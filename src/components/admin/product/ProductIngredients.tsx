import React, { useState } from "react";

interface IngredientsProps {
  ingredients: string[];
  setIngredients: (vals: string[]) => void;
  nutritionalInfo: { [key: string]: string };
  setNutritionalInfo: (val: { [key: string]: string }) => void;
  usageInstructions: string;
  setUsageInstructions: (val: string) => void;
  storageInstructions: string;
  setStorageInstructions: (val: string) => void;
}

export default function ProductIngredients({
  ingredients,
  setIngredients,
  nutritionalInfo,
  setNutritionalInfo,
  usageInstructions,
  setUsageInstructions,
  storageInstructions,
  setStorageInstructions,
}: IngredientsProps) {
  const [newIngredient, setNewIngredient] = useState("");

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };

  const updateNutrition = (key: string, val: string) => {
    setNutritionalInfo({
      ...nutritionalInfo,
      [key]: val,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfaf2] border border-[#ece7d9] p-6 rounded-3xl space-y-4">
        <h3 className="font-serif font-bold text-accent-green text-lg">4. Wellness & Nutrition</h3>

        {/* Dynamic Ingredients Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Ingredients List</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Organic Finger Millet, Cardamom"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green"
            />
            <button
              type="button"
              onClick={addIngredient}
              className="px-5 py-2.5 bg-accent-green text-background text-xs font-bold rounded-xl"
            >
              Add Item
            </button>
          </div>
          {ingredients.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {ingredients.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-accent-cream-dark/30 text-accent-green px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-[#ece7d9]"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="text-red-500 font-bold hover:underline"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-foreground/50 italic">No ingredients specified yet.</p>
          )}
        </div>

        {/* Structured Nutrition Form */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent-sage uppercase tracking-wider block">Nutritional Information (per 100g serving)</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { key: "Protein", label: "Protein (g)" },
              { key: "Fiber", label: "Fiber (g)" },
              { key: "Calories", label: "Calories (kcal)" },
              { key: "Iron", label: "Iron (mg)" },
              { key: "Calcium", label: "Calcium (mg)" },
            ].map((n) => (
              <div key={n.key} className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-accent-sage">{n.label}</span>
                <input
                  type="text"
                  placeholder="e.g. 12g"
                  value={nutritionalInfo[n.key] || ""}
                  onChange={(e) => updateNutrition(n.key, e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#ece7d9] bg-background text-xs text-center focus:outline-none focus:border-accent-green"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Usage and Storage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Usage Instructions</label>
            <textarea
              placeholder="e.g. Add 2 tablespoons of mix to 1 cup of warm milk. Stir well."
              value={usageInstructions}
              onChange={(e) => setUsageInstructions(e.target.value)}
              rows={3}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-accent-sage uppercase tracking-wider">Storage Instructions</label>
            <textarea
              placeholder="e.g. Store in a cool, airtight dry glass jar container."
              value={storageInstructions}
              onChange={(e) => setStorageInstructions(e.target.value)}
              rows={3}
              className="px-4 py-3 rounded-xl border border-[#ece7d9] bg-background text-sm focus:outline-none focus:border-accent-green resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
