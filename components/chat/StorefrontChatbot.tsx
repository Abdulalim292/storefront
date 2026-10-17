'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { Bot, MessageCircle, RotateCcw, Send, X } from 'lucide-react';
import { BRANCHES } from '@/data/branches';
import { PRODUCTS } from '@/data/products';

type ChatAction = { label: string; href: string };
type Message = {
  role: 'assistant' | 'user';
  text: string;
  suggestions?: string[];
  actions?: ChatAction[];
};

const firstSuggestions = ['Find a part', 'Check compatibility', 'Find a branch'];
function productMatches(question: string) {
  const query = question.toLowerCase();
  const searchableTerms = PRODUCTS.map((product) => ({
    product,
    terms: product.name.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 3 && !['assembly', 'engine', 'turbocharger'].includes(term)),
  }));

  return searchableTerms
    .filter(({ product, terms }) => {
      const name = product.name.toLowerCase();
      return query.includes(name) || terms.some((term) => query.includes(term)) ||
        (query.includes('turbocharger') && product.category === 'turbocharging') ||
        (query.includes('piston') && product.category === 'pistons-rings');
    })
    .map(({ product }) => product)
    .slice(0, 3);
}

function replyTo(question: string): Omit<Message, 'role'> {
  const query = question.toLowerCase();
  const matches = productMatches(query);

  if (matches.length) {
    return {
      text: `These catalog items may be what you need. Open an item to check its details, then share the engine model or part number with a branch for a fitment check.`,
      actions: matches.map((product) => ({ label: product.name, href: `/products/${product.id}` })),
      suggestions: ['How do I check compatibility?', 'Ask about pricing', 'Find a branch'],
    };
  }

  if (/branch|address|location|where|phone|contact|call/.test(query)) {
    return {
      text: 'Choose a branch below to call, or ask me about a specific part.',
      actions: BRANCHES.flatMap((branch) => branch.phones.slice(0, 1).map((phone) => ({ label: `${branch.name} · ${phone}`, href: `tel:${phone.replaceAll('-', '')}` }))),
      suggestions: ['Browse all parts', 'Ask about pricing'],
    };
  }

  if (/compatib|fit|which|recommend|match|model|serial/.test(query)) {
    return {
      text: 'I can help you prepare a fitment check. Please provide the engine make and model, serial number, and the part number or dimensions if available. A branch can confirm compatibility before you order.',
      suggestions: ['Find a part', 'Ask about pricing', 'Find a branch'],
    };
  }

  if (/price|cost|quote|order|buy|available|stock/.test(query)) {
    return {
      text: 'Prices and availability depend on the exact specification. Call a branch with the item name, engine or equipment model, and part number if available.',
      suggestions: ['Find a branch', 'Find a part'],
    };
  }

  if (/part|product|sell|catalog|inventory|browse/.test(query)) {
    const examples = PRODUCTS.slice(0, 5).map((product) => product.name).join(', ');
    return {
      text: `The catalog includes ${examples}, plus more marine and industrial engine parts.`,
      actions: [{ label: 'Browse all parts', href: '/products' }],
      suggestions: ['Find a turbocharger', 'Find a piston', 'Check compatibility'],
    };
  }

  if (/engine|gearbox|machiner|equipment|marine/.test(query)) {
    return {
      text: 'Noor Alam Machineries helps source marine engines, gearboxes, heavy machinery, and engine parts. Tell me the equipment type or part name to see matching catalog items.',
      suggestions: ['Find a part', 'Find a branch', 'Ask about pricing'],
    };
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

export function StorefrontChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([initialMessage()]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const response = replyTo(trimmed);
    setMessages((current) => [...current, { role: 'user', text: trimmed }, { role: 'assistant', ...response }]);
    setInput('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  function resetConversation() {
    setMessages([initialMessage()]);
    setInput('');
  }

  return (
    <div className="fixed right-5 top-20 z-40 flex flex-col items-end sm:right-6 sm:top-20">
      {isOpen && (
        <section aria-label="Storefront chat" className="mb-3 flex h-[min(36rem,calc(100dvh-10rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
          <header className="flex items-center justify-between bg-slate-950 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cyan-400 text-slate-950"><Bot className="h-5 w-5" /></span>
              <div>
                <h2 className="text-sm font-semibold">Noor Alam support</h2>
                <p className="text-xs text-slate-300">Parts, fitment &amp; branch help</p>
              </div>
            </div>
            <div className="flex items-center">
              <button type="button" onClick={resetConversation} aria-label="Start a new conversation" title="Start a new conversation" className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"><RotateCcw className="h-4 w-4" /></button>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat" className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-cyan-600 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'}`}>
                  <p className="whitespace-pre-line">{message.text}</p>
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {message.actions.map((action) => action.href.startsWith('tel:') ? (
                        <a key={action.href} href={action.href} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-cyan-800 transition hover:border-cyan-400 hover:bg-cyan-50">{action.label}</a>
                      ) : (
                        <Link key={action.href} href={action.href} onClick={() => setIsOpen(false)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-cyan-800 transition hover:border-cyan-400 hover:bg-cyan-50">{action.label}</Link>
                      ))}
                    </div>
                  )}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-left text-xs font-medium text-cyan-900 transition hover:border-cyan-500 hover:bg-cyan-100">{suggestion}</button>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
            <label htmlFor="storefront-chat-input" className="sr-only">Message support</label>
            <input id="storefront-chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about a part or fitment..." className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
            <button type="submit" aria-label="Send message" disabled={!input.trim()} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cyan-600 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </form>
        </section>
      )}
      <button type="button" aria-label={isOpen ? 'Close support chat' : 'Open support chat'} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)} className="flex h-14 items-center gap-2 rounded-full bg-cyan-600 px-5 text-white shadow-lg shadow-cyan-900/25 transition hover:-translate-y-0.5 hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700">
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="text-sm font-semibold">{isOpen ? 'Close chat' : 'Chat with us'}</span>
      </button>
    </div>
  );
}
