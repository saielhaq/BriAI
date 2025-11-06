import { Trophy } from 'lucide-react';
import type { Rank } from '../types';

interface RankSelectorProps {
  selectedRank?: Rank;
  onRankChange: (rank?: Rank) => void;
}

const RANKS: (Rank | 'None')[] = [
  'None',
  'Iron',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Emerald',
  'Diamond',
  'Master',
  'Grandmaster',
  'Challenger'
];

export function RankSelector({ selectedRank, onRankChange }: RankSelectorProps) {
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <select
          value={selectedRank || 'None'}
          onChange={(e) => {
            const value = e.target.value;
            onRankChange(value === 'None' ? undefined : value as Rank);
          }}
          className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
          aria-label="Select your rank"
        >
          {RANKS.map((rank) => (
            <option key={rank} value={rank} className="bg-white dark:bg-gray-800">
              {rank === 'None' ? 'Select Rank' : rank}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
