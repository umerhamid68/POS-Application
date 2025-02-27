import { GetServerSideProps } from "next";
import { useState } from "react";
import { Row, Col } from "antd";
import { fetchProducts, fetchProductDetails } from "services/productService";
import { Product } from "types/product";
import { ProductCard } from "components/product/ProductCard";
import { ProductModal } from "containers/product/ProductModal";
import { CatalogObject } from "square";

interface HomePageProps {
  products: Product[];
}

export default function HomePage({ products }: HomePageProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<CatalogObject[]>([]);
  const [modifierLists, setModifierLists] = useState<CatalogObject[]>([]);

  const handleAddToCart = (product: Product) => {
    console.log("Added to Cart:", product);
  };

  const handleProductClick = async (product: Product) => {
    try {
      const response = await fetchProductDetails(product.id);
      const productDetails = response.product;
      const relatedObjects = response.relatedObjects || [];
      const productVariations = productDetails?.itemData?.variations || [];

      const modLists = relatedObjects.filter((obj: CatalogObject) => 
        obj.type === "MODIFIER_LIST"
      );
      
      // console.log("Product details:", productDetails);
      // console.log("Variations:", productVariations);
      // console.log("Modifier lists:", modLists);
      
      setSelectedProduct({...product, ...productDetails}); //for the modal to display image and name
      setVariations(productVariations);
      setModifierLists(modLists);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {products?.map((product) => (
          <Col lg={6} sm={12} md={8} xs={24} key={product.id}>
            <ProductCard 
              product={product} 
              onAddToCart={handleAddToCart} 
              onClick={() => handleProductClick(product)} 
            />
          </Col>
        ))}
      </Row>

      {selectedProduct && (
        <ProductModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          product={selectedProduct}
          variations={variations}
          modifierLists={modifierLists}
          onAddToCart={handleAddToCart}
        />
      )}
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