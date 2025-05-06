import { fetchProducts } from "services/productService";
import { HomeClient } from "./HomeClient";

// This is a Server Component that fetches data server-side
export default async function HomePage() {
  // Server-side data fetching (SSR)
  const products = await fetchProducts();
  
  return <HomeClient products={products} />;
}