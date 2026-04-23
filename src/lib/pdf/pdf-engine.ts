import { PDFDocument, degrees } from 'pdf-lib';
import { normalizePageSelection } from './page-selection';

export interface PDFOperationResult {
  blob: Blob;
  name: string;
}

type SplitMode = 'pages' | 'ranges';
type RotateMode = 'all' | 'selected';

interface SplitConfig {
  mode?: SplitMode;
  ranges?: string;
}

interface RotateConfig {
  mode?: RotateMode;
  pages?: number[];
}

interface PageRange {
  start: number;
  end: number;
}

interface PDFFilePayload {
  arrayBuffer: ArrayBuffer;
  fileName: string;
}

function toPdfBlob(bytes: Uint8Array): Blob {
  const normalized = new Uint8Array(bytes.byteLength);
  normalized.set(bytes);
  return new Blob([normalized.buffer], { type: 'application/pdf' });
}

function getBaseName(fileName: string): string {
  return fileName.replace(/\.pdf$/i, '');
}

function parseRangeExpression(expression: string, pageCount: number): PageRange[] {
  const trimmed = expression.trim();
  if (!trimmed) {
    throw new Error('Enter page ranges like 1-3, 5, 8-10.');
  }

  const ranges: PageRange[] = [];
  const chunks = trimmed
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length === 0) {
    throw new Error('Enter at least one valid page or range.');
  }

  for (const chunk of chunks) {
    const rangeMatch = chunk.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end < 1 || start > pageCount || end > pageCount || start > end) {
        throw new Error(`Invalid range \"${chunk}\" for a ${pageCount}-page PDF.`);
      }
      ranges.push({ start, end });
      continue;
    }

    const singleMatch = chunk.match(/^\d+$/);
    if (singleMatch) {
      const page = Number(chunk);
      if (page < 1 || page > pageCount) {
        throw new Error(`Page ${page} is out of bounds for a ${pageCount}-page PDF.`);
      }
      ranges.push({ start: page, end: page });
      continue;
    }

    throw new Error(`Could not parse \"${chunk}\". Use format like 1-3, 5, 8-10.`);
  }

  return ranges;
}

function buildPageResultName(fileName: string, prefix: string): string {
  return `${prefix}_${fileName}`;
}

/**
 * Merges multiple PDF files into one.
 */
export async function mergePDFs(files: PDFFilePayload[]): Promise<PDFOperationResult> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const pdf = await PDFDocument.load(file.arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const pdfBytes = await mergedPdf.save();
  return {
    blob: toPdfBlob(pdfBytes),
    name: 'merged_document.pdf'
  };
}

/**
 * Splits a PDF into multiple documents.
 */
export async function splitPDF(
  arrayBuffer: ArrayBuffer,
  fileName: string,
  config: SplitConfig = {}
): Promise<PDFOperationResult[]> {
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const baseName = getBaseName(fileName);
  const results: PDFOperationResult[] = [];

  const splitMode = config.mode ?? 'pages';

  if (splitMode === 'ranges') {
    const ranges = parseRangeExpression(config.ranges ?? '', pageCount);

    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const pageIndexes: number[] = [];

      for (let page = range.start; page <= range.end; page++) {
        pageIndexes.push(page - 1);
      }

      const copiedPages = await newPdf.copyPages(pdf, pageIndexes);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const suffix = range.start === range.end
        ? `page_${range.start}`
        : `pages_${range.start}-${range.end}`;

      results.push({
        blob: toPdfBlob(pdfBytes),
        name: `${baseName}_${suffix}.pdf`
      });
    }

    return results;
  }
  
  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(copiedPage);
    const pdfBytes = await newPdf.save();
    results.push({
      blob: toPdfBlob(pdfBytes),
      name: `${baseName}_page_${i + 1}.pdf`
    });
  }
  
  return results;
}

/**
 * Rotates all pages in a PDF.
 */
export async function rotatePDF(
  arrayBuffer: ArrayBuffer,
  fileName: string,
  rotationAngle: number,
  config: RotateConfig = {}
): Promise<PDFOperationResult> {
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const rotateMode = config.mode ?? 'all';

  if (rotateMode === 'selected') {
    const selectedPages = normalizePageSelection(config.pages ?? [], pages.length);
    const selectedIndexes = new Set(selectedPages.map((page) => page - 1));

    pages.forEach((page, index) => {
      if (!selectedIndexes.has(index)) {
        return;
      }
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotationAngle));
    });
  } else {
    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + rotationAngle));
    });
  }

  const pdfBytes = await pdf.save();
  return {
    blob: toPdfBlob(pdfBytes),
    name: buildPageResultName(fileName, 'rotated')
  };
}

/**
 * Removes selected pages from a PDF.
 */
export async function removePages(
  arrayBuffer: ArrayBuffer,
  fileName: string,
  pagesToRemove: number[]
): Promise<PDFOperationResult> {
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const normalized = normalizePageSelection(pagesToRemove, pageCount);
  const removeSet = new Set(normalized.map((page) => page - 1));

  if (removeSet.size >= pageCount) {
    throw new Error('You cannot remove all pages. Leave at least one page in the PDF.');
  }

  const resultPdf = await PDFDocument.create();
  const keepIndexes: number[] = [];
  for (let i = 0; i < pageCount; i++) {
    if (!removeSet.has(i)) {
      keepIndexes.push(i);
    }
  }

  const copiedPages = await resultPdf.copyPages(pdf, keepIndexes);
  copiedPages.forEach((page) => resultPdf.addPage(page));

  const pdfBytes = await resultPdf.save();
  return {
    blob: toPdfBlob(pdfBytes),
    name: buildPageResultName(fileName, 'cleaned')
  };
}

/**
 * Extracts selected pages from a PDF into a new file.
 */
export async function extractPages(
  arrayBuffer: ArrayBuffer,
  fileName: string,
  pagesToExtract: number[]
): Promise<PDFOperationResult> {
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const normalized = normalizePageSelection(pagesToExtract, pageCount);

  const resultPdf = await PDFDocument.create();
  const extractIndexes = normalized.map((page) => page - 1);
  const copiedPages = await resultPdf.copyPages(pdf, extractIndexes);
  copiedPages.forEach((page) => resultPdf.addPage(page));

  const pdfBytes = await resultPdf.save();
  return {
    blob: toPdfBlob(pdfBytes),
    name: buildPageResultName(fileName, 'extracted')
  };
}

/**
 * Reorders all pages according to the provided page order.
 */
export async function organizePages(
  arrayBuffer: ArrayBuffer,
  fileName: string,
  pageOrder: number[]
): Promise<PDFOperationResult> {
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();

  if (!Array.isArray(pageOrder) || pageOrder.length !== pageCount) {
    throw new Error('Invalid page order. Please include every page exactly once.');
  }

  const seen = new Set<number>();
  for (const page of pageOrder) {
    if (!Number.isInteger(page) || page < 1 || page > pageCount || seen.has(page)) {
      throw new Error('Invalid page order. Please include every page exactly once.');
    }
    seen.add(page);
  }

  const resultPdf = await PDFDocument.create();
  const orderIndexes = pageOrder.map((page) => page - 1);
  const copiedPages = await resultPdf.copyPages(pdf, orderIndexes);
  copiedPages.forEach((page) => resultPdf.addPage(page));

  const pdfBytes = await resultPdf.save();
  return {
    blob: toPdfBlob(pdfBytes),
    name: buildPageResultName(fileName, 'organized')
  };
}
