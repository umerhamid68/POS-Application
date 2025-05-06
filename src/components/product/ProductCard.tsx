import { Card, Button } from "antd";
import Image from "next/image";
import { Product } from "types/product";
import { AppButton } from "components/Button/CommonButton";


interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {

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
      
      <AppButton
        variant="block" 
      >
        View Details
      </AppButton>
    </Card>
  );
}