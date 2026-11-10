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
        <button type="button" disabled aria-label="Loading support chat" className="btn opacity-80">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Chat with us</span>
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
        className="btn touch-manipulation"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Chat with us</span>
      </button>
    </div>
  );
}
