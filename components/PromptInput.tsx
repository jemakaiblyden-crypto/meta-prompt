
import React from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';

interface PromptInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  isRecording?: boolean;
  onToggleRecording?: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 10,
  isRecording,
  onToggleRecording 
}) => {
  const showVoiceButton = id === 'original-prompt';

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-2 font-semibold text-gray-300">
        {label}
      </label>
      <div className="relative w-full">
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`w-full p-3 bg-white/5 border border-transparent rounded-md focus:ring-2 focus:ring-indigo-400 focus:bg-white/10 text-gray-200 placeholder-gray-500 transition-all duration-300 ${showVoiceButton ? 'pr-12' : ''}`}
        />
        {showVoiceButton && (
            <button
                onClick={onToggleRecording}
                className={`absolute right-2 top-2 p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500/80 text-white' : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                {isRecording ? (
                    <StopCircleIcon className="w-6 h-6" />
                ) : (
                    <MicrophoneIcon className="w-6 h-6" />
                )}
            </button>
        )}
      </div>
    </div>
  );
};
