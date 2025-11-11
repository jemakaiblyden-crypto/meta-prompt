
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { OutputDisplay } from './components/OutputDisplay';
import { RunOutputDisplay } from './components/RunOutputDisplay';
import { polishPrompt, runPrompt, generateSpeech } from './services/geminiService';
import { useVoiceInput } from './hooks/useVoiceInput';
import { decode, decodeAudioData } from './utils/audio';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { AnimatedBackground } from './components/AnimatedBackground';

const App: React.FC = () => {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [sourceContext, setSourceContext] = useState('');
  const [optimizedResult, setOptimizedResult] = useState('');
  const [isPolishLoading, setIsPolishLoading] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);

  const [runResult, setRunResult] = useState('');
  const [isRunLoading, setIsRunLoading] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<AudioBufferSourceNode | null>(null);

  const { transcript, isRecording, startRecording, stopRecording } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      setOriginalPrompt(transcript);
    }
  }, [transcript]);

  const handlePolishPrompt = useCallback(async () => {
    if (!originalPrompt.trim()) {
      setPolishError('Please enter a prompt to polish.');
      return;
    }
    setIsPolishLoading(true);
    setPolishError(null);
    setOptimizedResult('');
    setRunResult('');
    setRunError(null);

    try {
      const result = await polishPrompt(originalPrompt, sourceContext);
      setOptimizedResult(result);
    } catch (e: any) {
      setPolishError(e.message || 'An unknown error occurred.');
    } finally {
      setIsPolishLoading(false);
    }
  }, [originalPrompt, sourceContext]);

  const handleRunPrompt = useCallback(async (promptToRun: string) => {
    setIsRunLoading(true);
    setRunError(null);
    setRunResult('');
    try {
      const result = await runPrompt(promptToRun);
      setRunResult(result);
    } catch (e: any) {
      setRunError(e.message || 'An unknown error occurred.');
    } finally {
      setIsRunLoading(false);
    }
  }, []);
  
  const handleGenerateSpeech = useCallback(async (text: string) => {
    if (isTtsLoading) return;
    setIsTtsLoading(true);
    try {
      const audioData = await generateSpeech(text);
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(audioData), outputAudioContext, 24000, 1);
      const source = outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputAudioContext.destination);
      source.start();
      setAudioPlayer(source);
    // FIX: Added curly braces to the catch block to fix syntax error.
    } catch (e: any) {
      setRunError("Failed to generate audio. " + (e.message || ''));
    } finally {
      setIsTtsLoading(false);
    }
  }, [isTtsLoading]);

  return (
    <div className="min-h-screen bg-transparent text-gray-200 font-sans flex flex-col relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col flex-grow">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col xl:flex-row gap-8">
          {/* Left Column */}
          <div className="xl:w-1/3 flex flex-col gap-6 bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <PromptInput
              id="original-prompt"
              label="Original Prompt"
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              placeholder="e.g., 'Summarize this for me and give me some key points.'"
              rows={8}
              isRecording={isRecording}
              onToggleRecording={isRecording ? stopRecording : startRecording}
            />
            <PromptInput
              id="source-context"
              label="Source Context (Optional)"
              value={sourceContext}
              onChange={(e) => setSourceContext(e.target.value)}
              placeholder="Paste a long article, meeting transcript, or any other relevant text here to ground the prompt..."
              rows={12}
            />
            <div className="flex justify-end mt-auto pt-4">
              <button
                onClick={handlePolishPrompt}
                disabled={isPolishLoading || !originalPrompt}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70 transition-all transform hover:scale-105"
                aria-live="polite"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isPolishLoading ? 'Polishing...' : 'Polish Prompt'}
              </button>
            </div>
          </div>
          {/* Right Column */}
          <div className="xl:w-2/3 flex flex-col gap-8 bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-6 overflow-y-auto">
            <div className="flex-1 min-h-0">
              <OutputDisplay
                result={optimizedResult}
                isLoading={isPolishLoading}
                error={polishError}
                onRunPrompt={handleRunPrompt}
              />
            </div>
            {(isRunLoading || runResult || runError) && (
              <div className="flex-1 min-h-0 border-t border-white/10 pt-8">
                <RunOutputDisplay
                  result={runResult}
                  isLoading={isRunLoading}
                  error={runError}
                  isTtsLoading={isTtsLoading}
                  onGenerateSpeech={handleGenerateSpeech}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
