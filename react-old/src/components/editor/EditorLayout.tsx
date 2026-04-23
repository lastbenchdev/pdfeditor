import React from 'react';

interface EditorLayoutProps {
  toolbar: React.ReactNode;
  thumbnails: React.ReactNode;
  preview: React.ReactNode;
  operationPanel: React.ReactNode;
  footerActions: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  toolbar,
  thumbnails,
  preview,
  operationPanel,
  footerActions
}) => {
  return (
    <div className="editor-root">
      {/* Pinned toolbar */}
      <div className="editor-toolbar">
        {toolbar}
      </div>

      {/* 3-column body: fills all remaining vertical space */}
      <div className="editor-body">
        <aside className="editor-sidebar-left">
          {thumbnails}
        </aside>
        <section className="editor-preview bg-slate-100 dark:bg-slate-950">
          {preview}
        </section>
        <aside className="editor-sidebar-right bg-white dark:bg-slate-900">
          {operationPanel}
        </aside>
      </div>

      {/* Pinned footer */}
      <div className="editor-footer">
        {footerActions}
      </div>
    </div>
  );
};
