import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import fs from "fs";
import path from "path";

function fetchTransactionsFromFile() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public/content/data/story-assets.json"
    );
    const jsonData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonData) || [];
  } catch (error) {
    console.error("Error reading transactions from file:", error);
    return [];
  }
}

async function fetchTransactions() {
  try {
    const response = await axios.get(
      `https://aeneid.storyscan.xyz/api/v2/main-page/transactions`
    );
    console.log(response.data);
    return response.data || []; // Adjust based on actual API response structure
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

function processTransactionData(data: any) {
  return {
    contract: {
      address: data.contract.address,
      name: data.contract.name,
      symbol: data.contract.symbol,
      totalSupply: data.contract.total_supply,
    },
    assets: data.assets.map((asset: any) => ({
      tokenId: asset.token_id,
      tokenAddress: asset.token_address,
      tokenName: asset.token_name,
      tokenSymbol: asset.token_symbol,
      tokenURI: asset.token_uri,
      owner: asset.owner,
      metadata: {
        name: asset.metadata.name,
        description: asset.metadata.description,
        externalUrl: asset.metadata.external_url,
        image: asset.metadata.image,
        attributes: asset.metadata.attributes.map((attr: any) => ({
          traitType: attr.trait_type,
          value: attr.value,
          maxValue: attr.max_value || null,
        })),
      },
    })),
  };
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const transactions = await fetchTransactionsFromFile();
    const formattedTransactions = processTransactionData(transactions);

    return new Response(JSON.stringify({ ...formattedTransactions }));
    // return res.status(200).json({ transactions: formattedTransactions });
  } catch (error) {
    console.error("API Handler Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500 }
    );
  }
}
