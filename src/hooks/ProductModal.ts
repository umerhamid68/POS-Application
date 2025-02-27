import { useState, useEffect } from "react";
import { CatalogObject } from "square";

interface UseProductModalProps {
  visible: boolean;
  variations: CatalogObject[];
  modifierLists: CatalogObject[];
}

export function useProductModal({ visible, variations, modifierLists }: UseProductModalProps) {
  const [selectedVariation, setSelectedVariation] = useState<CatalogObject | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (visible) {
      if (variations && variations.length > 0) {
        setSelectedVariation(variations[0]);
      } else {
        setSelectedVariation(null);
      }
      const initialModifiers: Record<string, string[]> = {};
      modifierLists.forEach(list => {
        initialModifiers[list.id] = [];
      });
      setSelectedModifiers(initialModifiers);
    }
  }, [visible, variations, modifierLists]);

  useEffect(() => {
    let basePrice = 0;
    if (selectedVariation?.itemVariationData?.priceMoney) {
      basePrice = Number(selectedVariation.itemVariationData.priceMoney.amount) / 100;
    }

    let modifierPrice = 0;
    Object.entries(selectedModifiers).forEach(([listId, modifierIds]) => {
      const list = modifierLists.find(l => l.id === listId);
      if (!list || !list.modifierListData?.modifiers) return;
      
      modifierIds.forEach(modId => {
        const modifier = list.modifierListData?.modifiers?.find(m => m.id === modId);
        if (modifier?.modifierData?.priceMoney) {
          modifierPrice += Number(modifier.modifierData.priceMoney.amount) / 100;
        }
      });
    });

    setTotalPrice(basePrice + modifierPrice);
  }, [selectedVariation, selectedModifiers, modifierLists]);

  const handleVariationChange = (value: string) => {
    const selected = variations.find((v) => v.id === value);
    setSelectedVariation(selected || null);
  };

  const handleModifierChange = (listId: string, value: string[]) => {
    setSelectedModifiers(prev => ({
      ...prev,
      [listId]: value
    }));
  };

  return {
    selectedVariation,
    selectedModifiers,
    totalPrice,
    handleVariationChange,
    handleModifierChange,
  };
}