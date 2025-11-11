
import React from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { RunIcon } from './icons/RunIcon';


interface CodeBlockProps {
  code: string;
  language: string;
  onRun?: (code: string) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, onRun }) => {
  const [isCopied, handleCopy] = useCopyToClipboard(2000);

  return (
    <div className="bg-gray-900 rounded-md my-4 relative group">
      <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {onRun && (
          <button
            onClick={() => onRun(code)}
            className="p-1.5 bg-gray-700/50 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Run prompt"
            title="Run prompt"
          >
            <RunIcon className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => handleCopy(code)}
          className="p-1.5 bg-gray-700/50 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Copy code to clipboard"
          title="Copy code"
        >
          {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};
