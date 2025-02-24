import { GetServerSideProps } from "next";
import { fetchProducts } from "services/productService";
import { Product } from "types/product";
import { ProductCard } from "components/product/ProductCard";
import { Row, Col } from "antd";

interface HomePageProps {
  products: Product[];
}

export default function HomePage({ products }: HomePageProps) {
  const handleAddToCart = (product: Product) => {
    console.log("Add to Cart:", product);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        {products.map((product) => (
          <Col key={product.id}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await fetchProducts();

  return {
    props: {
      products,
    },
  };
};
