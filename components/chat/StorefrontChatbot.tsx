'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { Bot, MessageCircle, RotateCcw, Send, X } from 'lucide-react';
import { BRANCHES } from '@/data/branches';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';

type ChatAction = { label: string; href: string };
type ProductMatch = { id: string; name: string };
type Message = {
  role: 'assistant' | 'user';
  text: string;
  suggestions?: string[];
  actions?: ChatAction[];
};

const firstSuggestions = ['Find a part', 'Check compatibility', 'Find a branch'];

// The catalog stays on the server; only compact matches cross the network.
async function productMatches(question: string): Promise<ProductMatch[]> {
  try {
    const url = new URL('/api/chat/search', window.location.origin);
    url.searchParams.set('q', question.slice(0, 160));

    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return [];

    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || !Array.isArray((data as { matches?: unknown }).matches)) return [];

    return (data as { matches: unknown[] }).matches
      .filter((match): match is ProductMatch =>
        Boolean(match)
        && typeof match === 'object'
        && typeof (match as ProductMatch).id === 'string'
        && typeof (match as ProductMatch).name === 'string')
      .slice(0, 3);
  } catch {
    return [];
  }
}

async function replyTo(question: string): Promise<Omit<Message, 'role'>> {
  const query = question.toLowerCase();
  const matches = await productMatches(question);

  if (matches.length) {
    const isExact = matches[0].name.toLowerCase() === query.trim();
    return {
      text: isExact
        ? `I found the ${matches[0].name}. You can view the details below. To confirm fitment, please share your engine model or serial number with a branch.`
        : `These catalog items may be what you need. Open an item to check its details, then share the engine model or part number with a branch for a fitment check.`,
      actions: matches.map((product) => ({ label: product.name, href: `/products/${product.id}` })),
      suggestions: ['How do I check compatibility?', 'Ask about pricing', 'Find a branch'],
    };
  }

  const rules: {
    pattern: RegExp;
    response: (query: string) => Omit<Message, 'role'>
  }[] = [
    {
      pattern: /\b(branch|address|location|where|phone|contact|call)\b/i,
      response: () => ({
        text: 'Choose a branch below to call, or ask me about a specific part.',
        actions: BRANCHES.flatMap((branch) => branch.phones.slice(0, 1).map((phone) => ({ label: `${branch.name.split('\u00b7').join(',')} ${formatBangladeshPhone(phone)}`, href: toBangladeshTel(phone) }))),
        suggestions: ['Browse all parts', 'Ask about pricing'],
      })
    },
    {
      pattern: /\b(compatib|fit|which|recommend|match|model|serial)\b/i,
      response: () => ({
        text: 'I can help you prepare a fitment check. Please provide the engine name and model, serial number, and the part number or dimensions if available. A branch can confirm compatibility before you order.',
        suggestions: ['Find a part', 'Ask about pricing', 'Find a branch'],
      })
    },
    {
      pattern: /\b(price|cost|quote|order|buy|available|stock)\b/i,
      response: () => ({
        text: 'Prices and availability depend on the exact specification. Call a branch with the item name, engine or equipment model, and part number if available.',
        suggestions: ['Find a branch', 'Find a part'],
      })
    },
    {
      pattern: /\b(part|product|sell|catalog|inventory|browse)\b/i,
      response: () => ({
        text: 'The catalog covers turbochargers, cylinder components, pistons and rings, valve train parts, fuel system parts, engine components, cooling system parts, gearbox parts, and heavy equipment components.',
        actions: [{ label: 'Browse all parts', href: '/products' }],
        suggestions: ['Find a turbocharger', 'Find a piston', 'Check compatibility'],
      })
    },
    {
      pattern: /\b(engine|gearbox|machiner|equipment|marine)\b/i,
      response: () => ({
        text: 'Noor Alam Machineries helps source marine engines, gearboxes, heavy machinery, and engine parts. Tell me the equipment type or part name to see matching catalog items.',
        suggestions: ['Find a part', 'Find a branch', 'Ask about pricing'],
      })
    },
    {
      pattern: /\b(hi|hello|hey|greetings)\b/i,
      response: () => ({
        text: 'Hello! I am the Noor Alam support bot. I can help you find parts, prepare fitment checks, or locate a branch. How can I help you today?',
        suggestions: ['Find a part', 'Check compatibility', 'Find a branch'],
      })
    },
  ];

  for (const rule of rules) {
    if (rule.pattern.test(query)) return rule.response(query);
  }

  return {
    text: 'I can help find catalog parts, prepare a compatibility check, or locate a branch. Choose an option or tell me what you need.',
    suggestions: ['Find a part', 'Check compatibility', 'Find a branch'],
  };
}

function initialMessage(): Message {
  return {
    role: 'assistant',
    text: 'Hi! I can help you find a part, prepare a fitment check, or contact a branch. What do you need today?',
    suggestions: firstSuggestions,
  };
}

export function StorefrontChatbot({ initialOpen = false }: { initialOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([initialMessage()]);
  const [isReplying, setIsReplying] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages, isOpen, isReplying]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isReplying) return;

    const conversation = conversationRef.current;
    setInput('');
    setIsReplying(true);
    setMessages((current) => [...current, { role: 'user', text: trimmed }]);

    try {
      const response = await replyTo(trimmed);
      if (conversationRef.current !== conversation) return;
      setMessages((current) => [...current, { role: 'assistant', ...response }]);
    } finally {
      if (conversationRef.current === conversation) setIsReplying(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function resetConversation() {
    conversationRef.current += 1;
    setIsReplying(false);
    setMessages([initialMessage()]);
    setInput('');
  }

  return (
    <div className="pointer-events-auto fixed bottom-20 right-4 z-[65] flex flex-col items-end sm:right-6 lg:bottom-6">
      {isOpen && (
        <section aria-label="Storefront chat" className="sheet-light mb-3 flex h-[min(34rem,calc(100dvh-11rem))] w-[min(24rem,calc(100vw-2rem))] flex-col border border-rule-2 lg:h-[min(36rem,calc(100dvh-6rem))]">
          <header className="flex items-center justify-between border-b border-rule-2 bg-paper-2 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center border border-rule-2 text-accent"><Bot className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <h2 className="text-sm text-ink">Noor Alam support</h2>
                <p className="text-xs text-muted">Parts, fitment and branch help</p>
              </div>
            </div>
            <div className="flex items-center">
              <button type="button" onClick={resetConversation} aria-label="Start a new conversation" title="Start a new conversation" className="masthead__icon"><RotateCcw className="h-4 w-4" /></button>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat" className="masthead__icon"><X className="h-5 w-5" /></button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-paper p-4" aria-live="polite" aria-busy={isReplying}>
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] px-3 py-2 text-sm leading-6 ${message.role === 'user' ? 'bg-ink text-accent-ink' : 'border border-rule-2 bg-paper-2 text-ink-2'}`}>
                  <p className="m-0 max-w-none whitespace-pre-line">{message.text}</p>
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {message.actions.map((action) => action.href.startsWith('tel:') ? (
                        <a key={action.href} href={action.href} className="border border-rule-2 px-3 py-2 text-left text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent">{action.label}</a>
                      ) : (
                        <Link key={action.href} href={action.href} onClick={() => setIsOpen(false)} className="border border-rule-2 px-3 py-2 text-left text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent">{action.label}</Link>
                      ))}
                    </div>
                  )}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion) => <button key={suggestion} type="button" disabled={isReplying} onClick={() => void sendMessage(suggestion)} className="border border-rule-2 px-3 py-1.5 text-left text-xs font-medium text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60">{suggestion}</button>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isReplying && (
              <div className="flex justify-start">
                <div className="border border-rule-2 bg-paper-2 px-3 py-2 text-sm leading-6 text-muted">
                  Checking the catalog
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-rule-2 bg-paper-2 p-3">
            <label htmlFor="storefront-chat-input" className="visually-hidden">Message support</label>
            <input id="storefront-chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about a part or fitment" className="input min-h-11 flex-1" inputMode="text" enterKeyHint="send" />
            <button type="submit" aria-label="Send message" disabled={!input.trim() || isReplying} className="btn btn--icon shrink-0"><Send className="h-4 w-4" aria-hidden="true" /></button>
          </form>
        </section>
      )}
      <button type="button" aria-label={isOpen ? 'Close support chat' : 'Open support chat'} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)} className="btn touch-manipulation">
        {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
        <span className="hidden sm:inline">{isOpen ? 'Close chat' : 'Chat with us'}</span>
      </button>
    </div>
  );
}
