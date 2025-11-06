import ReactMarkdown from 'react-markdown';
import { Sparkles, User } from 'lucide-react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser
          ? 'bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600'
          : 'bg-gradient-to-br from-blue-500 to-cyan-500'
      } shadow-lg`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Sparkles className="w-5 h-5 text-white" />
        )}
      </div>

      <div className={`flex-1 max-w-3xl ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`rounded-2xl px-6 py-4 shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 backdrop-blur-sm'
        }`}>
          <div className={`prose prose-sm dark:prose-invert max-w-none ${
            isUser ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-gray-100'
          }`}>
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-bold mb-2 mt-4 text-gray-900 dark:text-gray-100">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200">{children}</h3>,
                p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="mb-3 ml-4 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="mb-3 ml-4 space-y-1">{children}</ol>,
                li: ({children}) => <li className="leading-relaxed">{children}</li>,
                strong: ({children}) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
                em: ({children}) => <em className="italic">{children}</em>,
                code: ({children}) => <code className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                table: ({children}) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({children}) => <th className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">{children}</th>,
                td: ({children}) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{children}</td>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
