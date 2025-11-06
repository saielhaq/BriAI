# BriAI - League of Legends Build Advisor

<div align="center">

**Your AI-powered companion for optimal League of Legends champion builds, runes, and items**

[![Built with React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-8A2BE2)](https://www.anthropic.com/)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Recommendations** - Get expert build advice using Claude Sonnet 4 AI
- 🎮 **Champion-Specific Builds** - Tailored recommendations for any champion and matchup
- 🛡️ **Runes & Items** - Complete guidance on optimal rune setups and item builds
- 🎯 **Rank-Aware** - Adjusts recommendations based on your rank (Iron to Challenger)
- 🌓 **Dark/Light Mode** - Beautiful interface that adapts to your preference
- ⚡ **Real-Time Chat** - Interactive conversation with BriAI
- 📱 **Fully Responsive** - Perfect experience on desktop, tablet, and mobile
- 🎨 **Modern UI** - Sleek design with glassmorphism and smooth animations

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- An Anthropic API key ([Get one here](https://console.anthropic.com/))
- DDragon data files from Riot Games

### Installation

1. **Clone or download this repository**

```bash
cd briai
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure your API key**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your Anthropic API key:

```env
VITE_ANTHROPIC_API_KEY=your_actual_api_key_here
```

4. **Add League of Legends data**

Download the latest DDragon data from Riot Games:
- Visit: https://ddragon.leagueoflegends.com/cdn/
- Find the latest version (e.g., `14.1.1`)
- Download:
  - `champions.json` from `/cdn/{version}/data/en_US/champion.json`
  - `items.json` from `/cdn/{version}/data/en_US/item.json`
  - `runesReforged.json` from `/cdn/{version}/data/en_US/runesReforged.json`

Place these files in the `/public/data/` directory:
```
public/
  data/
    champions.json
    items.json
    runesReforged.json
```

5. **Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔑 Getting Your Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the key and add it to your `.env` file

**Important:** Never commit your `.env` file or share your API key publicly!

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

To preview the production build locally:

```bash
npm run preview
```

---

## 🎮 How to Use

1. **Start a conversation** - Simply type your question in the chat input
2. **Ask about builds** - Request champion builds, runes, or item recommendations
3. **Provide context** - Mention your champion, role, and enemy matchup for better advice
4. **Select your rank** (optional) - Use the rank selector in the top-left for rank-specific tips
5. **Toggle theme** - Click the sun/moon icon in the top-right to switch themes

### Example Questions

- "Best build for Zed mid vs Ahri?"
- "What runes should I take on tank Malphite top?"
- "ADC Jinx build against heavy dive comp?"
- "Support Thresh items vs poke lane?"

---

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface.tsx    # Main chat container
│   ├── ChatMessage.tsx      # Individual message with markdown
│   ├── ChatInput.tsx        # User input field
│   ├── LoadingIndicator.tsx # Typing indicator
│   ├── Header.tsx           # App header
│   ├── ThemeToggle.tsx      # Dark/light mode toggle
│   └── RankSelector.tsx     # Rank selection dropdown
├── hooks/               # Custom React hooks
│   ├── useChat.ts          # Chat state management
│   └── useTheme.ts         # Theme management
├── services/            # External service integrations
│   ├── claudeApi.ts        # Claude AI integration
│   └── dataLoader.ts       # DDragon data loader
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Root component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** TailwindCSS
- **AI Integration:** Anthropic Claude API (@anthropic-ai/sdk)
- **Markdown Rendering:** react-markdown
- **Notifications:** react-hot-toast
- **Icons:** lucide-react

---

## 🎨 Design Features

### Color Schemes

**Light Mode**
- Soft white/gray backgrounds
- Vibrant blue-to-cyan gradients
- High contrast for readability

**Dark Mode**
- Deep navy/charcoal backgrounds
- Electric cyan/blue accents
- Glassmorphic effects with blur

### Animations
- Smooth theme transitions
- Message fade-in animations
- Hover effects and micro-interactions
- Loading indicators

---

## ⚙️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint code with ESLint |
| `npm run typecheck` | Check TypeScript types |

---

## 🔒 Privacy & Data

- **No data persistence** - Conversations are not saved or stored
- **Temporary sessions only** - All chat history clears on page refresh
- **Client-side only** - No backend server, all processing happens in your browser
- **API calls** - Only your messages and AI responses are sent to Anthropic's API

---

## 📝 Important Notes

### API Usage
- API calls are made directly from the browser to Anthropic
- `dangerouslyAllowBrowser: true` is enabled for client-side usage
- Monitor your API usage in the Anthropic Console
- Consider implementing rate limiting for production use

### Data Files
- The included JSON files are **samples** with limited champion data
- Replace them with complete DDragon data for full functionality
- Keep data files updated with the latest patch for accurate recommendations

### No Chat History
- This app intentionally does NOT save conversations
- Each page refresh starts a new session
- Theme preference is the only thing saved (in localStorage)

---

## 🤝 Contributing

This is a standalone application. Feel free to fork and customize for your needs!

---

## 📄 License

This project is provided as-is for personal use.

**Note:** League of Legends and all related properties are trademarks of Riot Games, Inc. This is an unofficial fan project and is not affiliated with or endorsed by Riot Games.

---

## 🐛 Troubleshooting

### "Unable to load League of Legends data"
- Ensure DDragon JSON files are in `/public/data/`
- Verify file names match exactly: `champions.json`, `items.json`, `runesReforged.json`
- Check that JSON files are valid (not empty or corrupted)

### "Invalid API key"
- Verify your `.env` file exists and contains `VITE_ANTHROPIC_API_KEY`
- Ensure the key is correctly copied from Anthropic Console
- Restart the dev server after adding/changing the `.env` file

### "Too many requests"
- You've hit the Anthropic API rate limit
- Wait a moment before trying again
- Consider upgrading your Anthropic plan for higher limits

### Theme not persisting
- Check browser localStorage is enabled
- Clear browser cache and reload

---

## 🌟 Acknowledgments

- Powered by [Anthropic Claude AI](https://www.anthropic.com/)
- Data from [Riot Games DDragon](https://developer.riotgames.com/)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">

**Built with ❤️ for the League of Legends community**

[Report Bug](https://github.com/yourusername/briai/issues) · [Request Feature](https://github.com/yourusername/briai/issues)

</div>
