export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: "layout" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Account Requests", href: "/admin/requests", icon: "mail" },
];
