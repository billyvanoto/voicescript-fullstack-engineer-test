import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. Apply the base JS recommended config to your files
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    ...js.configs.recommended,
    languageOptions: { 
      globals: globals.node 
    } 
  },
  
  // 2. Spread the TypeScript recommended configs
  tseslint.configs.strict,
  
  tseslint.configs.stylistic,
]);