"use client";

import { useState, type FormEvent } from "react";
import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import { CONTACT_PLACEHOLDERS } from "@/lib/data";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialState: FormState = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function validate(values: FormState) {
    const next: Partial<FormState> = {};
    if (!values.name.trim()) next.name = "Full name is required.";
    if (!values.email.trim()) {
      next.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!values.subject.trim()) next.subject = "Subject is required.";
    if (!values.message.trim()) next.message = "Message is required.";
    return next;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    // No backend is connected yet. This simulates submission locally only.
    window.setTimeout(() => {
      setStatus("success");
      setForm(initialState);
    }, 900);
  }

  const contactDetails = [
    { icon: "mail", label: "Email", value: CONTACT_PLACEHOLDERS.email },
    { icon: "phone", label: "Phone", value: CONTACT_PLACEHOLDERS.phone },
    { icon: "pin", label: "Address", value: CONTACT_PLACEHOLDERS.address },
    { icon: "clock", label: "Business Hours", value: CONTACT_PLACEHOLDERS.hours },
  ];

  return (
    <Section id="contact" className="bg-ink-900/30">
      <SectionHeading
        eyebrow="Contact"
        title="Get in Touch"
        description="Reach out with questions about accounts, platform access, or general enquiries."
      />

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="reveal flex flex-col gap-4">
          {contactDetails.map((detail) => (
            <div key={detail.label} className="glass-card flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
                <Icon name={detail.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">{detail.label}</p>
                <p className="mt-1 text-sm font-medium text-white/85">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          className="reveal glass-card flex flex-col gap-5 p-7"
          onSubmit={handleSubmit}
          noValidate
        >
          {status === "success" ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300"
            >
              <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                Thank you — your message has been captured locally. This form is not yet
                connected to a live support system.
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label-field">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="input-field"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name ? (
                <p id="name-error" className="mt-1.5 text-xs text-rose-400">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="label-field">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email ? (
                <p id="email-error" className="mt-1.5 text-xs text-rose-400">
                  {errors.email}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="label-field">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="subject" className="label-field">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="input-field"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? "subject-error" : undefined}
              />
              {errors.subject ? (
                <p id="subject-error" className="mt-1.5 text-xs text-rose-400">
                  {errors.subject}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="label-field">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="input-field resize-none"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message ? (
              <p id="message-error" className="mt-1.5 text-xs text-rose-400">
                {errors.message}
              </p>
            ) : null}
          </div>

          <button type="submit" className="btn-gold w-full sm:w-fit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </Section>
  );
}
