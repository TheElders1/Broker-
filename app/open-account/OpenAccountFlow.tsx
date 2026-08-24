"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { register } from "@/lib/api/services/auth";
import { ApiError } from "@/lib/api/client";
import { COUNTRIES } from "@/lib/countries";
import { CURRENCIES } from "@/lib/currencies";

const MIN_AGE = 18;
const MIN_PASSWORD_LENGTH = 8;

function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

function maxDobForMinAge(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - MIN_AGE);
  return d.toISOString().slice(0, 10);
}

type FormData = {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  accountType: string;
  currency: string;
  experience: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  riskAccepted: boolean;
};

const initialData: FormData = {
  firstName: "",
  lastName: "",
  dob: "",
  country: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  accountType: "Basic",
  currency: "USD",
  experience: "Beginner",
  termsAccepted: false,
  privacyAccepted: false,
  riskAccepted: false,
};

function validate(data: FormData): Record<string, string> {
  const e: Record<string, string> = {};

  if (!data.firstName.trim()) e.firstName = "First name is required.";
  if (!data.lastName.trim()) e.lastName = "Last name is required.";
  if (!data.dob) {
    e.dob = "Date of birth is required.";
  } else {
    const age = calculateAge(data.dob);
    if (age === null) e.dob = "Enter a valid date of birth.";
    else if (age < MIN_AGE) e.dob = `You must be at least ${MIN_AGE} years old to open an account.`;
  }
  if (!data.country.trim()) e.country = "Country of residence is required.";

  if (!data.email.trim()) {
    e.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    e.email = "Enter a valid email address.";
  }
  if (!data.phone.trim()) e.phone = "Phone number is required.";
  if (!data.address.trim()) e.address = "Address is required.";
  if (!data.city.trim()) e.city = "City is required.";
  if (!data.postalCode.trim()) e.postalCode = "Postal code is required.";

  if (data.password.length < MIN_PASSWORD_LENGTH) {
    e.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (data.confirmPassword !== data.password) {
    e.confirmPassword = "Passwords do not match.";
  }

  if (!data.termsAccepted) e.termsAccepted = "You must accept the Terms & Conditions.";
  if (!data.privacyAccepted) e.privacyAccepted = "You must accept the Privacy Policy.";
  if (!data.riskAccepted) e.riskAccepted = "You must acknowledge the Risk Disclosure.";

  return e;
}

export default function OpenAccountFlow() {
  const router = useRouter();
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validate(data);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      document.getElementById(Object.keys(v)[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dob,
        country: data.country,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        accountType: data.accountType,
        currency: data.currency,
        experience: data.experience,
      });
      if (result.signedIn) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setAwaitingConfirmation(true);
      }
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Your account could not be created. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (awaitingConfirmation) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h2 className="font-display text-2xl font-semibold text-white">Confirm Your Email</h2>
        <p className="max-w-md text-sm leading-relaxed text-white/60">
          Your account has been created. This deployment still requires email confirmation before
          you can sign in — check your inbox for a confirmation link, then return to login.
        </p>
        <Link href="/login" className="btn-gold mt-2">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
      <FormSection title="Personal Information">
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
              max={maxDobForMinAge()}
              onChange={(e) => update("dob", e.target.value)}
            />
            <p className="mt-1.5 text-xs text-white/35">You must be at least {MIN_AGE} to open an account.</p>
          </Field>
          <Field id="country" label="Country of Residence" error={errors.country}>
            <select
              id="country"
              className="input-field"
              value={data.country}
              onChange={(e) => update("country", e.target.value)}
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </FormSection>

      <FormSection title="Contact Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="email" label="Email Address" error={errors.email}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input-field"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field id="phone" label="Phone Number" error={errors.phone}>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              className="input-field"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field id="address" label="Street Address" error={errors.address}>
              <input
                id="address"
                autoComplete="street-address"
                className="input-field"
                value={data.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </Field>
          </div>
          <Field id="city" label="City" error={errors.city}>
            <input
              id="city"
              autoComplete="address-level2"
              className="input-field"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </Field>
          <Field id="postalCode" label="Postal Code" error={errors.postalCode}>
            <input
              id="postalCode"
              autoComplete="postal-code"
              className="input-field"
              value={data.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Account Security">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="password" label="Password" error={errors.password}>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="input-field pr-11"
                value={data.password}
                onChange={(e) => update("password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon name="eye" className="h-4 w-4" />
              </button>
            </div>
          </Field>
          <Field id="confirmPassword" label="Confirm Password" error={errors.confirmPassword}>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="input-field"
              value={data.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Account Preferences">
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
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
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
      </FormSection>

      <FormSection title="Agreements">
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
              <Link href="/legal/terms-conditions" className="text-gold-400 underline underline-offset-2">
                Terms &amp; Conditions
              </Link>
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
              <Link href="/legal/privacy-policy" className="text-gold-400 underline underline-offset-2">
                Privacy Policy
              </Link>
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
              <Link href="/legal/risk-disclosure" className="text-gold-400 underline underline-offset-2">
                Risk Disclosure
              </Link>{" "}
              and understand that trading involves risk of loss.
            </span>
          </label>
          {errors.riskAccepted ? <p className="text-xs text-rose-400">{errors.riskAccepted}</p> : null}
        </div>
      </FormSection>

      {submitError ? <p className="text-center text-sm text-rose-400">{submitError}</p> : null}

      <button type="submit" className="btn-gold w-full sm:w-fit sm:self-center" disabled={submitting}>
        {submitting ? "Creating Account..." : "Create Account"}
        <Icon name="arrow" className="h-4 w-4" />
      </button>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 border-t border-white/10 pt-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
      {children}
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
