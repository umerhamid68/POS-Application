import { CatalogObject, Client, Environment } from "square";
import { Product, ProductCategory } from "types/product";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
});

export async function fetchProducts(): Promise<Product[]> {
  const response = await client.catalogApi.listCatalog();
  
  const objects = response.result.objects || [];

  const categories = objects
    .filter(obj => obj.type === "CATEGORY")
    .reduce((map, category) => {
      if (category.id && category.categoryData?.name) {
        map.set(category.id, {
          id: category.id,
          name: category.categoryData.name
        });
      }
      return map;
    }, new Map<string, ProductCategory>());

  const products: Product[] = objects
    .filter(obj => obj.type === "ITEM")
    .map(obj => {
      const itemData = obj.itemData;
      const variation = itemData?.variations && 
                        itemData.variations.length > 0 ? itemData.variations[0] : null;
      let price = 0;
      
      if (
        variation?.itemVariationData?.priceMoney
      ) {
        price = Number(variation.itemVariationData.priceMoney.amount)/100;
      }

      const productCategories: ProductCategory[] = [];
      if (itemData?.categories?.length) {
        itemData.categories.forEach(cat => {
          if (cat.id) {
            const category = categories.get(cat.id);
            if (category) {
              productCategories.push({
                id: cat.id,
                name: category.name,
                ordinal: cat.ordinal != null ? Number(cat.ordinal) : undefined
              });
            } else {
              productCategories.push({
                id: cat.id,
                ordinal: cat.ordinal != null ? Number(cat.ordinal) : undefined
              });
            }
          }
        });
      }
      
      const image = "https://e7.pngegg.com/pngimages/833/426/png-clipart-black-shopping-cart-icon-for-free-black-shopping-cart-thumbnail.png";
      
      return {
        id: obj.id,
        name: itemData?.name ?? "Unknown Product",
        price,
        image,
        categories: productCategories
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

  if (data.relatedObjects) {
    const categories = data.relatedObjects
      .filter((obj: CatalogObject) => obj.type === "CATEGORY")
      .reduce((map: Map<string, ProductCategory>, category: CatalogObject) => {
        if (category.id && category.categoryData?.name) {
          map.set(category.id, {
            id: category.id,
            name: category.categoryData.name
          });
        }
        return map;
      }, new Map());
      console.log("Categories:", categories);

    if (data.objects?.[0]?.itemData?.categories) {
      data.objects[0].itemData.categories.forEach((cat: ProductCategory) => {
        if (categories.has(cat.id)) {
          cat.name = categories.get(cat.id).name;
          console.log("Category name:", cat.name);
        }
      });
    }
  }
  
  return {
    product: data.objects?.[0],
    relatedObjects: data.relatedObjects
  };
}