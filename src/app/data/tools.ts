export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  keywords: string[];
  tags: string[];
  route: string;
  status: 'ready' | 'beta' | 'experimental';
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
    icon: "layers",
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
    status: 'ready',
    isLocal: true
  },
  {
    id: "repair-pdf",
    name: "Repair PDF",
    category: "optimize",
    description: "Repair a damaged PDF and recover data from corrupt documents.",
    icon: "wrench",
    keywords: ["repair", "fix", "corrupt", "damaged pdf", "solve"],
    tags: ["pdf", "repair", "fix", ...COMMON_TAGS],
    route: "/tools/repair-pdf",
    status: 'experimental',
    isLocal: false
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
    status: 'ready',
    isLocal: true
  },

  // 🔄 Convert to PDF
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    category: "convert-to",
    description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    icon: "image",
    keywords: ["jpg", "jpeg", "image", "photo", "convert"],
    tags: ["pdf", "image", "jpg", ...COMMON_TAGS],
    route: "/tools/jpg-to-pdf",
    status: 'ready',
    isLocal: true
  },
  {
    id: "word-to-pdf",
    name: "WORD to PDF",
    category: "convert-to",
    description: "Make DOC and DOCX files easy to read by converting them to PDF.",
    icon: "file-text",
    keywords: ["word", "doc", "docx", "office", "convert"],
    tags: ["pdf", "word", "office", ...COMMON_TAGS],
    route: "/tools/word-to-pdf",
    status: 'experimental',
    isLocal: false
  },
  {
    id: "powerpoint-to-pdf",
    name: "POWERPOINT to PDF",
    category: "convert-to",
    description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
    icon: "presentation",
    keywords: ["powerpoint", "ppt", "pptx", "slides", "presentation"],
    tags: ["pdf", "slides", "ppt", ...COMMON_TAGS],
    route: "/tools/powerpoint-to-pdf",
    status: 'experimental',
    isLocal: false
  },
  {
    id: "excel-to-pdf",
    name: "EXCEL to PDF",
    category: "convert-to",
    description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
    icon: "file-spreadsheet",
    keywords: ["excel", "xls", "xlsx", "sheet", "spreadsheet"],
    tags: ["pdf", "excel", "sheets", ...COMMON_TAGS],
    route: "/tools/excel-to-pdf",
    status: 'experimental',
    isLocal: false
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF",
    category: "convert-to",
    description: "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want to convert.",
    icon: "code",
    keywords: ["html", "webpage", "url", "site", "convert"],
    tags: ["pdf", "web", "html", ...COMMON_TAGS],
    route: "/tools/html-to-pdf",
    status: 'experimental',
    isLocal: false
  },

  // 📤 Convert from PDF
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    category: "convert-from",
    description: "Extract all images contained in a PDF or convert each page to a JPG file.",
    icon: "image",
    keywords: ["jpg", "jpeg", "image", "photo", "extract"],
    tags: ["pdf", "image", "jpg", ...COMMON_TAGS],
    route: "/tools/pdf-to-jpg",
    status: 'ready',
    isLocal: true
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    category: "convert-from",
    description: "Extract all images contained inside your PDF doc and save them as PNGs.",
    icon: "image",
    keywords: ["png", "image", "transparent", "extract"],
    tags: ["pdf", "image", "png", ...COMMON_TAGS],
    route: "/tools/pdf-to-png",
    status: 'ready',
    isLocal: true
  },
  {
    id: "pdf-to-word",
    name: "PDF to WORD",
    category: "convert-from",
    description: "Convert your PDF to WORD documents with high accuracy.",
    icon: "file-text",
    keywords: ["word", "doc", "docx", "editable", "convert"],
    tags: ["pdf", "word", "editable", ...COMMON_TAGS],
    route: "/tools/pdf-to-word",
    status: 'experimental',
    isLocal: false
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to POWERPOINT",
    category: "convert-from",
    description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
    icon: "presentation",
    keywords: ["powerpoint", "ppt", "pptx", "slides", "editable"],
    tags: ["pdf", "slides", "ppt", ...COMMON_TAGS],
    route: "/tools/pdf-to-powerpoint",
    status: 'experimental',
    isLocal: false
  },
  {
    id: "pdf-to-excel",
    name: "PDF to EXCEL",
    category: "convert-from",
    description: "Pull data straight from PDFs into EXCEL spreadsheets.",
    icon: "file-spreadsheet",
    keywords: ["excel", "xls", "xlsx", "data", "sheet"],
    tags: ["pdf", "excel", "data", ...COMMON_TAGS],
    route: "/tools/pdf-to-excel",
    status: 'experimental',
    isLocal: false
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
    status: 'ready',
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
    status: 'ready',
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
    status: 'beta',
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
    status: 'ready',
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
    status: 'ready',
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
    status: 'beta',
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
    status: 'ready',
    isLocal: true
  }
];

export const topSixTools: Tool[] = toolsData.slice(0, 6);
