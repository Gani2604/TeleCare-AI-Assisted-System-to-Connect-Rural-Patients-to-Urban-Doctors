
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n.ts'
import { Toaster } from "@/components/ui/sonner"

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <>
      <Toaster />
      <App />
    </>
  );
} else {
  console.error("Root element not found");
}
