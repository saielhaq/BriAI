import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingIndicator } from './LoadingIndicator';
import type { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatInterface({ messages, isLoading, onSendMessage }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Welcome to BriAI
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your personal League of Legends build advisor. Ask me about champion builds, runes, items, and matchup-specific recommendations!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Example 1</p>
                    <p className="text-gray-600 dark:text-gray-400">"Best build for Zed mid vs Ahri?"</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Example 2</p>
                    <p className="text-gray-600 dark:text-gray-400">"Runes for tank Malphite top?"</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Example 3</p>
                    <p className="text-gray-600 dark:text-gray-400">"ADC Jinx build against heavy dive?"</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Example 4</p>
                    <p className="text-gray-600 dark:text-gray-400">"Support Thresh items vs poke?"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && <LoadingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={onSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
