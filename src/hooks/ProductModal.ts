import { useState, useEffect } from "react";
import { CatalogObject } from "square";
import { SelectedModifier } from "types/product";

interface UseProductModalProps {
  visible: boolean;
  variations: CatalogObject[];
  modifierLists: CatalogObject[];
}

export function useProductModal({ visible, variations, modifierLists }: UseProductModalProps) {
  const [selectedVariation, setSelectedVariation] = useState<CatalogObject | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (visible) {
      if (variations && variations.length > 0) {
        setSelectedVariation(variations[0]);
      } else {
        setSelectedVariation(null);
      }
      setSelectedModifiers([]);
    }
  }, [visible, variations]);

  //cost calc
  useEffect(() => {
    let basePrice = 0;
    if (selectedVariation?.itemVariationData?.priceMoney) {
      basePrice = Number(selectedVariation.itemVariationData.priceMoney.amount) / 100;
    }
    const modifierPrice = selectedModifiers.reduce((total, mod) => total + mod.price, 0);

    setTotalPrice(basePrice + modifierPrice);
  }, [selectedVariation, selectedModifiers]);

  const handleVariationChange = (id: string) => {
    const selected = variations.find((v) => v.id === id);
    setSelectedVariation(selected || null);
  };

  const handleModifierChange = (listId: string, selectedIds: string[]) => {
    const list = modifierLists.find(l => l.id === listId);
    if (!list || !list.modifierListData) return;
    
    //this basically removes all the modifiers from the list
    //console.log("Selected modifiers:", selectedModifiers);
    const remainingModifiers = selectedModifiers.filter(mod => mod.listId !== listId);
    //console.log("Remaining modifiers:", remainingModifiers);
    
    //then we add the newly selected modifier
    const newModifiers = selectedIds.map(id => {
      const modifier = list.modifierListData?.modifiers?.find(m => m.id === id);
      if (!modifier || !modifier.modifierData) return null;
      
      return {
        id,
        name: modifier.modifierData.name || "Unknown",
        price: modifier.modifierData.priceMoney ? 
          Number(modifier.modifierData.priceMoney.amount) / 100 : 0,
        listId,
        listName: list.modifierListData?.name || "Unknown"
      };
    }).filter((mod): mod is SelectedModifier => mod !== null);
    //console.log("New modifiers:", newModifiers);

    //then we concat the modifiers
    setSelectedModifiers([...remainingModifiers, ...newModifiers]);
  };

  //get selected modifier ids for specific list
  const getSelectedModifierIds = (listId: string): string[] => {
    return selectedModifiers.filter(mod => mod.listId === listId)
      .map(mod => mod.id);
  };

  return {
    selectedVariation,
    selectedModifiers,
    totalPrice,
    handleVariationChange,
    handleModifierChange,
    getSelectedModifierIds
  };
}