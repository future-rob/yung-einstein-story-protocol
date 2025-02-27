import fs from "fs";
import path from "path";
import { processTransactionData } from "./processTransactionData";

export function fetchTransactionsFromFile() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public/content/data/story-assets.json"
    );
    const jsonData = fs.readFileSync(filePath, "utf-8");

    const jsonBody = processTransactionData(JSON.parse(jsonData) || []);
    return jsonBody;
  } catch (error) {
    console.error("Error reading transactions from file:", error);
    return [];
  }
}
