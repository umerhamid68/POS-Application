import { NextRequest, NextResponse } from "next/server";
import { Client, Environment } from "square";
import { JSONStringify } from "json-with-bigint";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  // Await the params object before accessing its properties
  const { productId } = await params;

  try {
    const response = await client.catalogApi.batchRetrieveCatalogObjects({
      includeRelatedObjects: true,
      objectIds: [productId],
    });
    const responseJson = JSON.parse(JSONStringify(response.result));
    return NextResponse.json(responseJson);
  } catch (error) {
    console.error("Error fetching product details from Square:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}