import { Routes } from "@angular/router";
import { LayoutComponent } from "./components/layout/layout.component";

export const routes: Routes = [
  // ========== Layout Pages (Header + Footer via LayoutComponent) ==========
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./components/homepage/homepage.component").then(
            (m) => m.HomepageComponent,
          ),
      },
      {
        path: "tools",
        loadComponent: () =>
          import("./components/explore-all-tools/explore-all-tools.component").then(
            (m) => m.ExploreAllToolsComponent,
          ),
      },
    ],
  },

  // ========== Tool Pages (No Header/Footer — Full-Screen) ==========
  {
    path: "tools/merge-pdf",
    loadComponent: () =>
      import("./components/tool-page/tools/merge-pdf/merge-pdf.component").then(
        (m) => m.MergePdfComponent,
      ),
  },
  {
    path: "tools/split-pdf",
    loadComponent: () =>
      import("./components/tool-page/tools/split-pdf/split-pdf.component").then(
        (m) => m.SplitPdfComponent,
      ),
  },
  {
    path: "tools/html-to-pdf",
    loadComponent: () =>
      import("./components/tool-page/tools/html-to-pdf/html-to-pdf.component").then(
        (m) => m.HtmlToPdfComponent,
      ),
  },
  {
    path: "tools/image-to-pdf",
    loadComponent: () =>
      import("./components/tool-page/tools/image-to-pdf/image-to-pdf.component").then(
        (m) => m.ImageToPdfComponent,
      ),
  },
  {
    path: "tools/pdf-to-image",
    loadComponent: () =>
      import("./components/tool-page/tools/pdf-to-image/pdf-to-image.component").then(
        (m) => m.PdfToImageComponent,
      ),
  },

  // ─── Unified PDF Editor Workspace ─────────────────────────────────────────────
  {
    path: "tools/editor/:tool",
    loadComponent: () =>
      import("./components/pdf-workspace/pdf-workspace.component").then(
        (m) => m.PdfWorkspaceComponent,
      ),
  },

  // ─── Legacy Route Redirects (for existing links) ───────────────────────────
  { path: "tools/remove-pages", redirectTo: "tools/editor/remove" },
  { path: "tools/extract-pages", redirectTo: "tools/editor/extract" },
  { path: "tools/rotate-pdf", redirectTo: "tools/editor/rotate" },
  { path: "tools/organize-pdf", redirectTo: "tools/editor/organize" },

  // ========== Wildcard Redirect ==========
  {
    path: "**",
    redirectTo: "",
  },
];
