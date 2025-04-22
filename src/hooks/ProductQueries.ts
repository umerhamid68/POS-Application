import { useQuery } from '@tanstack/react-query';
import { fetchProductDetails } from 'services/productService';


export function useProductDetails(productId: string | null) {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: ({queryKey}) => fetchProductDetails(queryKey[1]!), 
  });
}