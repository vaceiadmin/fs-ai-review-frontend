export function formatFinancialAmount(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "-";

  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(num)) return String(value);

  if (Math.abs(num - Math.round(num)) < 1e-9) {
    return Math.round(num).toLocaleString("en-US");
  }

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatLabeledAmount(
  label: "Found value" | "Expected value",
  raw?: string,
  numericValue?: number | string | null
): string {
  if (numericValue !== null && numericValue !== undefined && numericValue !== "") {
    return `${label}: ${formatFinancialAmount(numericValue)}`;
  }

  if (!raw) return "";

  const match = raw.match(/^(Found value|Expected value):\s*(.+)$/i);
  if (match) {
    const prefix = match[1].toLowerCase().startsWith("found") ? "Found value" : "Expected value";
    return `${prefix}: ${formatFinancialAmount(match[2].trim())}`;
  }

  return raw;
}
