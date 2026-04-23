export interface PageParseResult {
  pages: number[];
  error: string | null;
}

export function buildExpressionFromPages(pages: number[]): string {
  if (pages.length === 0) return '';

  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const chunks: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
      continue;
    }

    chunks.push(start === end ? `${start}` : `${start}-${end}`);
    start = sorted[i];
    end = sorted[i];
  }

  chunks.push(start === end ? `${start}` : `${start}-${end}`);
  return chunks.join(', ');
}

export function parsePageExpression(expression: string, pageCount: number): PageParseResult {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { pages: [], error: null };
  }

  const chunks = trimmed
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length === 0) {
    return { pages: [], error: 'Enter at least one page or range.' };
  }

  const pages: number[] = [];
  const seen = new Set<number>();

  for (const chunk of chunks) {
    const rangeMatch = chunk.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end < 1 || start > pageCount || end > pageCount || start > end) {
        return { pages: [], error: `Range ${chunk} is invalid for a ${pageCount}-page PDF.` };
      }

      for (let page = start; page <= end; page++) {
        if (!seen.has(page)) {
          seen.add(page);
          pages.push(page);
        }
      }
      continue;
    }

    if (/^\d+$/.test(chunk)) {
      const page = Number(chunk);
      if (page < 1 || page > pageCount) {
        return { pages: [], error: `Page ${page} is out of bounds for this PDF.` };
      }

      if (!seen.has(page)) {
        seen.add(page);
        pages.push(page);
      }
      continue;
    }

    return { pages: [], error: `Could not parse ${chunk}. Use format like 1-3, 5, 8-10.` };
  }

  return { pages, error: null };
}

export function normalizePageSelection(pages: number[], pageCount: number): number[] {
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error('Select at least one page.');
  }

  const unique: number[] = [];
  const seen = new Set<number>();

  for (const page of pages) {
    if (!Number.isInteger(page) || page < 1 || page > pageCount) {
      throw new Error(`Page ${page} is out of bounds for a ${pageCount}-page PDF.`);
    }
    if (!seen.has(page)) {
      seen.add(page);
      unique.push(page);
    }
  }

  return unique;
}
