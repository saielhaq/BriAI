import { useReducer, useCallback } from 'react';
import type { Message, ChatState, DDragonData, Rank } from '../types';
import { sendMessage } from '../services/claudeApi';

type ChatAction =
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string | null };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        error: null
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_ERROR':
      return { ...state, error: action.error, isLoading: false };
    default:
      return state;
  }
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null
};

export function useChat(ddragonData: DDragonData | null, rank?: Rank) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendUserMessage = useCallback(async (content: string) => {
    if (!ddragonData) {
      dispatch({ type: 'SET_ERROR', error: 'Game data not loaded yet. Please wait...' });
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_MESSAGE', message: userMessage });
    dispatch({ type: 'SET_LOADING', isLoading: true });

    try {
      const conversationHistory = state.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await sendMessage(content, conversationHistory, ddragonData, rank);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      dispatch({ type: 'ADD_MESSAGE', message: assistantMessage });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      dispatch({ type: 'SET_ERROR', error: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }, [state.messages, ddragonData, rank]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage: sendUserMessage
  };
}
