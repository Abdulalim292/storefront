'use client';

import dynamic from 'next/dynamic';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

const StorefrontChatbot = dynamic(
  () => import('./StorefrontChatbot').then((module) => module.StorefrontChatbot),
  {
    ssr: false,
    loading: () => (
      <div className="pointer-events-auto fixed bottom-20 right-4 z-[65] sm:right-6 lg:bottom-6">
        <button type="button" disabled aria-label="Loading support chat" className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-white opacity-80 shadow-lg sm:h-14 sm:w-14">
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    ),
  },
);

export function StorefrontChatLauncher() {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) return <StorefrontChatbot initialOpen />;

  return (
    <div className="pointer-events-auto fixed bottom-20 right-4 z-[65] sm:right-6 lg:bottom-6">
      <button
        type="button"
        aria-label="Open support chat"
        onClick={() => setIsLoaded(true)}
        className="touch-manipulation flex h-12 w-12 items-center justify-center gap-2 rounded-full bg-cyan-600 p-0 text-white shadow-lg shadow-cyan-900/25 transition hover:-translate-y-0.5 hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 sm:h-14 sm:w-auto sm:px-5"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
      </button>
    </div>
  );
}
