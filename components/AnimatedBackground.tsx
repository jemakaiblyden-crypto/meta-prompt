
import React, { useMemo } from 'react';

const prompts = [
  "Summarize this article for a 5th grader",
  "Write a Python script to sort a list",
  "What are the main themes of Hamlet?",
  "Translate 'hello world' to French",
  "Generate three marketing slogans for a coffee shop",
  "Explain the theory of relativity in simple terms",
  "Create a recipe for vegan lasagna",
  "Write a short story in the style of Edgar Allan Poe",
  "What's the capital of Mongolia?",
  "List the pros and cons of remote work",
  "Generate a SQL query to find all users over 30",
  "Draft an email to a client about a project delay",
  "Give me ideas for a fantasy novel",
  "Describe the color blue to someone who is blind",
  "Act as a travel agent and plan a 3-day trip to Tokyo",
  "How does a blockchain work?",
  "Write a haiku about the rain",
  "Explain what a 'growth mindset' is",
  "Create a JSON object for a user profile",
  "Debug this JavaScript function",
  "What is the meaning of life?",
  "Generate a list of 10 rhyming words for 'time'",
  "Design a workout plan for a beginner",
  "Write a persuasive essay about climate change",
  "Compare and contrast React and Vue.js",
  "What if the dinosaurs never went extinct?",
  "Create a regex to validate an email address",
  "Tell me a joke about programming",
  "Generate a plot for a sci-fi movie",
  "Who was the first person to walk on the moon?",
  "Explain object-oriented programming with an analogy",
  "Write a thank-you note to a teacher",
  "What are the best practices for API design?",
  "Generate a catchy name for a new tech startup",
];

const AnimatedBackground: React.FC = () => {
    const animatedPrompts = useMemo(() => {
        return Array.from({ length: 60 }).map((_, i) => {
            const prompt = prompts[i % prompts.length];
            const style = {
                '--delay': `${Math.random() * 25}s`,
                '--duration': `${12 + Math.random() * 15}s`,
                '--x-start': `${-10 + Math.random() * 110}vw`,
                '--y-start': `${-10 + Math.random() * 110}vh`,
                '--x-end': `${-10 + Math.random() * 110}vw`,
                '--y-end': `${-10 + Math.random() * 110}vh`,
                'fontSize': `${12 + Math.random() * 6}px`,
            } as React.CSSProperties;
            return (
                <span
                    key={i}
                    className="animated-prompt"
                    style={style}
                >
                    {prompt}
                </span>
            );
        });
    }, []);

  return (
    <>
      <style>{`
        @keyframes fadeAndMove {
          0%, 100% {
            opacity: 0;
            transform: translate(var(--x-start), var(--y-start));
          }
          50% {
            opacity: 0.15;
          }
          90% {
            transform: translate(var(--x-end), var(--y-end));
          }
        }
        .animated-prompt {
          position: fixed;
          top: 0;
          left: 0;
          color: #a5b4fc; /* Indigo-200 */
          pointer-events: none;
          animation: fadeAndMove var(--duration) var(--delay) infinite linear;
          will-change: transform, opacity;
          z-index: 0;
          text-shadow: 0 0 8px rgba(165, 180, 252, 0.3);
        }
      `}</style>
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        {animatedPrompts}
      </div>
    </>
  );
};

export { AnimatedBackground };
