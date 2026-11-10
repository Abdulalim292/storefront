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
    'Equipment inquiry for Noor Alam Machineries',
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
    <div className="w-full">
      <p className="mb-4 text-sm font-medium text-ink">Send an inquiry</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-px border border-rule-2 bg-rule-2">
        <div className="grid grid-cols-1 gap-px bg-rule-2 sm:grid-cols-2">
          <div className="field bg-paper p-3">
            <label className="label" htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              maxLength={80}
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input border-0 border-b border-muted bg-transparent px-0"
              placeholder="Your name"
            />
          </div>
          <div className="field bg-paper p-3">
            <label className="label" htmlFor="email">Email (optional)</label>
            <input
              type="email"
              name="email"
              id="email"
              maxLength={200}
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input border-0 border-b border-muted bg-transparent px-0"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-rule-2 sm:grid-cols-2">
          <div className="field bg-paper p-3">
            <label className="label" htmlFor="phone">Phone</label>
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
              className="input border-0 border-b border-muted bg-transparent px-0"
              placeholder="Phone or WhatsApp"
            />
          </div>
          <div className="field bg-paper p-3">
            <label className="label" htmlFor="model">Equipment model</label>
            <input
              type="text"
              name="model"
              id="model"
              maxLength={120}
              value={formData.model}
              onChange={handleInputChange}
              className="input border-0 border-b border-muted bg-transparent px-0"
              placeholder="e.g. KTA19"
            />
          </div>
        </div>

        <div className="field bg-paper p-3">
          <label className="label" htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            maxLength={2_000}
            value={formData.message}
            onChange={handleInputChange}
            className="input border-0 border-b border-muted bg-transparent px-0"
            placeholder="Share your requirements, vessel type, and specifications"
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
          className="w-full"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {status === 'submitting' ? 'Sending inquiry' : 'Send inquiry'}
        </Button>

        <div aria-live="polite" className="bg-paper p-3 empty:hidden">
          {status === 'success' && (
            <p role="status" className="text-sm text-success">
              Thank you. Your inquiry has been received. We will contact you shortly.
            </p>
          )}
          {status === 'error' && (
            <div role="alert" className="space-y-3 border border-error/50 p-3 text-sm text-ink-2">
              <p>{errorMessage}</p>
              <a
                href={whatsappHref(whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="contact-form-fallback"
                className="inline-flex items-center gap-2 font-medium text-accent underline underline-offset-4"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Send these details on WhatsApp instead
              </a>
            </div>
          )}
        </div>

        <p className="bg-paper p-3 text-xs leading-5 text-muted">
          We only use these details to respond to your inquiry. Prefer WhatsApp?{' '}
          <a
            href={whatsappHref('Hi, I have an equipment inquiry for Noor Alam Machineries.')}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="contact-form-whatsapp"
            className="font-medium text-accent underline underline-offset-4"
          >
            Message our team
          </a>
          .
        </p>
      </form>
    </div>
  );
}
