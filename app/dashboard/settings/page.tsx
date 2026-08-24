import type { Metadata } from "next";
import { PageHeader, Widget } from "@/components/dashboard/DashboardWidgets";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your profile and account preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Widget title="Profile Information">
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="fullName" className="label-field">
                Full Name
              </label>
              <input id="fullName" className="input-field" placeholder="Your name" disabled />
            </div>
            <div>
              <label htmlFor="settingsEmail" className="label-field">
                Email Address
              </label>
              <input id="settingsEmail" type="email" className="input-field" placeholder="you@example.com" disabled />
            </div>
            <button type="submit" className="btn-outline w-fit cursor-not-allowed opacity-50" disabled>
              Save Changes
            </button>
          </form>
        </Widget>

        <Widget title="Security">
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="currentPassword" className="label-field">
                Current Password
              </label>
              <input id="currentPassword" type="password" className="input-field" disabled />
            </div>
            <div>
              <label htmlFor="newPassword" className="label-field">
                New Password
              </label>
              <input id="newPassword" type="password" className="input-field" disabled />
            </div>
            <button type="submit" className="btn-outline w-fit cursor-not-allowed opacity-50" disabled>
              Update Password
            </button>
          </form>
        </Widget>
      </div>

      <p className="mt-6 text-xs text-white/40">
        Account settings are not yet connected to a live authentication backend.
      </p>
    </div>
  );
}
