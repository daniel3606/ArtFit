/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  // add other VITE_ vars here as you create them
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}