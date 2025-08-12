/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  // Add other VITE_ variables you use here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
