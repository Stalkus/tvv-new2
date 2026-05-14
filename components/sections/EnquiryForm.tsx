"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

const destinations = [
  "Andaman Islands",
  "Kerala",
  "Rajasthan",
  "Ladakh",
  "Himachal",
  "Kashmir",
  "Goa",
  "Sikkim",
  "Maldives",
  "Bali",
  "Japan",
  "Europe",
  "Switzerland",
  "Dubai",
  "Thailand",
  "Vietnam",
  "Other / not sure",
];

const tripTypes = ["Honeymoon", "Family", "Adventure", "Luxury", "Wellness", "Cultural", "Corporate / MICE", "Other"];

const budgets = [
  "Under ₹50k / person",
  "₹50k – 1L / person",
  "₹1L – 2L / person",
  "₹2L – 4L / person",
  "₹4L+ / person",
  "Open / flexible",
];

const durations = ["3–4 days", "5–6 days", "7–10 days", "11–14 days", "15+ days", "Not sure"];

export function EnquiryForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state !== "idle") return;
    setState("sending");
    setTimeout(() => setState("sent"), 1100);
  }

  if (state === "sent") {
    return (
      <div className="rounded-xl border border-success/30 bg-success-bg p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden />
        <h2 className="mt-4 font-display text-[24px] text-ink">Your enquiry is with a specialist.</h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-ink-secondary">
          You'll hear from us within four working hours — by email and WhatsApp, in case one is easier to read.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-line bg-white p-7 shadow-card sm:p-9"
      aria-label="Enquiry form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            type="text"
            required
            placeholder="As you'd like us to address you"
            className="input"
          />
        </Field>
        <Field label="Email address" required>
          <input type="email" required placeholder="you@example.com" className="input" />
        </Field>
        <Field label="WhatsApp / phone" required>
          <input type="tel" required placeholder="+91 9123 456 789" className="input" />
        </Field>
        <Field label="Travelling from">
          <input type="text" placeholder="City of departure" className="input" />
        </Field>
        <Field label="Destination">
          <select className="input">
            {destinations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Trip type">
          <select className="input">
            {tripTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Approximate dates">
          <input type="text" placeholder="e.g. mid-November, flexible" className="input" />
        </Field>
        <Field label="Duration">
          <select className="input">
            {durations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Party size">
          <input type="text" placeholder="2 adults, 1 child (8 yrs)" className="input" />
        </Field>
        <Field label="Budget per person">
          <select className="input">
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="A little about how you like to travel">
          <textarea
            rows={4}
            placeholder="Pace, properties you've loved, things to include or avoid…"
            className="input min-h-[120px] py-3 resize-y"
          />
        </Field>
      </div>

      <label className="mt-5 flex items-start gap-3 text-[12px] text-ink-secondary">
        <input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 rounded border-line text-teal focus:ring-teal" />
        <span>I'd like to receive occasional travel inspiration and off-season fares. Never spam.</span>
      </label>

      <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-[12px] text-ink-muted">
          A specialist replies within four working hours. No charge until you approve a proposal.
        </p>
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal px-7 text-[14px] font-medium text-white transition-colors hover:bg-teal-hover disabled:opacity-70"
        >
          {state === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Send enquiry <Send className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border: 1px solid var(--tvv-border);
          border-radius: 10px;
          background: var(--tvv-white);
          color: var(--tvv-text-primary);
          font-size: 14px;
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        :global(.input:focus) {
          border-color: var(--tvv-teal);
          box-shadow: 0 0 0 3px rgba(11, 122, 117, 0.12);
        }
        :global(textarea.input) {
          height: auto;
          padding: 12px 14px;
        }
      `}</style>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-label uppercase text-ink-secondary">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}
