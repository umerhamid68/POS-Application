import { Select, Typography } from "antd";
import { CatalogObject } from "square";
import { SelectedModifier } from "types/product";

const { Text } = Typography;

interface ModifierSelectorProps {
  modifierLists: CatalogObject[];
  selectedModifiers: SelectedModifier[];
  onChange: (listId: string, value: string[]) => void;
  getSelectedModifierIds: (listId: string) => string[];
}

export function ModifierSelector({ 
  modifierLists, 
  selectedModifiers, 
  onChange,
  getSelectedModifierIds 
}: ModifierSelectorProps) {
  return (
    <>
      {modifierLists.map((list) => {
        const modifiers = list.modifierListData?.modifiers || [];
        if (modifiers.length === 0) return null;
        
        return (
          <div key={list.id} style={{ marginTop: '16px' }}>
            <Text strong>{list.modifierListData?.name || "Options"}:</Text>
            <Select
              mode="multiple"
              placeholder={`Select ${list.modifierListData?.name || "options"}`}
              value={getSelectedModifierIds(list.id)}
              onChange={(value) => onChange(list.id, value)}
              style={{ width: '100%', marginTop: '8px' }}
              options={modifiers.map(modifier => {
                const price = modifier.modifierData?.priceMoney
                  ? Number(modifier.modifierData.priceMoney.amount) / 100 : 0;
                  
                return {
                  label: `${modifier.modifierData?.name || "Option"} (+$${price.toFixed(2)})`,
                  value: modifier.id,
                };
              })}
            />
          </div>
        );
      })}
    </>
  );
}