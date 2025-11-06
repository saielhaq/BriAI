export type Rank = 'Iron' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Emerald' | 'Diamond' | 'Master' | 'Grandmaster' | 'Challenger';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export type Theme = 'light' | 'dark';

export interface Champion {
  id: string;
  name: string;
  title: string;
  tags: string[];
  image: {
    full: string;
  };
}

export interface Item {
  name: string;
  description: string;
  plaintext: string;
  gold: {
    total: number;
  };
  tags: string[];
  image: {
    full: string;
  };
}

export interface RuneSlot {
  runes: {
    id: number;
    key: string;
    name: string;
    shortDesc: string;
  }[];
}

export interface RuneTree {
  id: number;
  key: string;
  name: string;
  icon: string;
  slots: RuneSlot[];
}

export interface DDragonData {
  champions: Record<string, Champion>;
  items: Record<string, Item>;
  runes: RuneTree[];
}
