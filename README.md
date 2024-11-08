# Shelf Scout

A lightweight product catalog browser with smart filtering and persistent shopping cart functionality. Helps small businesses quickly set up a browsable product catalog with category filtering, search, and a Redux-powered cart that syncs across sessions.

## Features

- Dynamic product grid with lazy loading
- Multi-filter system (categories, price ranges, availability)
- Redux-managed cart with localStorage persistence
- Quick-view product modal with image gallery
- Responsive mobile-first design with collapsible filter sidebar

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/shelf-scout.git
cd shelf-scout

# Install dependencies
npm install
```

## Usage

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 18 with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Vite for build tooling

## Project Structure

```
src/
├── components/      # React components
├── store/           # Redux store and slices
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## License

MIT