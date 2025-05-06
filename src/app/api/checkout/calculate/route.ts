import { NextRequest, NextResponse } from "next/server";
import { Client, Environment } from "square";
import { JSONStringify } from "json-with-bigint";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locationId, lineItems, autoApplyTaxes = true, autoApplyDiscounts = true } = body;

    if (!locationId || !lineItems || !Array.isArray(lineItems)) {
      console.error('Invalid request parameters:', { locationId, lineItems });
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const response = await client.ordersApi.calculateOrder({
      order: {
        locationId,
        lineItems,
        pricingOptions: {
          autoApplyTaxes,
          autoApplyDiscounts
        }
      }
    });

    const responseJson = JSON.parse(JSONStringify(response.result));
    console.log(responseJson);
    return NextResponse.json(responseJson);
  } catch (error) {
    console.error('Error calculating order:', error);
    return NextResponse.json({ error: 'Failed to calculate order' }, { status: 500 });
  }
}