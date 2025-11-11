
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">
          Prompt Polisher
        </h1>
        <p className="text-indigo-300 mt-1">
          Your AI-Powered Meta-Prompt Optimizer
        </p>
      </div>
    </header>
  );
};
