'use server'

import { Client, Environment } from "square";
import { OrderLineItem } from "square";
import { revalidatePath } from "next/cache";
import { JSONStringify } from "json-with-bigint";

// Initialize Square client
const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
});

export async function createOrder(
  idempotencyKey: string,
  locationId: string,
  lineItems: OrderLineItem[],
  autoApplyTaxes: boolean = true,
  autoApplyDiscounts: boolean = true
) {
  try {
    console.log('Creating order with idempotency key:', idempotencyKey);
    console.log('Order line items:', lineItems);
    
    // Call Square API to create the order
    const response = await client.ordersApi.createOrder({
      idempotencyKey,
      order: {
        locationId,
        lineItems,
        pricingOptions: {
          autoApplyTaxes,
          autoApplyDiscounts
        }
      }
    });
    
    // Parse the response to handle BigInt values
    const responseJson = JSON.parse(JSONStringify(response.result));
    
    // Revalidate the checkout page to reflect the changes
    revalidatePath('/checkout');
    
    return { 
      success: true, 
      data: responseJson,
      error: null
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return { 
      success: false, 
      data: null,
      error: 'Failed to create order. Please try again.'
    };
  }
}