'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Send } from 'lucide-react';

export function ContactForm() {
  const [draftOpened, setDraftOpened] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    model: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = `Equipment inquiry from ${formData.name}`;
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Equipment model: ${formData.model || 'Not provided'}`,
      '',
      formData.message,
    ].join('\n');
    window.location.href = `mailto:noornoobi80@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraftOpened(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
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
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="model">
                Equipment Model
              </label>
              <input
                type="text"
                name="model"
                id="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
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
              value={formData.message}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder="Share your requirements, vessel type, and specifications..."
            />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full bg-cyan-400 py-6 text-base font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            <Send className="mr-2 inline h-4 w-4" /> Open email draft
          </Button>
          {draftOpened && <p role="status" className="text-sm text-emerald-300">Your email app should open with the inquiry details. Send the draft there to contact us.</p>}
      </form>
    </div>
  );
}
