Phase 1: Local development setup
Goal

Create a working TypeScript/Lit project that builds a Home Assistant Lovelace card into:

dist/rachio-irrigation-card.js
Tasks
1. Create the repo
mkdir rachio-irrigation-card
cd rachio-irrigation-card
git init
npm init -y

Recommended repo name:

rachio-irrigation-card

Recommended custom element name:

rachio-irrigation-card

Recommended Lovelace type:

type: custom:rachio-irrigation-card

Keep these names aligned. It avoids a lot of HACS and Lovelace confusion later.

2. Install dependencies
npm install lit
npm install -D vite typescript

Optional but recommended:

npm install -D eslint prettier
3. Create project structure
rachio-irrigation-card/
├─ src/
│  ├─ rachio-irrigation-card.ts
│  ├─ types.ts
│  ├─ helpers.ts
│  └─ styles.ts
├─ dist/
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ hacs.json
├─ README.md
├─ LICENSE
└─ .gitignore
4. Add vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/rachio-irrigation-card.ts",
      formats: ["es"],
      fileName: () => "rachio-irrigation-card.js",
    },
    outDir: "dist",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
5. Add tsconfig.json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2021", "DOM"],
    "strict": true,
    "useDefineForClassFields": false,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}
6. Update package.json
{
  "name": "rachio-irrigation-card",
  "version": "0.1.0",
  "type": "module",
  "description": "A compact irrigation dashboard card for Home Assistant, designed for Rachio-style zone control.",
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "lit": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}