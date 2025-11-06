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

  try {
    const gameDataContext = formatDataForGemini(ddragonData);
    const systemInstruction = SYSTEM_PROMPT(gameDataContext, rank);

    // Use gemini-1.5-pro or gemini-1.5-flash model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
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

    return text;
  } catch (error: any) {
    // Handle Gemini API errors
    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your VITE_GEMINI_API_KEY configuration.');
    }
    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      throw new Error('Too many requests. Please wait a moment before trying again.');
    }
    if (error.message?.includes('401') || error.message?.includes('403')) {
      throw new Error('Invalid API key or insufficient permissions. Please check your Gemini API key.');
    }
    throw new Error(`API Error: ${error.message || 'An unexpected error occurred'}`);
  }
}

