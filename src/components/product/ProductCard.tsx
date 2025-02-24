import { Card, Button } from "antd";
import Image from "next/image";
import { Product } from "types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card
      hoverable
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
      <Card.Meta title={product.name} description={`$${product.price}`} />
      <Button
        type="primary"
        style={{ marginTop: 16, width: "100%" }}
        onClick={() => onAddToCart && onAddToCart(product)}
      >
        Add to Cart
      </Button>
    </Card>
  );
}
