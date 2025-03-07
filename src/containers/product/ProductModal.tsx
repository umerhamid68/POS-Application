import { Modal, Button, Space, Image, Divider, Spin } from "antd";
import { Product } from "types";
import { CatalogObject } from "square";
import { useProductModal } from "hooks";
import { VariationSelector } from "components/product/VariationSelector";
import { ModifierSelector } from "components/product/ModifierSelector";
import { useCart } from "context/CartContext";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
  variations: CatalogObject[];
  modifierLists: CatalogObject[];
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export function ProductModal({
  visible,
  onClose,
  product,
  variations,
  modifierLists,
  onAddToCart,
  isLoading=false,
}: ProductModalProps) {
  const {
    selectedVariation,
    selectedModifiers,
    totalPrice,
    handleVariationChange,
    handleModifierChange,
    getSelectedModifierIds
  } = useProductModal({ visible, variations, modifierLists });

  const { 
    isItemInCart, 
    getItemQuantity, 
    updateQuantity 
  } = useCart();


  const inCart = isItemInCart(
    product.id, 
    selectedVariation?.id,
    selectedModifiers
  );
  
  const quantity = getItemQuantity(
    product.id, 
    selectedVariation?.id,
    selectedModifiers
  );

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
    //onClose();
  };

  const handleIncrement = () => {
    if (!selectedVariation) return;
    updateQuantity(product.id, selectedVariation.id, quantity + 1, selectedModifiers);
  };
  
  const handleDecrement = () => {
    if (!selectedVariation) return;
    updateQuantity(product.id, selectedVariation.id, Math.max(0, quantity - 1), selectedModifiers);
  };

  return (
    
    <Modal
      title={product.name}
      open={visible}
      onCancel={onClose}
      footer={[
        <div key="footer" style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Button key="close" onClick={onClose}>
            Close
          </Button>
          
          {!inCart ? (
            <Button 
              key="addToCart" 
              type="primary" 
              onClick={addToCartWithOptions}
              disabled={!selectedVariation}
            >
              Add to Cart - ${totalPrice.toFixed(2)}
            </Button>
          ) : (
            <Space key="quantity" size="small">
              <Button
                icon={<MinusOutlined />}
                onClick={handleDecrement}
                disabled={quantity <= 1}
              />
              <text
                style={{ width: "60px", textAlign: "center" }}
              > {quantity} 
              </text>
              <Button
                icon={<PlusOutlined />}
                onClick={handleIncrement}
              />
            </Space>
          )}
        </div>
      ]}
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin tip="Loading product details..." />
        </div>
      ) :
      
      ( <Space direction="vertical" style={{ width: "100%" }}>
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
      )}
      {inCart && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <span style={{ color: "green" }}>
            This item is in your cart with the selected options.
          </span>
        </div>
      )}
    
    </Modal>
  );
}