/**
 * Represents a single page within a PDF document.
 * Used for rendering thumbnails and tracking page-level operations like rotation or removal.
 */
export interface PdfPage {
  /** The 0-based original index of the page in the raw PDF bytes. */
  pageIndex: number;
  /** The 1-based index used for displaying the page number in the UI. */
  displayNumber: number;
  /** A base64 data URL representing the rendered thumbnail of the page. */
  thumbnail: string;
  /** The physical width of the page. */
  width: number;
  /** The physical height of the page. */
  height: number;
  /** The applied rotation in degrees. Expected values: 0, 90, 180, 270. */
  rotation: number;
  /** Whether the page is marked for removal from the document. */
  deleted: boolean;
  /** Whether the page is selected for an operation (e.g., extraction). */
  selected: boolean;
}

/**
 * Represents metadata about a loaded PDF document.
 */
export interface PdfDocument {
  /** A unique identifier for the document, potentially used for storage (e.g., IndexedDB). */
  id: string;
  /** The original file name of the loaded PDF. */
  fileName: string;
  /** The total number of pages in the document. */
  totalPages: number;
  /** The size of the file in bytes. */
  fileSize: number;
}

/**
 * Defines the presentation mode for the PDF workspace.
 * - 'gallery': Displays pages as a grid of thumbnails.
 * - 'scrolling': Displays pages in a vertical, continuous scroll view.
 */
export type ViewMode = 'gallery' | 'scrolling';

/**
 * Represents the current state of the workspace containing a PDF document.
 */
export interface WorkspaceState {
  /** The active PDF document being edited, or null if no document is loaded. */
  activeDocument: PdfDocument | null;
  /** The array of pages associated with the active document. */
  pages: PdfPage[];
  /** The active view mode (e.g., gallery or scrolling view). */
  viewMode: ViewMode;
  /** The identifier for the currently active tool (e.g., 'remove', 'organize', 'split'). */
  activeTool: string;
  /** Indicates whether a document is currently being loaded or processed. */
  isLoading: boolean;
}
