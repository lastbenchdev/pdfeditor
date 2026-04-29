export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  keywords: string[];
  tags: string[];
  route: string;
  status: 'ready' | 'beta' | 'experimental' | 'coming_soon';
  isLocal: boolean;
}

const COMMON_TAGS = ["client-side", "no-upload", "privacy-first", "offline-ready"];

export const toolsData: Tool[] = [
  // 📄 Basic PDF Tools
  {
    id: "merge-pdf",
    name: "Merge PDF",
    category: "basic",
    description: "Combine multiple PDFs into one unified document instantly.",
    icon: "layers",
    keywords: ["merge", "combine", "join pdf", "pdf merger", "stitch pdf"],
    tags: ["pdf", "merge", "combine", ...COMMON_TAGS],
    route: "/tools/merge-pdf",
    status: 'ready',
    isLocal: true
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    category: "basic",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    icon: "split",
    keywords: ["split", "cut pdf", "extract pages", "pdf splitter", "divide pdf"],
    tags: ["pdf", "split", "cut", ...COMMON_TAGS],
    route: "/tools/split-pdf",
    status: 'ready',
    isLocal: true
  },
  {
    id: "remove-pages",
    name: "Remove Pages",
    category: "basic",
    description: "Delete unwanted pages from your document in seconds.",
    icon: "trash-2",
    keywords: ["delete", "remove", "trash pages", "clean pdf"],
    tags: ["pdf", "remove", "delete", ...COMMON_TAGS],
    route: "/tools/remove-pages",
    status: 'ready',
    isLocal: true
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    category: "basic",
    description: "Extract specific pages from your PDF file into a new document.",
    icon: "pickaxe",
    keywords: ["extract", "pick pages", "select pages", "separate"],
    tags: ["pdf", "extract", "pick", ...COMMON_TAGS],
    route: "/tools/extract-pages",
    status: 'ready',
    isLocal: true
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    category: "basic",
    description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once.",
    icon: "rotate-cw",
    keywords: ["rotate", "turn", "upside down", "landscape", "portrait"],
    tags: ["pdf", "rotate", "orient", ...COMMON_TAGS],
    route: "/tools/rotate-pdf",
    status: 'ready',
    isLocal: true
  },
  {
    id: "organize-pdf",
    name: "Organize PDF",
    category: "basic",
    description: "Sort, add and delete PDF pages. Drag and drop the page thumbnails at your convenience.",
    icon: "layout-grid",
    keywords: ["organize", "reorder", "sort", "manage pages"],
    tags: ["pdf", "organize", "sort", ...COMMON_TAGS],
    route: "/tools/organize-pdf",
    status: 'ready',
    isLocal: true
  },

  // ⚡ Optimize PDF
  {
    id: "compress-pdf",
    name: "Compress PDF",
    category: "optimize",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: "minimize-2",
    keywords: ["compress", "smaller", "shrink", "optimize size"],
    tags: ["pdf", "compress", "shrink", ...COMMON_TAGS],
    route: "/tools/compress-pdf",
    status: 'coming_soon',
    isLocal: true
  },
  {
    id: "flatten-pdf",
    name: "Flatten PDF",
    category: "optimize",
    description: "Make layers uneditable and prevent external manipulation of shapes and text.",
    icon: "layers",
    keywords: ["flatten", "layers", "uneditable", "merge layers"],
    tags: ["pdf", "flatten", "security", ...COMMON_TAGS],
    route: "/tools/flatten-pdf",
    status: 'coming_soon',
    isLocal: true
  },

  // 🔄 Convert to PDF
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    category: "convert-to",
    description: "Convert JPG, PNG, and other images to PDF in seconds. Easily adjust orientation and margins.",
    icon: "image",
    keywords: ["jpg", "jpeg", "png", "image", "photo", "convert"],
    tags: ["pdf", "image", "convert", ...COMMON_TAGS],
    route: "/tools/image-to-pdf",
    status: 'ready',
    isLocal: true
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF",
    category: "convert-to",
    description: "Paste HTML content or a URL and convert it to a downloadable PDF instantly.",
    icon: "code",
    keywords: ["html", "webpage", "url", "site", "convert"],
    tags: ["pdf", "web", "html", ...COMMON_TAGS],
    route: "/tools/html-to-pdf",
    status: 'beta',
    isLocal: true
  },

  // 📤 Convert from PDF
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    category: "convert-from",
    description: "Extract pages from your PDF as high-quality JPG or PNG images.",
    icon: "image",
    keywords: ["pdf", "image", "jpg", "png", "convert"],
    tags: ["pdf", "image", "convert", ...COMMON_TAGS],
    route: "/tools/pdf-to-image",
    status: 'ready',
    isLocal: true
  },

  // ✏️ Edit PDF
  {
    id: "add-watermark",
    name: "Add Watermark",
    category: "edit",
    description: "Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.",
    icon: "file-badge",
    keywords: ["watermark", "stamp", "copyright", "overlay"],
    tags: ["pdf", "edit", "watermark", ...COMMON_TAGS],
    route: "/tools/add-watermark",
    status: 'coming_soon',
    isLocal: true
  },
  {
    id: "add-page-numbers",
    name: "Add Page Numbers",
    category: "edit",
    description: "Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.",
    icon: "type",
    keywords: ["numbers", "pagination", "pages", "order"],
    tags: ["pdf", "edit", "numbers", ...COMMON_TAGS],
    route: "/tools/add-page-numbers",
    status: 'coming_soon',
    isLocal: true
  },
  {
    id: "crop-pdf",
    name: "Crop PDF",
    category: "edit",
    description: "Crop PDF margins, change PDF page size, or cut whitespace efficiently.",
    icon: "scissors",
    keywords: ["crop", "trim", "cut", "resize", "margins"],
    tags: ["pdf", "edit", "crop", ...COMMON_TAGS],
    route: "/tools/crop-pdf",
    status: 'coming_soon',
    isLocal: true
  },

  // 🔐 PDF Security
  {
    id: "protect-pdf",
    name: "Protect PDF",
    category: "security",
    description: "Encrypt your PDF with a password to keep sensitive data confidential.",
    icon: "lock",
    keywords: ["protect", "password", "encrypt", "lock", "secure"],
    tags: ["pdf", "secure", "password", "privacy", ...COMMON_TAGS],
    route: "/tools/protect-pdf",
    status: 'coming_soon',
    isLocal: true
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    category: "security",
    description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    icon: "unlock",
    keywords: ["unlock", "remove password", "decrypt", "open secure"],
    tags: ["pdf", "secure", "unlock", ...COMMON_TAGS],
    route: "/tools/unlock-pdf",
    status: 'coming_soon',
    isLocal: true
  },
  {
    id: "redact-pdf",
    name: "Redact PDF",
    category: "security",
    description: "Permanently remove visible text and graphics from a document to protect sensitive info.",
    icon: "shield",
    keywords: ["redact", "black out", "hide info", "censor"],
    tags: ["pdf", "secure", "redact", ...COMMON_TAGS],
    route: "/tools/redact-pdf",
    status: 'coming_soon',
    isLocal: true
  },
  {
    id: "sign-pdf",
    name: "Sign PDF",
    category: "security",
    description: "Create your signature, sign your PDF and request people to sign.",
    icon: "pen-tool",
    keywords: ["sign", "signature", "e-sign", "contract"],
    tags: ["pdf", "secure", "sign", ...COMMON_TAGS],
    route: "/tools/sign-pdf",
    status: 'coming_soon',
    isLocal: true
  }
];

// Top 6 most popular tools for the home page
export const topSixTools: Tool[] = [
  toolsData.find(t => t.id === 'merge-pdf')!,
  toolsData.find(t => t.id === 'split-pdf')!,
  toolsData.find(t => t.id === 'compress-pdf')!,
  toolsData.find(t => t.id === 'image-to-pdf')!,
  toolsData.find(t => t.id === 'protect-pdf')!,
  toolsData.find(t => t.id === 'add-watermark')!,
];

/**
 * Get tool name from route path for breadcrumb display
 * Example: 'merge-pdf' => 'Merge PDF'
 */
export function getToolNameByRoute(route: string): string | null {
  const tool = toolsData.find(t => t.route === `/tools/${route}`);
  return tool ? tool.name : null;
}
