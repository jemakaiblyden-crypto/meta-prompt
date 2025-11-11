
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface OutputDisplayProps {
  result: string;
  isLoading: boolean;
  error: string | null;
  onRunPrompt: (prompt: string) => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ result, isLoading, error, onRunPrompt }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
          <div className="h-8 bg-white/10 rounded w-1/4 mt-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-4/6"></div>
          </div>
          <div className="h-8 bg-white/10 rounded w-2/5 mt-8"></div>
          <div className="h-40 bg-white/10 rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="text-center text-gray-500 h-full flex items-center justify-center">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-400">Prompt Analysis</h2>
            <p className="mt-2">Your polished prompt and analysis will appear here.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="prose prose-invert prose-h2:text-indigo-400 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              
              return !inline ? (
                <CodeBlock 
                  code={codeString} 
                  language={match ? match[1] : 'text'} 
                  onRun={onRunPrompt}
                />
              ) : (
                <code className="bg-gray-700/50 text-indigo-300 rounded-sm px-1.5 py-1 text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {result}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto pr-2">
      {renderContent()}
    </div>
  );
};
