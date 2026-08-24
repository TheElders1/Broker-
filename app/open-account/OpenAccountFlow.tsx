"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { register } from "@/lib/api/services/auth";
import { ApiError } from "@/lib/api/client";

type FormData = {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  accountType: string;
  currency: string;
  experience: string;
  idType: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  riskAccepted: boolean;
};

const STEPS = [
  "Personal Information",
  "Contact Information",
  "Account Preferences",
  "Identity Verification",
  "Confirmation",
];

const initialData: FormData = {
  firstName: "",
  lastName: "",
  dob: "",
  country: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  accountType: "Basic",
  currency: "USD",
  experience: "Beginner",
  idType: "Passport",
  termsAccepted: false,
  privacyAccepted: false,
  riskAccepted: false,
};

export default function OpenAccountFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function validateStep(): Record<string, string> {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!data.firstName.trim()) e.firstName = "First name is required.";
      if (!data.lastName.trim()) e.lastName = "Last name is required.";
      if (!data.dob) e.dob = "Date of birth is required.";
      if (!data.country.trim()) e.country = "Country of residence is required.";
    }
    if (step === 1) {
      if (!data.email.trim()) {
        e.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        e.email = "Enter a valid email address.";
      }
      if (!data.phone.trim()) e.phone = "Phone number is required.";
      if (!data.address.trim()) e.address = "Address is required.";
      if (!data.city.trim()) e.city = "City is required.";
      if (!data.postalCode.trim()) e.postalCode = "Postal code is required.";
    }
    if (step === 4) {
      if (!data.termsAccepted) e.termsAccepted = "You must accept the Terms & Conditions.";
      if (!data.privacyAccepted) e.privacyAccepted = "You must accept the Privacy Policy.";
      if (!data.riskAccepted) e.riskAccepted = "You must acknowledge the Risk Disclosure.";
    }
    return e;
  }

  function goNext() {
    const v = validateStep();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validateStep();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dob,
        country: data.country,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        accountType: data.accountType,
        currency: data.currency,
        experience: data.experience,
        idType: data.idType,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Your application could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h2 className="font-display text-2xl font-semibold text-white">
          Application Received
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-white/60">
          Thank you, {data.firstName || "there"}. Your application was submitted through the
          demo API layer — no real account has been created, since this environment is not yet
          connected to the live registration and KYC backend.
        </p>
        <Link href="/" className="btn-gold mt-2">
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <ol className="mb-10 grid grid-cols-5 gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-col items-center gap-2 text-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                i < step
                  ? "bg-gold-gradient text-ink-950"
                  : i === step
                  ? "border-2 border-gold-400 text-gold-300"
                  : "border border-white/15 text-white/35"
              }`}
            >
              {i < step ? <Icon name="check" className="h-4 w-4" /> : i + 1}
            </span>
            <span className={`hidden text-[10px] leading-tight sm:block ${i === step ? "text-white/80" : "text-white/35"}`}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {step === 0 ? (
          <StepPersonal data={data} update={update} errors={errors} />
        ) : step === 1 ? (
          <StepContact data={data} update={update} errors={errors} />
        ) : step === 2 ? (
          <StepPreferences data={data} update={update} />
        ) : step === 3 ? (
          <StepKYC data={data} update={update} />
        ) : (
          <StepConfirmation data={data} update={update} errors={errors} />
        )}

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="btn-outline disabled:pointer-events-none disabled:opacity-30"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={goNext} className="btn-gold">
              Continue
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" className="btn-gold" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>

        {submitError ? (
          <p className="text-center text-sm text-rose-400">{submitError}</p>
        ) : null}
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label-field">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-xs text-rose-400">{error}</p> : null}
    </div>
  );
}

function StepPersonal({
  data,
  update,
  errors,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field id="firstName" label="First Name" error={errors.firstName}>
        <input
          id="firstName"
          className="input-field"
          value={data.firstName}
          onChange={(e) => update("firstName", e.target.value)}
        />
      </Field>
      <Field id="lastName" label="Last Name" error={errors.lastName}>
        <input
          id="lastName"
          className="input-field"
          value={data.lastName}
          onChange={(e) => update("lastName", e.target.value)}
        />
      </Field>
      <Field id="dob" label="Date of Birth" error={errors.dob}>
        <input
          id="dob"
          type="date"
          className="input-field"
          value={data.dob}
          onChange={(e) => update("dob", e.target.value)}
        />
      </Field>
      <Field id="country" label="Country of Residence" error={errors.country}>
        <input
          id="country"
          className="input-field"
          placeholder="e.g. United Kingdom"
          value={data.country}
          onChange={(e) => update("country", e.target.value)}
        />
      </Field>
    </div>
  );
}

function StepContact({
  data,
  update,
  errors,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field id="email" label="Email Address" error={errors.email}>
        <input
          id="email"
          type="email"
          className="input-field"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </Field>
      <Field id="phone" label="Phone Number" error={errors.phone}>
        <input
          id="phone"
          type="tel"
          className="input-field"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field id="address" label="Street Address" error={errors.address}>
          <input
            id="address"
            className="input-field"
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </Field>
      </div>
      <Field id="city" label="City" error={errors.city}>
        <input
          id="city"
          className="input-field"
          value={data.city}
          onChange={(e) => update("city", e.target.value)}
        />
      </Field>
      <Field id="postalCode" label="Postal Code" error={errors.postalCode}>
        <input
          id="postalCode"
          className="input-field"
          value={data.postalCode}
          onChange={(e) => update("postalCode", e.target.value)}
        />
      </Field>
    </div>
  );
}

function StepPreferences({
  data,
  update,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field id="accountType" label="Preferred Account Type">
        <select
          id="accountType"
          className="input-field"
          value={data.accountType}
          onChange={(e) => update("accountType", e.target.value)}
        >
          <option>Basic</option>
          <option>Professional</option>
          <option>Premium</option>
        </select>
      </Field>
      <Field id="currency" label="Base Currency">
        <select
          id="currency"
          className="input-field"
          value={data.currency}
          onChange={(e) => update("currency", e.target.value)}
        >
          <option>USD</option>
          <option>EUR</option>
          <option>GBP</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field id="experience" label="Trading Experience">
          <select
            id="experience"
            className="input-field"
            value={data.experience}
            onChange={(e) => update("experience", e.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Experienced</option>
          </select>
        </Field>
      </div>
      <p className="sm:col-span-2 text-xs text-white/40">
        Final account terms (spreads, commission, leverage, minimum deposit) will be confirmed
        once verified account information is available. See our Account Types section for
        current placeholders.
      </p>
    </div>
  );
}

function StepKYC({
  data,
  update,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Field id="idType" label="Identity Document Type">
        <select
          id="idType"
          className="input-field"
          value={data.idType}
          onChange={(e) => update("idType", e.target.value)}
        >
          <option>Passport</option>
          <option>National ID Card</option>
          <option>Driver&apos;s License</option>
        </select>
      </Field>

      <div>
        <span className="label-field">Upload Document</span>
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center">
          <Icon name="lock" className="h-6 w-6 text-white/30" />
          <p className="text-sm text-white/50">
            Document upload will be available once a verified KYC provider is connected.
          </p>
          <button type="button" disabled className="btn-outline mt-2 cursor-not-allowed opacity-50">
            Choose File
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-royal-400/30 bg-royal-500/10 p-4 text-sm text-royal-200">
        <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          We only request identity information required for standard KYC/AML verification. No
          unnecessary sensitive data is collected on this form.
        </p>
      </div>
    </div>
  );
}

function StepConfirmation({
  data,
  update,
  errors,
}: {
  data: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  errors: Record<string, string>;
}) {
  const summary: { label: string; value: string }[] = [
    { label: "Name", value: `${data.firstName} ${data.lastName}`.trim() || "—" },
    { label: "Email", value: data.email || "—" },
    { label: "Phone", value: data.phone || "—" },
    { label: "Country", value: data.country || "—" },
    { label: "Account Type", value: data.accountType },
    { label: "Base Currency", value: data.currency },
    { label: "ID Document", value: data.idType },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 rounded-xl2 border border-white/10 bg-white/[0.02] p-6 sm:grid-cols-2">
        {summary.map((row) => (
          <div key={row.label}>
            <p className="text-[11px] uppercase tracking-wide text-white/40">{row.label}</p>
            <p className="text-sm font-medium text-white/85">{row.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-3 text-sm text-white/65">
          <input
            type="checkbox"
            checked={data.termsAccepted}
            onChange={(e) => update("termsAccepted", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-400"
          />
          <span>
            I have read and agree to the{" "}
            <a href="/legal/terms-conditions" className="text-gold-400 underline underline-offset-2">
              Terms &amp; Conditions
            </a>
            .
          </span>
        </label>
        {errors.termsAccepted ? <p className="text-xs text-rose-400">{errors.termsAccepted}</p> : null}

        <label className="flex items-start gap-3 text-sm text-white/65">
          <input
            type="checkbox"
            checked={data.privacyAccepted}
            onChange={(e) => update("privacyAccepted", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-400"
          />
          <span>
            I have read and agree to the{" "}
            <a href="/legal/privacy-policy" className="text-gold-400 underline underline-offset-2">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.privacyAccepted ? <p className="text-xs text-rose-400">{errors.privacyAccepted}</p> : null}

        <label className="flex items-start gap-3 text-sm text-white/65">
          <input
            type="checkbox"
            checked={data.riskAccepted}
            onChange={(e) => update("riskAccepted", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-400"
          />
          <span>
            I acknowledge the{" "}
            <a href="/legal/risk-disclosure" className="text-gold-400 underline underline-offset-2">
              Risk Disclosure
            </a>{" "}
            and understand that trading involves risk of loss.
          </span>
        </label>
        {errors.riskAccepted ? <p className="text-xs text-rose-400">{errors.riskAccepted}</p> : null}
      </div>
    </div>
  );
}
