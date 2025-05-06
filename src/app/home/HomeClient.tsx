'use client';

import { useState, useEffect } from "react";
import { Row, Col, Empty } from "antd";
import { ProductCard } from "components/product/ProductCard";
import { SearchBar } from "components/SearchAndFilter/SearchBar";
import { FilterPanel } from "components/SearchAndFilter/FilterPanel";
import { CartButton } from "components/Button/CartButton";
import { CartDrawer } from "components/cart/CartDrawer";
import { ProductModal } from "containers/product/ProductModal";
import { useProductFilter } from "hooks/ProductFilter";
import { useCart } from "context/CartContext";
import { useProductDetails } from "hooks/ProductQueries";
import { Product } from "types/product";
import { CatalogObject } from "square";

interface HomeClientProps {
  products: Product[];
}

export function HomeClient({ products }: HomeClientProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<CatalogObject[]>([]);
  const [modifierLists, setModifierLists] = useState<CatalogObject[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { 
    data: productDetailsData,
    isLoading: isLoadingDetails,
    error: productDetailsError
  } = useProductDetails(selectedProductId);

  useEffect(() => {
    if (productDetailsData && selectedProductId) {
      console.log("Product details data:", productDetailsData);
      const baseProduct = products.find(p => p.id === selectedProductId);
      
      if (baseProduct) {
        const productDetails = productDetailsData.product;
        const relatedObjects = productDetailsData.relatedObjects || [];
        const productVariations = productDetails?.itemData?.variations || [];
        const modLists = relatedObjects.filter((obj:CatalogObject) => obj.type === "MODIFIER_LIST");
        
        setSelectedProduct({...baseProduct, ...productDetails});
        setVariations(productVariations);
        setModifierLists(modLists);
      }
    }
  }, [productDetailsData, selectedProductId, products]);

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredProducts,
    categories,
    maxPrice
  } = useProductFilter(products);

  const { addItem, totalItems } = useCart();

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setIsModalVisible(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={6} lg={5}>
          <FilterPanel 
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
            maxPrice={maxPrice}
          />
        </Col>

        <Col xs={24} md={18} lg={19}>
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          {filteredProducts.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredProducts.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <ProductCard 
                    product={product} 
                    onClick={() => handleProductClick(product)} 
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              description="No products found matching your criteria"
              style={{ marginTop: 40 }}
            />
          )}
        </Col>
      </Row>

      <CartButton
        onClick={() => setIsCartVisible(true)}
      />

      {selectedProduct && (
        <ProductModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          product={selectedProduct}
          variations={variations}
          modifierLists={modifierLists}
          onAddToCart={handleAddToCart}
          isLoading={isLoadingDetails}
        />
      )}

      <CartDrawer
        visible={isCartVisible}
        onClose={() => setIsCartVisible(false)}
      />
    </div>
  );
}