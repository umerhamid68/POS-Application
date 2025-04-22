import { CatalogObject, Client, Environment } from "square";
import { Product, ProductCategory } from "types/product";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
});

//helper function to fetch images for products that have image IDs
async function fetchProductImages(imageIds: string[]): Promise<Map<string, string>> {
  if (!imageIds.length) return new Map();
  
  try {
    const response = await client.catalogApi.batchRetrieveCatalogObjects({
      objectIds: imageIds,
      includeRelatedObjects: false,
    });
    
    const imageMap = new Map<string, string>();
    const images = response.result.objects || [];
    
    images.forEach(img => {
      if (img.type === "IMAGE" && img.id && img.imageData?.url) {
        imageMap.set(img.id, img.imageData.url);
      }
    });
    //console.log("Image map:", imageMap); 
    return imageMap;
  } catch (error) {
    console.error("Error fetching product images:", error);
    return new Map();
  }
}

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

  //all image IDs from products
  const allImageIds: string[] = [];
  objects.forEach(obj => {
    if (obj.type === "ITEM" && obj.itemData?.imageIds) {
      obj.itemData.imageIds.forEach(a => {
          allImageIds.push(a);
        }
      );
    }
  });
  //console.log("All image IDs:", allImageIds);

  //all images in a single batch request
  const imageUrlMap = await fetchProductImages(allImageIds);

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

      let image = "https://e7.pngegg.com/pngimages/833/426/png-clipart-black-shopping-cart-icon-for-free-black-shopping-cart-thumbnail.png";
      if (itemData?.imageIds?.length) {
        const imageId = itemData.imageIds[0];
        const imageUrl = imageUrlMap.get(imageId);
        if (imageUrl) {
          image = imageUrl;
        }
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
    
    // //process images
    // const images = data.relatedObjects
    //   .filter((obj: CatalogObject) => obj.type === "IMAGE")
    //   .reduce((map: Map<string, string>, image: CatalogObject) => {
    //     if (image.id && image.imageData?.url) {
    //       map.set(image.id, image.imageData.url);
    //     }
    //     return map;
    //   }, new Map());
    
    // //update product with image URL
    // if (data.objects?.[0]?.itemData) {
    //   // if (data.objects[0].itemData.imageIds?.length) {
    //   //   const imageId = data.objects[0].itemData.imageIds[0];
    //   //   if (images.has(imageId)) {
    //   //     data.objects[0].itemData.imageUrl = images.get(imageId);
    //   //   }
    //   // }
      
    //   //check variations for image IDs (in case of difference)
    //   if (data.objects[0].itemData.variations) {
    //     for (const variation of data.objects[0].itemData.variations) {
    //       if (variation.itemVariationData?.imageIds?.length) {
    //         const imageId = variation.itemVariationData.imageIds[0];
    //         if (images.has(imageId)) {
    //           variation.itemVariationData.imageUrl = images.get(imageId);
    //         }
    //       }
    //     }
    //   }
    // }

    // Update category names
    if (data.objects?.[0]?.itemData?.categories) {
      data.objects[0].itemData.categories.forEach((cat: ProductCategory) => {
        if (categories.has(cat.id)) {
          cat.name = categories.get(cat.id).name;
        }
      });
    }
  }
  
  return {
    product: data.objects?.[0],
    relatedObjects: data.relatedObjects
  };
}