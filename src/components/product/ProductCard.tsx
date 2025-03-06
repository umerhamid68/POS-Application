import { Card, Button, InputNumber, Space } from "antd";
import Image from "next/image";
import { Product } from "types/product";
import { useCart } from "context/CartContext";
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined } from "@ant-design/icons";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { 
    addItem, 
    updateQuantity, 
    isItemInCart, 
    getItemQuantity 
  } = useCart();
  
  const inCart = isItemInCart(product.id, undefined);
  const quantity = getItemQuantity(product.id, undefined);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };
  
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, undefined, quantity + 1);
  };
  
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, undefined, Math.max(0, quantity - 1));
  };

  return (
    <Card
      hoverable
      onClick={onClick}
      cover={
        <Image
          alt={product.name}
          src={product.image}
          style={{ objectFit: "cover", height: 200 }}
          width={300}
          height={200}
        />
      }
      style={{ marginBottom: 16 }}
    >
      <Card.Meta title={product.name} description={`$${product.price.toFixed(2)}`} />
      
      {!inCart ? (
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          style={{ marginTop: 16, width: "100%" }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      ) : (
        <Space style={{ marginTop: 16, width: "100%", justifyContent: "space-between" }}>
          <Button 
            icon={<MinusOutlined />} 
            onClick={handleDecrement}
            disabled={quantity <= 1}
          />
          <InputNumber
            min={0}
            max={99}
            value={quantity}
            controls={false}
            style={{ width: "70px", textAlign: "center" }}
          />
          <Button 
            icon={<PlusOutlined />} 
            onClick={handleIncrement} 
          />
        </Space>
      )}
    </Card>
  );
}