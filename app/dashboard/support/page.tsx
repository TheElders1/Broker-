import type { Metadata } from "next";
import Icon from "@/components/Icon";
import { PageHeader, Widget } from "@/components/dashboard/DashboardWidgets";
import { CONTACT_PLACEHOLDERS } from "@/lib/data";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <div>
      <PageHeader title="Support" description="Get help with your account or the platform." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Widget title="Contact Support">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Icon name="mail" className="mt-0.5 h-4 w-4 text-gold-400" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Email</p>
                <p className="text-sm text-white/80">{CONTACT_PLACEHOLDERS.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="phone" className="mt-0.5 h-4 w-4 text-gold-400" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Phone</p>
                <p className="text-sm text-white/80">{CONTACT_PLACEHOLDERS.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="clock" className="mt-0.5 h-4 w-4 text-gold-400" />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Business Hours</p>
                <p className="text-sm text-white/80">{CONTACT_PLACEHOLDERS.hours}</p>
              </div>
            </div>
          </div>
        </Widget>

        <Widget title="Submit a Support Ticket">
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="topic" className="label-field">
                Topic
              </label>
              <select id="topic" className="input-field">
                <option>Account</option>
                <option>Deposits &amp; Withdrawals</option>
                <option>Platform</option>
                <option>Verification</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="details" className="label-field">
                Details
              </label>
              <textarea id="details" rows={4} className="input-field resize-none" />
            </div>
            <button type="submit" className="btn-gold w-fit" disabled>
              Submit Ticket
            </button>
            <p className="text-xs text-white/40">
              Support ticketing is not yet connected to a live customer support system.
            </p>
          </form>
        </Widget>
      </div>
    </div>
  );
}
