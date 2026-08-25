"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { createUser } from "@/lib/api/services/admin";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/lib/api/types";
import { COUNTRIES } from "@/lib/countries";
import { CURRENCIES } from "@/lib/currencies";

const ACCOUNT_TYPES: User["accountType"][] = ["Basic", "Professional", "Premium"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Experienced"];
const MIN_AGE = 18;

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

export default function CreateUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firstName, setFirstName] = useState(searchParams.get("firstName") ?? "");
  const [lastName, setLastName] = useState(searchParams.get("lastName") ?? "");
  const [dob, setDob] = useState(searchParams.get("dob") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [phone, setPhone] = useState(searchParams.get("phone") ?? "");
  const [address, setAddress] = useState(searchParams.get("address") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [postalCode, setPostalCode] = useState(searchParams.get("postalCode") ?? "");
  const [accountType, setAccountType] = useState<User["accountType"]>(
    (searchParams.get("accountType") as User["accountType"]) || "Basic"
  );
  const [currency, setCurrency] = useState(searchParams.get("currency") ?? "USD");
  const [experience, setExperience] = useState(searchParams.get("experience") ?? "Beginner");
  const [initialBalance, setInitialBalance] = useState("0");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromRequest = searchParams.get("fromRequest");
  const MIN_PASSWORD_LENGTH = 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!dob) {
      setError("Date of birth is required.");
      return;
    }
    const age = calculateAge(dob);
    if (age === null || age < MIN_AGE) {
      setError(`The client must be at least ${MIN_AGE} years old.`);
      return;
    }
    if (!country) {
      setError("Country of residence is required.");
      return;
    }
    if (!phone.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      setError("Phone, address, city, and postal code are all required.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const balance = Number(initialBalance);
    if (Number.isNaN(balance) || balance < 0) {
      setError("Enter a valid, non-negative initial balance.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createUser({
        firstName,
        lastName,
        email,
        password,
        accountType,
        initialBalanceUsd: balance,
        dateOfBirth: dob,
        country,
        phone,
        address,
        city,
        postalCode,
        currency,
        experience,
      });
      router.push("/admin/users");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create the user.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="glass-card max-w-2xl p-6 sm:p-8">
      {fromRequest ? (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-royal-400/30 bg-royal-500/10 p-3.5 text-sm text-royal-200">
          <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Pre-filled from an account request. Review the details before creating the account.</p>
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-300">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-base font-semibold text-white">Personal Information</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="label-field">
                First Name
              </label>
              <input
                id="firstName"
                className="input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="label-field">
                Last Name
              </label>
              <input
                id="lastName"
                className="input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="dob" className="label-field">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                className="input-field"
                value={dob}
                max={maxDobForMinAge()}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="country" className="label-field">
                Country of Residence
              </label>
              <select id="country" className="input-field" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
          <h2 className="font-display text-base font-semibold text-white">Contact Information</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="label-field">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="label-field">
                Phone Number
              </label>
              <input id="phone" type="tel" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="label-field">
                Street Address
              </label>
              <input id="address" className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <label htmlFor="city" className="label-field">
                City
              </label>
              <input id="city" className="input-field" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label htmlFor="postalCode" className="label-field">
                Postal Code
              </label>
              <input
                id="postalCode"
                className="input-field"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
          <h2 className="font-display text-base font-semibold text-white">Account Security</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="label-field">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="input-field pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label-field">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-white/40">
            Set the client&apos;s initial password directly and share it with them through a secure
            channel — they can change it later from Settings.
          </p>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
          <h2 className="font-display text-base font-semibold text-white">Account Preferences</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="accountType" className="label-field">
                Account Type
              </label>
              <select
                id="accountType"
                className="input-field"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as User["accountType"])}
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="initialBalance" className="label-field">
                Initial Balance (USD)
              </label>
              <input
                id="initialBalance"
                type="number"
                min="0"
                step="0.01"
                className="input-field"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="currency" className="label-field">
                Base Currency
              </label>
              <select id="currency" className="input-field" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="experience" className="label-field">
                Trading Experience
              </label>
              <select
                id="experience"
                className="input-field"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <Link href="/admin/users" className="btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn-gold" disabled={submitting}>
            {submitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
