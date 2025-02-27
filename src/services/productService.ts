import { Client, Environment } from "square";
import { Product } from "types/product";


const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
});

export async function fetchProducts(): Promise<Product[]> {
  

  const response = await client.catalogApi.listCatalog();
  const objects = response.result.objects || [];
  console.log("objects", objects);

  const products: Product[] = objects
    .filter((obj) => obj.type === "ITEM")
    .map(obj => {
      const itemData = obj.itemData;
      const variation = itemData?.variations && 
                        itemData.variations.length > 0 ? itemData.variations[0] : null;
      let price = 0;
      console.log("variation", variation);
      if (
        variation &&
        variation.itemVariationData &&
        variation.itemVariationData.priceMoney
      ) {
        price = Number(variation.itemVariationData.priceMoney.amount)/100;
      }
      console.log("price", price);
      //standard image for now, will be updated later
      const image = "https://e7.pngegg.com/pngimages/833/426/png-clipart-black-shopping-cart-icon-for-free-black-shopping-cart-thumbnail.png";
      return {
        id: obj.id,
        name: itemData?.name ?? "Unknown Product",
        price,
        image,
      };
    });

  return products;
}

export async function fetchProductDetails(productId: string) {
  const response = await fetch(`/api/products/${productId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }

  const data = await response.json();
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: data.objects?.find((obj: any) => obj.id === productId),
    relatedObjects: data.relatedObjects
  };
}