import type { NextApiRequest, NextApiResponse } from 'next';
import { Client, Environment } from 'square';
import {JSONStringify} from 'json-with-bigint';

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { locationId, lineItems, autoApplyTaxes = true , autoApplyDiscounts = false} = req.body;

    if (!locationId || !lineItems || !Array.isArray(lineItems)) {
      console.error('Invalid request parameters:', { locationId, lineItems });
      return res.status(400).json({ error: 'Invalid request parameters' });
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
    res.status(200).json(responseJson);
  } catch (error) {
    console.error('Error calculating order:', error);
    res.status(500).json({ error: 'Failed to calculate order' });
  }
}