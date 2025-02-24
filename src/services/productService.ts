import { Product } from "types/product";

export async function fetchProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  //artificial data returned temporarily
  return [
    {
      id: "1",
      name: "Product A",
      price: 29.99,
      image: "/public/pexels-laryssa-suaid-798122-1667088.jpg",
    },
    {
      id: "2",
      name: "Product B",
      price: 49.99,
      image: "/public/pexels-madebymath-90946.jpg",
    },
  ];
}
