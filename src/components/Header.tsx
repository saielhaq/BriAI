import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="relative z-10 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                BriAI
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                League of Legends Build Advisor
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
