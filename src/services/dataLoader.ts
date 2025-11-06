import type { DDragonData } from '../types';

export async function loadDDragonData(): Promise<DDragonData> {
  try {
    const [championsRes, itemsRes, runesRes] = await Promise.all([
      fetch('/data/champions.json'),
      fetch('/data/items.json'),
      fetch('/data/runesReforged.json')
    ]);

    if (!championsRes.ok || !itemsRes.ok || !runesRes.ok) {
      throw new Error('Failed to load DDragon data');
    }

    const [championsData, itemsData, runesData] = await Promise.all([
      championsRes.json(),
      itemsRes.json(),
      runesRes.json()
    ]);

    return {
      champions: championsData.data || {},
      items: itemsData.data || {},
      runes: runesData || []
    };
  } catch (error) {
    console.error('Error loading DDragon data:', error);
    throw new Error('Unable to load League of Legends data. Please ensure data files are present in /public/data/');
  }
}

export function formatDataForGemini(data: DDragonData): string {
  const championList = Object.values(data.champions)
    .map(c => `${c.name} (${c.tags.join(', ')})`)
    .join(', ');

  const itemCategories = Object.values(data.items).reduce((acc, item) => {
    item.tags.forEach(tag => {
      if (!acc[tag]) acc[tag] = [];
      acc[tag].push(item.name);
    });
    return acc;
  }, {} as Record<string, string[]>);

  const runeTreeNames = data.runes.map(tree => {
    const keystones = tree.slots[0]?.runes.map(r => r.name).join(', ') || '';
    return `${tree.name} (Keystones: ${keystones})`;
  }).join(' | ');

  return `
# Available League of Legends Data

## Champions (${Object.keys(data.champions).length} total)
${championList}

## Item Categories
${Object.entries(itemCategories).map(([category, items]) =>
  `${category}: ${items.slice(0, 10).join(', ')}${items.length > 10 ? '...' : ''}`
).join('\n')}

## Rune Trees
${runeTreeNames}
`;
}
