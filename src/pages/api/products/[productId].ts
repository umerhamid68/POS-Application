import { NextApiRequest, NextApiResponse } from "next";
import { Client, Environment } from "square";
import { JSONStringify } from "json-with-bigint";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN!, 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.query;

  try {
    const response = await client.catalogApi.batchRetrieveCatalogObjects({
      includeRelatedObjects: true,
      objectIds: [productId as string],
    });
    const responseJson = JSON.parse(JSONStringify(response.result)); //parising bigint causes error so different library is used to parse it
    res.status(200).json(responseJson);
  } catch (error) {
    console.error("Error fetching product details from Square:", error);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
}