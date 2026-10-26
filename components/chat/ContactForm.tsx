'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Send } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { whatsappHref } from '@/lib/site';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  model: '',
  message: '',
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const whatsappText = [
    'Equipment inquiry — Noor Alam Machineries',
    '',
    `Name: ${formData.name || 'Not provided'}`,
    `Phone: ${formData.phone || 'Not provided'}`,
    `Email: ${formData.email || 'Not provided'}`,
    `Equipment model: ${formData.model || 'Not provided'}`,
    '',
    formData.message || 'Please contact me about an equipment requirement.',
  ].join('\n');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website, source: 'contact' }),
      });

      const payload: unknown = await response.json().catch(() => null);
      const apiError = payload && typeof payload === 'object'
        && typeof (payload as { error?: unknown }).error === 'string'
        ? (payload as { error: string }).error
        : '';

      if (!response.ok) throw new Error(apiError || 'Your inquiry could not be sent.');

      setStatus('success');
      setFormData(EMPTY_FORM);
      setWebsite('');
      trackEvent('generate_lead', { method: 'form', source: 'contact' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Your inquiry could not be sent.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              maxLength={80}
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="email">
              Email <span className="normal-case tracking-normal text-slate-500">(optional)</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              maxLength={200}
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              maxLength={30}
              inputMode="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              placeholder="Phone or WhatsApp number"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="model">
              Equipment model
            </label>
            <input
              type="text"
              name="model"
              id="model"
              maxLength={120}
              value={formData.model}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              placeholder="e.g. Cummins KTA19"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="message">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            maxLength={2_000}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            placeholder="Share your requirements, vessel type, and specifications..."
          />
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            name="website"
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={status === 'submitting'}
          className="mt-2 w-full bg-cyan-400 py-6 text-base font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
        >
          <Send className="mr-2 inline h-4 w-4" />
          {status === 'submitting' ? 'Sending inquiry…' : 'Send inquiry'}
        </Button>

        <div aria-live="polite">
          {status === 'success' && (
            <p role="status" className="text-sm text-emerald-300">
              Thank you — your inquiry has been received. We will contact you shortly.
            </p>
          )}
          {status === 'error' && (
            <div role="alert" className="space-y-3 border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-100">
              <p>{errorMessage}</p>
              <a
                href={whatsappHref(whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="contact-form-fallback"
                className="inline-flex items-center gap-2 font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
              >
                <MessageCircle className="h-4 w-4" /> Send these details on WhatsApp instead
              </a>
            </div>
          )}
        </div>

        <p className="text-xs leading-5 text-slate-400">
          We only use these details to respond to your inquiry. Prefer WhatsApp?{' '}
          <a
            href={whatsappHref('Hi, I have an equipment inquiry for Noor Alam Machineries.')}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="contact-form-whatsapp"
            className="font-semibold text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
          >
            Message our team
          </a>
          .
        </p>
      </form>
    </div>
  );
}
