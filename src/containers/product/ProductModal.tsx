import { Modal, Button, Space, Image, Divider } from "antd";
import { Product } from "types";
import { CatalogObject } from "square";
import { useProductModal } from "hooks";
import { VariationSelector } from "components/product/VariationSelector";
import { ModifierSelector } from "components/product/ModifierSelector";

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
  variations: CatalogObject[];
  modifierLists: CatalogObject[];
  onAddToCart: (product: Product) => void;
}

export function ProductModal({
  visible,
  onClose,
  product,
  variations,
  modifierLists,
  onAddToCart,
}: ProductModalProps) {
  const {
    selectedVariation,
    selectedModifiers,
    totalPrice,
    handleVariationChange,
    handleModifierChange,
    getSelectedModifierIds
  } = useProductModal({ visible, variations, modifierLists });

  const addToCartWithOptions = () => {
    if (!selectedVariation) return;
    
    onAddToCart({
      ...product,
      price: totalPrice,
      selectedVariation: selectedVariation ? {
        id: selectedVariation.id,
        name: selectedVariation.itemVariationData?.name || "Default",
        price: selectedVariation.itemVariationData?.priceMoney ? 
          Number(selectedVariation.itemVariationData.priceMoney.amount) / 100 : 0
      } : undefined,
      selectedModifiers: selectedModifiers
    });
    
    onClose();
  };

  return (
    <Modal
      title={product.name}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={addToCartWithOptions}
          disabled={!selectedVariation}
        >
          Add to Cart - ${totalPrice.toFixed(2)}
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {product.image && (
          <Image 
            src={product.image} 
            alt={product.name}
            width={200}
            style={{ margin: '0 auto', display: 'block' }}
          />
        )}
        
        <Divider orientation="center">Select Options</Divider>
        
        <VariationSelector 
          variations={variations} 
          selectedVariationId={selectedVariation?.id || null} 
          onChange={handleVariationChange} 
        />

        <ModifierSelector 
          modifierLists={modifierLists} 
          selectedModifiers={selectedModifiers}
          onChange={handleModifierChange}
          getSelectedModifierIds={getSelectedModifierIds}
        />
      </Space>
    </Modal>
  );
}