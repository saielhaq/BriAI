export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        BriAI is thinking...
      </span>
    </div>
  );
}
