export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categoriesData: Category[] = [
  {
    id: "basic",
    name: "Basic PDF Tools",
    description: "Everyday PDF operations like merging, splitting and organizing.",
    icon: "file-text"
  },
  {
    id: "optimize",
    name: "Optimize PDF",
    description: "Improve performance, repair, or flatten your PDF files.",
    icon: "minimize"
  },
  {
    id: "convert-to",
    name: "Convert to PDF",
    description: "Convert images, documents, and web pages to high-quality PDFs.",
    icon: "file-up"
  },
  {
    id: "convert-from",
    name: "Convert from PDF",
    description: "Extract data and images from PDFs into other formats.",
    icon: "download"
  },
  {
    id: "edit",
    name: "Edit PDF",
    description: "Add watermarks, page numbers, or crop your documents.",
    icon: "pen-tool"
  },
  {
    id: "security",
    name: "PDF Security",
    description: "Protect, unlock, and sign your sensitive PDF documents.",
    icon: "lock"
  }
];