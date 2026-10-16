'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();

    if (name.length < 2) {
      setError('Please enter your name.');
      setLoading(false);
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (message.length < 10) {
      setError('Please write a message of at least 10 characters.');
      setLoading(false);
      return;
    }

    // TODO: wire to real endpoint (form service, Resend, API route)
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSubmitted(true);
    console.log('Contact submitted', { name, email, message });
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-emerald-700 text-xl">✓</span>
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900">
          Message received
        </h3>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
          Thanks for getting in touch. We&apos;ll respond within one business
          day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Nomsa Mahlangu"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.co.za"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          Subject <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <select id="subject" name="subject" defaultValue="general">
          <option value="general">General enquiry</option>
          <option value="pricing">Pricing and plans</option>
          <option value="enterprise">Enterprise / white-label</option>
          <option value="security">Security and POPIA</option>
          <option value="support">Support</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us about your stokvel or your question…"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg shadow-md shadow-emerald-500/25 transition-all"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          'Send message'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center pt-2">
        Or email us directly at{' '}
        <a
          href="mailto:hello@stokvelmanager.co.za"
          className="text-emerald-700 hover:underline"
        >
          hello@stokvelmanager.co.za
        </a>
      </p>
    </form>
  );
}
