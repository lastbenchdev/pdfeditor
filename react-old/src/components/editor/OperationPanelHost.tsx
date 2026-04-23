import React from 'react';
import type { SupportedEditorToolId } from '../../lib/pdf/operation-registry';
import { toolsData } from '../../data/tools';
import { ExtractPanel } from './panels/ExtractPanel';
import { MergePanel } from './panels/MergePanel';
import { OrganizePanel } from './panels/OrganizePanel';
import { RemovePanel } from './panels/RemovePanel';
import { RotatePanel } from './panels/RotatePanel';
import { SplitPanel } from './panels/SplitPanel';

export interface OperationPanelHostProps {
  toolId: SupportedEditorToolId;
  customFileName: string;
  splitMode: 'pages' | 'ranges';
  splitRanges: string;
  rotateMode: 'all' | 'selected';
  angle: number;
  pageCount: number;
  pagesInput: string;
  selectedPages: number[];
  selectionError: string | null;
  pageOrder: number[];
  onFileNameChange: (value: string) => void;
  onSplitModeChange: (mode: 'pages' | 'ranges') => void;
  onSplitRangesChange: (value: string) => void;
  onRotateModeChange: (mode: 'all' | 'selected') => void;
  onAngleChange: (angle: number) => void;
  onPagesInputChange: (value: string) => void;
  onTogglePage: (page: number) => void;
  onPageOrderChange: (order: number[]) => void;
  fileCount: number;
}

export const OperationPanelHost: React.FC<OperationPanelHostProps> = (props) => {
  const tool = toolsData.find((item) => item.id === props.toolId);

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{tool?.name ?? 'PDF Editor'}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tool?.description}</p>
      </div>

      {props.toolId === 'merge-pdf' && (
        <MergePanel
          customFileName={props.customFileName}
          onFileNameChange={props.onFileNameChange}
          fileCount={props.fileCount}
        />
      )}

      {props.toolId === 'split-pdf' && (
        <SplitPanel
          customFileName={props.customFileName}
          splitMode={props.splitMode}
          splitRanges={props.splitRanges}
          onFileNameChange={props.onFileNameChange}
          onSplitModeChange={props.onSplitModeChange}
          onSplitRangesChange={props.onSplitRangesChange}
        />
      )}

      {props.toolId === 'rotate-pdf' && (
        <RotatePanel
          customFileName={props.customFileName}
          rotateMode={props.rotateMode}
          angle={props.angle}
          pageCount={props.pageCount}
          selectedPages={props.selectedPages}
          pagesInput={props.pagesInput}
          selectionError={props.selectionError}
          onFileNameChange={props.onFileNameChange}
          onRotateModeChange={props.onRotateModeChange}
          onAngleChange={props.onAngleChange}
          onPagesInputChange={props.onPagesInputChange}
          onTogglePage={props.onTogglePage}
        />
      )}

      {props.toolId === 'extract-pages' && (
        <ExtractPanel
          customFileName={props.customFileName}
          pageCount={props.pageCount}
          selectedPages={props.selectedPages}
          pagesInput={props.pagesInput}
          selectionError={props.selectionError}
          onFileNameChange={props.onFileNameChange}
          onPagesInputChange={props.onPagesInputChange}
          onTogglePage={props.onTogglePage}
        />
      )}

      {props.toolId === 'remove-pages' && (
        <RemovePanel
          customFileName={props.customFileName}
          pageCount={props.pageCount}
          selectedPages={props.selectedPages}
          pagesInput={props.pagesInput}
          selectionError={props.selectionError}
          onFileNameChange={props.onFileNameChange}
          onPagesInputChange={props.onPagesInputChange}
          onTogglePage={props.onTogglePage}
        />
      )}

      {props.toolId === 'organize-pdf' && (
        <OrganizePanel
          customFileName={props.customFileName}
          pageOrder={props.pageOrder}
          onFileNameChange={props.onFileNameChange}
          onPageOrderChange={props.onPageOrderChange}
        />
      )}
    </div>
  );
};
