
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SpeakerIcon } from './icons/SpeakerIcon';

interface RunOutputDisplayProps {
  result: string;
  isLoading: boolean;
  error: string | null;
  isTtsLoading: boolean;
  onGenerateSpeech: (text: string) => void;
}

export const RunOutputDisplay: React.FC<RunOutputDisplayProps> = ({ result, isLoading, error, isTtsLoading, onGenerateSpeech }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
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
      return null;
    }

    return (
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
        <h2 className="text-xl font-semibold text-indigo-400">Run Result</h2>
        {result && !error && (
            <button 
                onClick={() => onGenerateSpeech(result)}
                disabled={isTtsLoading}
                className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-gray-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Read result aloud"
                title="Read aloud"
            >
                <SpeakerIcon className={`w-6 h-6 ${isTtsLoading ? 'animate-pulse text-indigo-400' : ''}`} />
            </button>
        )}
      </div>
      <div className="overflow-y-auto flex-grow pr-2">
        {renderContent()}
      </div>
    </div>
  );
};
