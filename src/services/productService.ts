import { CatalogObject, Client, Environment } from "square";
import { Product, ProductCategory } from "types/product";
import { TaxInfo } from "hooks/TaxManagement";
import { DiscountInfo } from "hooks/DiscountManagement";

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

//helper function to extract tax info from related objects
function extractTaxInfo(taxIds: string[] | undefined, 
  taxObjects: CatalogObject[]): TaxInfo[] | undefined {
  if (!taxIds || !taxIds.length) return undefined;
  
  const taxInfoArray = taxIds
    .map(taxId => {
      const taxObject = taxObjects.find(obj => 
        obj.type === "TAX" && obj.id === taxId
      );
      
      if (taxObject && taxObject.taxData) {
        return {
          id: taxObject.id,
          name: taxObject.taxData.name || "Tax",
          percentage: Number(taxObject.taxData.percentage) || 0,
          inclusionType: taxObject.taxData.inclusionType || "ADDITIVE"
        };
      }
      return null;
    })
    .filter(tax => tax !== null) as TaxInfo[];
  
  return taxInfoArray.length > 0 ? taxInfoArray : undefined;
}

//helper function to extract discount info from catalog objects
function extractDiscountInfo(
  objects: CatalogObject[]
): { discounts: DiscountInfo[], productDiscountMap: Map<string, DiscountInfo[]> } {
  //extract discount objects
  const discountObjects = objects.filter(obj => obj.type === "DISCOUNT");
  
  //extract pricing rule objects
  const pricingRuleObjects = objects.filter(obj => obj.type === "PRICING_RULE");
  
  //extract product set objects
  const productSetObjects = objects.filter(obj => obj.type === "PRODUCT_SET");
  
  //create discount info objects
  const discounts: DiscountInfo[] = discountObjects.map(obj => {
    return {
      id: obj.id!,
      name: obj.discountData?.name || "Discount",
      percentage: Number(obj.discountData?.percentage) || 0,
      discountType: obj.discountData?.discountType || "FIXED_PERCENTAGE"
    };
  });
  
  //map discounts to products using pricing rules and product sets
  const productDiscountMap = new Map<string, DiscountInfo[]>();
  
  pricingRuleObjects.forEach(rule => {
    if (!rule.pricingRuleData?.discountId || !rule.pricingRuleData?.matchProductsId) return;
    
    const discountId = rule.pricingRuleData.discountId;
    const productSetId = rule.pricingRuleData.matchProductsId;
    
    //find the discount
    const discount = discounts.find(d => d.id === discountId);
    if (!discount) return;
    
    //update discount with pricing rule info
    discount.pricingRuleId = rule.id;
    discount.productSetId = productSetId;
    
    //find the product set
    const productSet = productSetObjects.find(ps => ps.id === productSetId);
    if (!productSet || !productSet.productSetData) return;
    
    //check if the product set has specific product IDs
    if (productSet.productSetData.productIdsAny) {
      productSet.productSetData.productIdsAny.forEach(productId => {
        if (!productDiscountMap.has(productId)) {
          productDiscountMap.set(productId, []);
        }
        productDiscountMap.get(productId)!.push({...discount});
      });
    }
    
    //also check for variation IDs in the product set (for variation-specific discounts)
    if (productSet.productSetData.productIdsAll) {
      productSet.productSetData.productIdsAll.forEach(productId => {
        if (!productDiscountMap.has(productId)) {
          productDiscountMap.set(productId, []);
        }
        productDiscountMap.get(productId)!.push({...discount});
      });
    }
  });
  
  return { discounts, productDiscountMap };
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await client.catalogApi.listCatalog();
  
  const objects = response.result.objects || [];

  //extract tax objects
  const taxObjects = objects.filter(obj => obj.type === "TAX");

  //extract discount info and product-discount mapping
  const { discounts, productDiscountMap } = extractDiscountInfo(objects);

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
      
      //extract tax info if available
      const taxInfo = extractTaxInfo(itemData?.taxIds ?? undefined, taxObjects);
      
      //get discount info for this product
      const discountInfo = productDiscountMap.get(obj.id!);
      
      //also check for discounts on variations (in case discount only exists on variations)
      const variationDiscounts: DiscountInfo[] = [];
      if (itemData?.variations) {
        itemData.variations.forEach(variation => {
          if (variation.id) {
            const varDiscounts = productDiscountMap.get(variation.id);
            if (varDiscounts) {
              // Add variation ID to each discount for reference
              varDiscounts.forEach(discount => {
                variationDiscounts.push({
                  ...discount,
                  variationId: variation.id
                });
              });
            }
          }
        });
      }
      
      // // Combine product-level and variation-level discounts
      // let allDiscounts: DiscountInfo[] | string;
      // if ((discountInfo && discountInfo.length > 0) || variationDiscounts.length > 0) {
      //   allDiscounts = [...(discountInfo || []), ...variationDiscounts];
      // }
      
      return {
        id: obj.id,
        name: itemData?.name ?? "Unknown Product",
        price,
        image,
        categories: productCategories,
        taxInfo, //add tax info to the product
        discountInfo: (discountInfo && discountInfo.length > 0) || variationDiscounts.length > 0 
          ? [...(discountInfo || []), ...variationDiscounts]
          : null, //add discount info to product
      };
    });
    
  // console.log("Products:", products); 
  // console.log("Product discounts:", products.map(p => p.discountInfo));

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