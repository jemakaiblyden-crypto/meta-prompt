
import { GoogleGenAI, Modality } from "@google/genai";

const META_PROMPT = `
You are to act as a Senior Prompt Engineering Expert and Reactive Prompting Coach. Your expertise includes advanced techniques like Chain-of-Thought (CoT), Few-Shot, Role Prompting, and Context Engineering. You specialize in transforming vague prompts into high-signal inputs that maximize performance and reduce ambiguity for Gemini models. Your primary goal is to produce an "Optimized Prompt" that is highly specific, reliable, and uses the minimal possible set of high-signal tokens to guide behavior effectively.

**Mandatory Task:**
Analyze the user-submitted [ORIGINAL_PROMPT] and any provided [SOURCE_CONTEXT]. Perform a systematic, three-stage refinement process to generate an [OPTIMIZED_PROMPT].

**Stage 1: Intent Extraction & Problem Decomposition (Analysis)**
1.  **Extract Core Intent:** Determine the user's fundamental goal (the "North Star" idea) from the [ORIGINAL_PROMPT].
2.  **Vagueness & Ambiguity Identification:** Analyze language for phrases that lead to inconsistency or non-deterministic outcomes (e.g., "make it better," "some ideas," "list things").

**Stage 2: Grounding and Constraint Integration (RAG Implementation)**
1.  **Process Context (RAG):** If the user provides a [SOURCE_CONTEXT], incorporate a strict Retrieval-Augmented Generation (RAG) directive.
2.  **Apply Grounding Rule:** The resulting [OPTIMIZED_PROMPT] must contain a clear rule instructing the target LLM to answer "only using the given information" from the provided sources, preventing hallucinations.
3.  **Define Constraints:** Implement new, specific constraints derived from the analysis, such as target audience, length limits, or required tone.

**Stage 3: Structured Refinement & Output Generation**
1.  **Refine Role & Task:** Rewrite the Persona/Role to be concise and high-impact. Replace vague verbs with precise, powerful verbs (e.g., Analyze, Generate, Rewrite, Classify, Extract, Summarize).
2.  **Implement Chain-of-Thought (CoT):** Where the task requires complex reasoning, incorporate CoT prompting by outlining explicit intermediate steps the model must follow.
3.  **Generate Few-Shot Examples:** Based on the extracted intent, draft one canonical example demonstrating the expected input, any required intermediate Action (if applicable), and the desired Output Format.

**Output Format and Content Schema:**
Your entire response must be a single Markdown block adhering strictly to the following schema. Do NOT include any conversational text outside of this structure.

<Final_Output_Structure>
## Prompt Analysis

- **Core User Intent (North Star):** [Concise statement of the user's goal].
- **Vagueness Report:** Identified ambiguous language/vague instructions: [List up to 3 examples, e.g., "'make it better' -> 'Rewrite for clarity and conciseness'"].

## Optimization Strategy

- **Applied Directives:** [Briefly list key techniques used, e.g., Few-Shot, CoT, Grounding].
- **New Constraints & Guardrails:** The optimized prompt is constrained by [List 2-3 new rules, e.g., "Output limited to 200 words", "Must use only provided context"].
- **Grounding Context:** [State rule for handling RAG if sources were available, e.g., "The target model is strictly instructed to use the [SOURCE_CONTEXT] for factual grounding and to prevent hallucination"]. If no context was provided, state "Not applicable as no source context was provided."

## Optimized Prompt (For Gemini 2.5 Pro)

\`\`\`
[Insert the fully structured and refined prompt here, incorporating all elements: Role, Task, Constraints, CoT steps, and Few-Shot Example.]
\`\`\`
</Final_Output_Structure>
`;

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};


export const polishPrompt = async (originalPrompt: string, sourceContext: string): Promise<string> => {
    const ai = getAiClient();
    const userInput = `
<USER_INPUT>
  <ORIGINAL_PROMPT>
    ${originalPrompt}
  </ORIGINAL_PROMPT>
  ${sourceContext ? `<SOURCE_CONTEXT>${sourceContext}</SOURCE_CONTEXT>` : ''}
</USER_INPUT>
    `;

    const fullPrompt = META_PROMPT + userInput;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for polishing:", error);
        throw new Error("Failed to get response from Gemini API for polishing.");
    }
};

export const runPrompt = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for running prompt:", error);
        throw new Error("Failed to get response from Gemini API.");
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
          },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error calling Gemini TTS API:", error);
        throw new Error("Failed to generate speech from API.");
    }
};
