import Anthropic from '@anthropic-ai/sdk';
import type { DDragonData, Rank } from '../types';
import { formatDataForClaude } from './dataLoader';

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
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('Anthropic API key is not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file.');
  }

  // Validate API key format (should start with 'sk-ant-')
  if (!apiKey.startsWith('sk-ant-')) {
    console.warn('API key format may be incorrect. Anthropic API keys typically start with "sk-ant-"');
  }

  // Log diagnostic info (without exposing the full key)
  if (import.meta.env.DEV) {
    console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT FOUND');
    console.log('API Key length:', apiKey?.length || 0);
  }

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const gameDataContext = formatDataForClaude(ddragonData);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT(gameDataContext, rank),
      messages: [
        ...conversationHistory,
        { role: 'user', content: message }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response format from Claude API');
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        throw new Error('Too many requests. Please wait a moment before trying again.');
      }
      if (error.status === 401) {
        // Enhanced 401 error message with diagnostic info
        const diagnosticInfo = import.meta.env.DEV
          ? `\n\nDiagnostic info:\n- API key present: ${apiKey ? 'Yes' : 'No'}\n- API key format: ${apiKey?.startsWith('sk-ant-') ? 'Correct' : 'Incorrect (should start with sk-ant-)'}\n- Make sure you restarted the dev server after adding/updating .env file`
          : '';
        throw new Error(`Invalid API key. Please check your configuration.${diagnosticInfo}`);
      }
      throw new Error(`API Error: ${error.message}`);
    }
    throw error;
  }
}
