import { Radio, Typography } from "antd";
import { CatalogObject } from "square";

const { Text } = Typography;

interface VariationSelectorProps {
  variations: CatalogObject[];
  selectedVariationId: string | null;
  onChange: (value: string) => void;
}

export function VariationSelector({ variations, selectedVariationId, onChange }:
     VariationSelectorProps) {
  return (
    <div>
      <Text strong>Variations:</Text>
      <Radio.Group
        value={selectedVariationId}
        onChange={(e) => onChange(e.target.value)}
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}
      >
        {variations.map((variation) => {
          const price = variation.itemVariationData?.priceMoney 
            ? Number(variation.itemVariationData.priceMoney.amount) / 100 : 0;
            
          return (
            <Radio key={variation.id} value={variation.id}>
              {variation.itemVariationData?.name || "Default"} - ${price.toFixed(2)}
            </Radio>
          );
        })}
      </Radio.Group>
    </div>
  );
}