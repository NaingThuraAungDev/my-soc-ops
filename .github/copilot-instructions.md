# Copilot Instructions for Soc Ops

Social Bingo game for in-person mixers using React 19 + Vite + TypeScript + Tailwind v4.

## Architecture Overview

**State Management**: Single custom hook pattern via [useBingoGame.ts](../src/hooks/useBingoGame.ts)
- Encapsulates all game state, localStorage persistence, and business logic
- Returns both state (`gameState`, `board`, `winningLine`) and actions (`startGame`, `resetGame`)
- Components are presentational and receive all data/callbacks as props

**Data Flow**: App.tsx → useBingoGame → pure utility functions in [bingoLogic.ts](../src/utils/bingoLogic.ts)
- Business logic is tested independently without React
- All game logic (board generation, win detection) is pure and side-effect free
- State updates use immutable patterns (`.map()` for toggles)

**Type Safety**: Domain types in [types/index.ts](../src/types/index.ts) are imported throughout
- `BingoSquareData`, `BingoLine`, `GameState` are the core types
- Utils re-export types for convenience: `export type { BingoSquareData } from '../types'`

## Key Conventions

**Component Props**: Always destructure and type inline with dedicated interfaces
```tsx
interface BingoBoardProps {
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  onSquareClick: (squareId: number) => void;
}

export function BingoBoard({ board, winningSquareIds, onSquareClick }: BingoBoardProps) {
```

**State Persistence**: useBingoGame handles localStorage with versioning and validation
- Storage key: `'bingo-game-state'` with version field for migration safety
- Full validation via `validateStoredData()` before hydrating state
- SSR guard: `if (typeof window === 'undefined')` for localStorage access

**Testing Philosophy**: Pure functions tested extensively; React components minimally
- Tests in [bingoLogic.test.ts](../src/utils/bingoLogic.test.ts) cover board generation, win detection, edge cases
- Setup: [test/setup.ts](../src/test/setup.ts) configures Testing Library + Vitest globals
- Run tests: `npm test` (configured with `watch: false` in vite.config.ts)

## Development Workflows

**Dev Server**: `npm run dev` (Vite with HMR)
**Build**: `npm run build` (TypeScript check + Vite build)
**Lint**: `npm run lint` (ESLint flat config with React hooks rules)
**Test**: `npm test` (Vitest with jsdom environment)

**Deployment**: Auto-deploys to GitHub Pages on push to `main`
- Uses environment variable `VITE_REPO_NAME` for correct base path
- Build artifact: `dist/` folder

## Styling with Tailwind v4

**Configuration**: CSS-first via `@theme` in [index.css](../src/index.css) (no tailwind.config.js)
```css
@theme {
  --color-accent: #2563eb;
  --color-marked: #dcfce7;
  --color-bingo: #fbbf24;
}
```
Use custom colors: `bg-accent`, `border-marked`, `text-bingo`

**Patterns**: Utility-first with composition in components
- Grid layouts: `grid grid-cols-5 gap-1` for bingo board
- Responsive: Use Tailwind's mobile-first breakpoints
- Custom properties for theme values (see [.github/instructions/tailwind-4.instructions.md](instructions/tailwind-4.instructions.md))

## Modifying the Game

**Adding Questions**: Edit [data/questions.ts](../src/data/questions.ts) array
- Questions should be short, personal traits/experiences
- Board uses 24 random questions + 1 free space (center)

**Changing Win Conditions**: Modify `getWinningLines()` in bingoLogic.ts
- Current: 5 rows + 5 columns + 2 diagonals
- Returns `BingoLine[]` with type, index, and square IDs

**Board Size**: Hardcoded to 5x5 (`BOARD_SIZE = 5`, `CENTER_INDEX = 12`)
- Changing requires updates to win detection logic and grid CSS (`grid-cols-5`)

## Common Patterns

**Event Handlers**: Always use arrow functions in JSX to avoid re-renders
```tsx
onClick={() => onSquareClick(square.id)}
```

**Conditional Rendering**: Early returns for different game states
```tsx
if (gameState === 'start') {
  return <StartScreen onStart={startGame} />;
}
```

**Pure Utility Functions**: Accept state, return new state (no mutations)
```tsx
export function toggleSquare(board: BingoSquareData[], squareId: number): BingoSquareData[] {
  return board.map((square) =>
    square.id === squareId && !square.isFreeSpace
      ? { ...square, isMarked: !square.isMarked }
      : square
  );
}
```

## Project Structure Notes

- **src/components/**: Presentational React components
- **src/hooks/**: Custom React hooks (currently just useBingoGame)
- **src/utils/**: Pure business logic with comprehensive tests
- **src/data/**: Static data (questions list)
- **src/types/**: TypeScript domain types
- **.github/instructions/**: AI coding agent instructions for specific domains (frontend design, Tailwind)

This is a workshop/educational project—code prioritizes clarity and patterns over production optimization.
