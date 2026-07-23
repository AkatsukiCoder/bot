# Robot Assignment System

A TypeScript Node.js CLI that assigns robots to client work requests while minimising excess hours.

## Setup

```bash
npm install
```

## How to use

Start the interactive CLI:

```bash
npm start
```

You will be prompted step by step. Type a number at each prompt and press **Enter**.

### Example session

```
$ npm start

Enter number of robots available:
Bravo: 2
Charlie: 3
Delta: 2

Enter client work hours:
16

Robot Assignment
Bravo: 1
Charlie: 1
Delta: 1

Total Work Hours Provided: 16
Client Work Hours Requested: 16
```

### Step-by-step

1. Run `npm start`
2. At `Bravo:` — type how many Bravo robots are available (e.g. `2`) and press Enter
3. At `Charlie:` — type how many Charlie robots are available (e.g. `3`) and press Enter
4. At `Delta:` — type how many Delta robots are available (e.g. `2`) and press Enter
5. At `Enter client work hours:` — type the required hours (e.g. `16`) and press Enter
6. Read the assignment result printed below

### More examples

| Work hours entered | Result |
|--------------------|--------|
| `16` | 1 Bravo + 1 Charlie + 1 Delta (16 hours, 0 excess) |
| `17` | 1 Bravo (17 hours, 0 excess) |
| `21` | 1 Charlie (21 hours, 0 excess) |
| `24` | 1 Delta (24 hours, 0 excess) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the CLI (TypeScript via tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Build then run compiled JavaScript |
| `npm test` | Run tests |

## Robot types

| Type    | Max Hours/Day | Strategy Level |
|---------|---------------|----------------|
| Bravo   | 17            | 1              |
| Charlie | 21            | 2              |
| Delta   | 24            | 3              |

Each robot works once per day up to its max hours, then recharges.

## Assignment levels

1. **Level 1 — Bravo-only**
2. **Level 2 — Charlie-only**
3. **Level 3 — Delta-only**
4. **Level 4 — Balanced team** — 1 Bravo + 1 Charlie + 1 Delta delivers **16 hours** of coordinated work

The system picks the assignment with the lowest excess hours.

## Project structure

```
src/
  types.ts        Shared TypeScript types
  robots.ts       Robot definitions
  strategies.ts   Level-based assignment logic
  assigner.ts     Public API and output formatting
  index.ts        Interactive CLI
test/
  assigner.test.ts
```
