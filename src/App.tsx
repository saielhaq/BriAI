import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { ThemeToggle } from './components/ThemeToggle';
import { RankSelector } from './components/RankSelector';
import { useTheme } from './hooks/useTheme';
import { useChat } from './hooks/useChat';
import { loadDDragonData } from './services/dataLoader';
import type { DDragonData, Rank } from './types';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [ddragonData, setDdragonData] = useState<DDragonData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedRank, setSelectedRank] = useState<Rank>();
  const { messages, isLoading, error, sendMessage } = useChat(ddragonData, selectedRank);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadDDragonData();
        setDdragonData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load game data';
        toast.error(errorMessage);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading BriAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f3f4f6' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          },
        }}
      />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <RankSelector selectedRank={selectedRank} onRankChange={setSelectedRank} />

      <div className="flex flex-col h-screen">
        <Header />
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;
