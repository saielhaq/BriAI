import { GoogleGenerativeAI } from '@google/generative-ai';
import type { DDragonData, Rank } from '../types';
import { formatDataForGemini } from './dataLoader';

const SYSTEM_PROMPT = (gameData: string, rank?: Rank) => `You are BriAI, a professional League of Legends build advisor. Your personality combines the expertise of a professional coach with the friendliness of a supportive teammate. You are knowledgeable, confident, and always provide clear, concise recommendations.

${gameData}

# Your Role and Behavior

You ONLY provide advice on:
- Champion builds (item builds)
- Runes and rune combinations
- Skill order (Q/W/E/R leveling priority)
- Item purchase order

You DO NOT provide advice on:
- Ability combos or mechanical gameplay
- General strategy or macro gameplay
- Team coordination or shotcalling

# User Context
${rank ? `The user is in ${rank} rank.` : 'The user has not specified their rank (assume Platinum average).'}

# Response Format

When a user asks for a build recommendation, ALWAYS structure your response as follows:

1. **Build Recommendation First** (at the top)
   - Starting items
   - Core items (in order)
   - Situational items
   - Boots choice

2. **Runes**
   - Primary tree with keystone
   - Secondary tree
   - Stat shards

3. **Skill Order**
   - Ability max order (Q/W/E)
   - Level 1-3 priority

4. **Playstyle**
   - State whether this is an aggressive or safe build
   - Brief playstyle note (1-2 sentences)

5. **Reasoning** (at the end)
   - Explain WHY you chose this build
   - Explain matchup considerations
   - Explain when to adapt items

# Interaction Guidelines

- If the user doesn't specify champion, role, or matchup, ask clarifying questions
- Be conversational but stay focused on builds/runes/items
- Use bold for emphasis, lists for clarity, and tables when comparing options
- Keep responses concise but comprehensive
- Always consider the enemy team composition if provided
- Adjust recommendations based on user's rank when provided

# Tone
- Professional yet approachable
- Confident in recommendations
- Encouraging and supportive
- Clear and direct

Remember: Focus exclusively on builds, runes, and items. Keep recommendations practical and actionable.`;

export async function sendMessage(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  ddragonData: DDragonData,
  rank?: Rank
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  // Log diagnostic info (without exposing the full key)
  if (import.meta.env.DEV) {
    console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT FOUND');
    console.log('API Key length:', apiKey?.length || 0);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Prepare data once (doesn't depend on model name)
  const gameDataContext = formatDataForGemini(ddragonData);
  const systemInstruction = SYSTEM_PROMPT(gameDataContext, rank);

  // Try multiple model names in order of preference
  const modelNames = [
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.5-flash-latest'
  ];

  let lastError: any = null;

  for (const modelName of modelNames) {
    try {

      // Try the current model name
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction
      });

      // Convert conversation history to Gemini format
      // Gemini expects alternating user/model messages with parts array
      const chatHistory = conversationHistory.length > 0
        ? conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }))
        : [];

      // Start a chat session with history (or without if no history)
      const chat = chatHistory.length > 0
        ? model.startChat({ history: chatHistory })
        : model.startChat();

      // Send the new message
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      // Log successful model in dev mode
      if (import.meta.env.DEV) {
        if (modelName === 'gemini-2.5-flash') {
          console.log(`Using model: ${modelName}`);
        } else {
          console.log(`Using model: ${modelName} (fallback from gemini-2.5-flash)`);
        }
      }

      return text;
    } catch (error: any) {
      lastError = error;

      // If it's a 404, try the next model
      if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        if (import.meta.env.DEV) {
          console.log(`Model ${modelName} not available, trying next model...`);
        }
        continue;
      }

      // For other errors, break and handle them
      break;
    }
  }

  // If we get here, all models failed or we have a non-404 error
  // Handle Gemini API errors
  if (lastError?.message?.includes('API key')) {
    throw new Error('Invalid API key. Please check your VITE_GEMINI_API_KEY configuration.');
  }
  if (lastError?.message?.includes('quota') || lastError?.message?.includes('rate')) {
    throw new Error('Too many requests. Please wait a moment before trying again.');
  }
  if (lastError?.message?.includes('401') || lastError?.message?.includes('403')) {
    throw new Error('Invalid API key or insufficient permissions. Please check your Gemini API key.');
  }
  if (lastError?.message?.includes('404') || lastError?.message?.includes('Not Found')) {
    throw new Error('None of the requested Gemini models are available. Please check your API key permissions and ensure the Generative Language API is enabled in your Google Cloud project.');
  }
  throw new Error(`API Error: ${lastError?.message || 'An unexpected error occurred'}`);
}

