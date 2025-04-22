import { useState } from 'react';
import { Product } from 'types/product';
import { FilterOptions } from 'components/SearchAndFilter/FilterPanel';

export interface CategoryOption {
  id: string;
  name: string;
}

export function useProductFilter(products: Product[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  const getCategories = (): CategoryOption[] => {
    const categoryMap = new Map<string, CategoryOption>();
    
    products.forEach(product => {
      if (product.categories?.length) {
        product.categories.forEach((cat: { id: string; name?: string }) => {
          if (!categoryMap.has(cat.id)) {
            categoryMap.set(cat.id, {
              id: cat.id,
              name: cat.name || 'Unknown Category'
            });
          }
        });
      }
    });
    
    return Array.from(categoryMap.values());
  };

  const getMaxPrice = (): number => {
    return Math.ceil(Math.max(...products.map(product => product.price), 0));
  };

  const getFilteredProducts = (): Product[] => {
    return products.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory: boolean = !filters.categoryId || 
        (product.categories?.some((cat: { id: string }) => cat.id === filters.categoryId) ?? false);

      const matchesPrice = !filters.priceRange || 
        (product.price >= filters.priceRange[0] && 
         product.price <= filters.priceRange[1]);
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  const categories = getCategories();
  const maxPrice = getMaxPrice();
  const filteredProducts = getFilteredProducts();

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredProducts,
    categories,
    maxPrice
  };
}