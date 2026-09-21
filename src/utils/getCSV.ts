/**
 * The product CSV is bundled as a string at build time via Vite's `?raw`
 * import. This avoids runtime path/MIME/CORS issues entirely and works in
 * dev, preview, a static server (Live Server), and even from `file://`.
 */
import csvText from "../data/GreenCart_Products.csv?raw";

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  size: string;
  description: string;
  ingredients: string;
  plasticFree: boolean;
  vegan: boolean;
  locallyMade: boolean;
  carbonNeutralShipping: boolean;
  ecoBadges: string[];
  inventory: number;
  rating: number;
  reviewCount: number;
  supplierName: string;
  certification: string;
  imageUrl: string;
  relatedProductIds: string[];
}

const PRODUCT_IMAGES = import.meta.glob("../assets/productImages/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const IMAGE_BY_FILENAME: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_IMAGES).map(([path, url]) => [path.split("/").pop() as string, url]),
);

/** Resolves a CSV image filename to a bundled asset URL, or "" if not found. */
function resolveImageUrl(filename: string): string {
  return IMAGE_BY_FILENAME[filename.trim()] ?? "";
}

/**
 * Parses a single line of CSV into fields, respecting double-quoted values
 * (which may themselves contain commas). Doubled quotes ("") become a single quote.
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++; // skip the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

/** Parses the full CSV text into a matrix of rows, handling quoted newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      row += char;
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") i++; // handle CRLF
      if (row.trim() !== "") rows.push(parseCsvLine(row));
      row = "";
    } else {
      row += char;
    }
  }

  if (row.trim() !== "") rows.push(parseCsvLine(row));
  return rows;
}

const toBool = (value: string): boolean => value.trim().toUpperCase() === "TRUE";

const toList = (value: string, separator = ";"): string[] =>
  value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);

/** Maps a raw CSV row (keyed by header) to a typed Product. */
function rowToProduct(record: Record<string, string>): Product {
  return {
    id: record.ProductID,
    name: record.Name,
    category: record.Category,
    brand: record.Brand,
    price: Number.parseFloat(record.Price) || 0,
    size: record.Size,
    description: record.Description,
    ingredients: record.Ingredients ?? "",
    plasticFree: toBool(record.PlasticFree ?? ""),
    vegan: toBool(record.Vegan ?? ""),
    locallyMade: toBool(record.LocallyMade ?? ""),
    carbonNeutralShipping: toBool(record.CarbonNeutralShipping ?? ""),
    ecoBadges: toList(record.EcoBadges ?? ""),
    inventory: Number.parseInt(record.Inventory, 10) || 0,
    rating: Number.parseFloat(record.Rating) || 0,
    reviewCount: Number.parseInt(record.ReviewCount, 10) || 0,
    supplierName: record.SupplierName,
    certification: record.Certification,
    imageUrl: resolveImageUrl(record.ImageURL ?? ""),
    relatedProductIds: toList(record.RelatedProductIDs ?? ""),
  };
}

/**
 * Parses the bundled GreenCart product CSV into typed Products.
 * @returns A promise resolving to an array of typed Products.
 */
export async function getProducts(): Promise<Product[]> {
  const [headerRow, ...dataRows] = parseCsv(csvText);
  if (!headerRow) return [];

  return dataRows.map((cells) => {
    const record: Record<string, string> = {};
    headerRow.forEach((header, index) => {
      record[header.trim()] = cells[index] ?? "";
    });
    return rowToProduct(record);
  });
}

export default getProducts;
