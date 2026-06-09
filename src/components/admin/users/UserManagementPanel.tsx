"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  adminListUsers,
  adminCreateUser,
  adminGetUser,
  adminUpdateUser,
  adminBulkAction,
  adminExportUsersUrl,
  adminListCustomers,
  adminGetAuditLogs,
  type AdminUser,
  type AuditLog,
  type UserDetailResponse,
} from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

// ── Helpers ───────────────────────────────────────────────────────────────

const ROLES = ["customer", "super_admin", "order_manager", "inventory_manager", "content_manager", "marketing_manager"];
const STATUSES = ["active", "inactive", "blocked"];

const ROLE_LABELS: Record<string, string> = {
  customer: "Customer",
  super_admin: "Super Admin",
  order_manager: "Order Manager",
  inventory_manager: "Inventory Manager",
  content_manager: "Content Manager",
  marketing_manager: "Marketing Manager",
};

const ROLE_COLORS: Record<string, string> = {
  customer: "bg-gray-100 text-gray-600 border-gray-200",
  super_admin: "bg-purple-50 text-purple-700 border-purple-200",
  order_manager: "bg-blue-50 text-blue-700 border-blue-200",
  inventory_manager: "bg-emerald-50 text-emerald-700 border-emerald-200",
  content_manager: "bg-amber-50 text-amber-700 border-amber-200",
  marketing_manager: "bg-pink-50 text-pink-700 border-pink-200",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-amber-50 text-amber-700 border-amber-200",
  blocked: "bg-red-50 text-red-600 border-red-200",
};

function Badge({ text, colorClass }: { text: string; colorClass: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorClass}`}>
      {text}
    </span>
  );
}

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Add User Modal ─────────────────────────────────────────────────────────

function AddUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", role: "customer", tempPassword: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!form.name || !form.email || !form.tempPassword) {
      setErr("Name, email and temporary password are required.");
      return;
    }
    setSaving(true);
    const res = await adminCreateUser(form);
    setSaving(false);
    if (res.error) { setErr(res.error); return; }
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-[#FFFDF9] rounded-3xl shadow-2xl border w-full max-w-md p-8 space-y-6" style={{ borderColor: "#E8D5BC" }} onClick={e => e.stopPropagation()}>
        <div>
          <h3 className="font-serif font-bold text-[#6B3E26] text-xl">Add New User</h3>
          <p className="text-xs text-[#7A5C45] mt-1">User will receive access with the temporary password.</p>
        </div>
        {err && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100">{err}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Roshini Rao" },
            { label: "Email Address", key: "email", type: "email", placeholder: "roshini@example.com" },
            { label: "Phone (optional)", key: "phoneNumber", type: "text", placeholder: "9876543210" },
            { label: "Temporary Password", key: "tempPassword", type: "password", placeholder: "Min 8 characters" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={(form as Record<string, string>)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26] transition-colors"
                style={{ borderColor: "#E8D5BC" }}
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Role</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26] transition-colors"
              style={{ borderColor: "#E8D5BC" }}
            >
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full border text-sm font-semibold text-[#6B3E26] hover:bg-[#F5E9DA] transition-colors cursor-pointer" style={{ borderColor: "#E8D5BC" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-full bg-[#6B3E26] text-[#F5E9DA] text-sm font-bold hover:bg-[#4e2c18] transition-colors cursor-pointer disabled:opacity-60">
              {saving ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit User Modal ────────────────────────────────────────────────────────

function EditUserModal({ user, onClose, onSaved }: { user: AdminUser; onClose: () => void; onSaved: () => void }) {
  const { user: adminUser } = useAuth();
  const [form, setForm] = useState({ role: user.role || "customer", status: user.status || "active", phoneNumber: String(user.phoneNumber || "") });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const isSelf = adminUser?._id === user._id;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    const res = await adminUpdateUser(user._id, { role: form.role, status: form.status, phoneNumber: form.phoneNumber });
    setSaving(false);
    if (res.error) { setErr(res.error); return; }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-[#FFFDF9] rounded-3xl shadow-2xl border w-full max-w-md p-8 space-y-6" style={{ borderColor: "#E8D5BC" }} onClick={e => e.stopPropagation()}>
        <div>
          <h3 className="font-serif font-bold text-[#6B3E26] text-xl">Edit User</h3>
          <p className="text-xs text-[#7A5C45] mt-1">{user.name} — {user.email}</p>
        </div>
        {err && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100">{err}</div>}
        {isSelf && <div className="bg-amber-50 text-amber-700 text-xs p-3 rounded-xl border border-amber-200">⚠️ You cannot demote or block your own account.</div>}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Role</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              disabled={isSelf}
              className="w-full px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26] transition-colors disabled:opacity-50"
              style={{ borderColor: "#E8D5BC" }}
            >
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Account Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              disabled={isSelf}
              className="w-full px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26] transition-colors disabled:opacity-50"
              style={{ borderColor: "#E8D5BC" }}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Phone Number</label>
            <input
              type="text"
              value={form.phoneNumber}
              onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26] transition-colors"
              style={{ borderColor: "#E8D5BC" }}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-full border text-sm font-semibold text-[#6B3E26] hover:bg-[#F5E9DA] transition-colors cursor-pointer" style={{ borderColor: "#E8D5BC" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-full bg-[#6B3E26] text-[#F5E9DA] text-sm font-bold hover:bg-[#4e2c18] transition-colors cursor-pointer disabled:opacity-60">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── User Detail Slide-Over ──────────────────────────────────────────────────

function UserDetailDrawer({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [data, setData] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetUser(userId).then(d => { setData(d); setLoading(false); });
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-[#FFFDF9] h-full overflow-y-auto shadow-2xl border-l flex flex-col" style={{ borderColor: "#E8D5BC" }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#FFFDF9]/95 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between z-10" style={{ borderColor: "#E8D5BC" }}>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#7A5C45] tracking-wider block">User Detail</span>
            <h3 className="font-serif font-bold text-[#6B3E26] text-base">
              {loading ? "Loading…" : data?.user?.name || "Unknown"}
            </h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-[#E8D5BC] flex items-center justify-center text-[#6B3E26] hover:bg-[#6B3E26]/10 transition-colors text-sm cursor-pointer">✕</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-[#7A5C45]">Loading…</div>
        ) : data?.user ? (
          <div className="p-6 space-y-6">
            {/* Profile */}
            <div className="bg-[#FDF6EC] border rounded-2xl p-5 space-y-3" style={{ borderColor: "#E8D5BC" }}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Profile</h4>
              {[
                { label: "Name", value: data.user.name },
                { label: "Email", value: data.user.email },
                { label: "Phone", value: data.user.phoneNumber || "—" },
                { label: "Role", value: <Badge text={ROLE_LABELS[data.user.role] || data.user.role} colorClass={ROLE_COLORS[data.user.role] || ""} /> },
                { label: "Status", value: <Badge text={data.user.status} colorClass={STATUS_COLORS[data.user.status] || ""} /> },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-[#7A5C45] text-xs font-medium">{label}</span>
                  <span className="font-semibold text-[#2C1A0E] text-xs">{value}</span>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div className="bg-[#FDF6EC] border rounded-2xl p-5 space-y-3" style={{ borderColor: "#E8D5BC" }}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Activity</h4>
              {[
                { label: "Registered", value: formatDate(data.user.createdAt) },
                { label: "Last Login", value: formatDate(data.user.lastLogin) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-[#7A5C45] text-xs font-medium">{label}</span>
                  <span className="font-semibold text-[#2C1A0E] text-xs">{value}</span>
                </div>
              ))}
            </div>

            {/* Order Stats */}
            <div className="bg-[#FDF6EC] border rounded-2xl p-5 space-y-3" style={{ borderColor: "#E8D5BC" }}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Orders</h4>
              {[
                { label: "Total Orders", value: data.orderStats.totalOrders },
                { label: "Total Spent", value: `₹${data.orderStats.totalSpent}` },
                { label: "Latest Order", value: data.orderStats.latestOrder ? `₹${data.orderStats.latestOrder.amount} · ${data.orderStats.latestOrder.status}` : "No orders" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-[#7A5C45] text-xs font-medium">{label}</span>
                  <span className="font-semibold text-[#2C1A0E] text-xs">{value}</span>
                </div>
              ))}
            </div>

            {/* Saved Addresses (Read-only) */}
            {data.user.addresses && data.user.addresses.length > 0 && (
              <div className="bg-[#FDF6EC] border rounded-2xl p-5 space-y-3" style={{ borderColor: "#E8D5BC" }}>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Saved Addresses ({data.user.addresses.length})</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {data.user.addresses.map((addr: any, idx: number) => (
                    <div key={idx} className="bg-white border p-3 rounded-xl text-xs space-y-1" style={{ borderColor: "#E8D5BC" }}>
                      <div className="flex justify-between items-start">
                        <strong className="text-[#6B3E26]">{addr.type} {addr.isDefault && <span className="text-[9px] bg-[#6B3E26] text-white px-1.5 py-0.5 rounded-full ml-1">Default</span>}</strong>
                        <span className="text-gray-500">{addr.mobileNumber}</span>
                      </div>
                      <p className="text-gray-600">{addr.addressLine1}, {addr.city}, {addr.state} {addr.pincode}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences & Settings */}
            <div className="bg-[#FDF6EC] border rounded-2xl p-5 space-y-4" style={{ borderColor: "#E8D5BC" }}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45]">Account Preferences</h4>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#7A5C45] text-xs font-medium">Dietary Prefs</span>
                <span className="font-semibold text-[#2C1A0E] text-xs">
                  {data.user.preferences?.dietaryPreferences?.length > 0 ? data.user.preferences.dietaryPreferences.join(", ") : "None"}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#7A5C45] text-xs font-medium">Language</span>
                <span className="font-semibold text-[#2C1A0E] text-xs">{data.user.preferences?.preferredLanguage || "English"}</span>
              </div>
              
              <div className="pt-2 border-t" style={{ borderColor: "#E8D5BC" }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C45] block mb-2">Communication Settings</span>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <Badge text={`Email: ${data.user.notifications?.email?.promotions ? "ON" : "OFF"}`} colorClass={data.user.notifications?.email?.promotions ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"} />
                  <Badge text={`SMS: ${data.user.notifications?.sms?.orders ? "ON" : "OFF"}`} colorClass={data.user.notifications?.sms?.orders ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"} />
                  <Badge text={`WhatsApp: ${data.user.notifications?.whatsapp?.orders ? "ON" : "OFF"}`} colorClass={data.user.notifications?.whatsapp?.orders ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-red-500">User not found.</div>
        )}
      </div>
    </div>
  );
}

// ── Bulk Confirm Modal ─────────────────────────────────────────────────────

function BulkConfirmModal({
  count, action, onConfirm, onClose,
}: { count: number; action: string; onConfirm: () => void; onClose: () => void }) {
  const actionLabel = { activate: "Activate", deactivate: "Deactivate", block: "Block" }[action] || action;
  const danger = action === "block";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-[#FFFDF9] rounded-3xl shadow-2xl border w-full max-w-sm p-8 space-y-5 text-center" style={{ borderColor: "#E8D5BC" }} onClick={e => e.stopPropagation()}>
        <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center text-xl ${danger ? "bg-red-50" : "bg-amber-50"}`}>
          {danger ? "🚫" : "⚠️"}
        </div>
        <div>
          <h3 className="font-serif font-bold text-[#6B3E26] text-lg">{actionLabel} {count} User{count !== 1 ? "s" : ""}?</h3>
          <p className="text-xs text-[#7A5C45] mt-1">This action will be recorded in the audit log.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full border text-sm font-semibold text-[#6B3E26] hover:bg-[#F5E9DA] transition-colors cursor-pointer" style={{ borderColor: "#E8D5BC" }}>Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer ${danger ? "bg-red-600 text-white hover:bg-red-700" : "bg-[#6B3E26] text-[#F5E9DA] hover:bg-[#4e2c18]"}`}>{actionLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Audit Logs Tab ─────────────────────────────────────────────────────────

function AuditLogsTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    const res = await adminGetAuditLogs({ page: p, limit: 25 });
    setLogs(res.logs || []);
    setTotalPages(res.totalPages || 1);
    setLoading(false);
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const ACTION_EMOJI: Record<string, string> = {
    USER_CREATED: "✅", USER_UPDATED: "✏️", USER_BLOCKED: "🚫",
    USER_ACTIVATED: "🟢", USER_DEACTIVATED: "⏸️", ROLE_CHANGED: "🔄",
    PASSWORD_RESET: "🔑", LOGIN: "🔓", LOGIN_FAILED: "❌", BULK_ACTION: "⚡",
  };

  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-[#6B3E26] text-xl">Audit Log</h3>
      {loading ? (
        <div className="text-center py-12 text-sm text-[#7A5C45]">Loading logs…</div>
      ) : (
        <>
          <div className="bg-[#FDF6EC] border rounded-3xl overflow-hidden" style={{ borderColor: "#E8D5BC" }}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Admin</th>
                  <th className="px-5 py-3">Entity</th>
                  <th className="px-5 py-3">Change</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-[#7A5C45]">No audit logs yet.</td></tr>
                ) : logs.map(log => {
                  const admin = typeof log.adminId === "object" ? log.adminId : null;
                  return (
                    <tr key={log._id} className="border-b hover:bg-[#F5E9DA]/30 transition-colors" style={{ borderColor: "#E8D5BC" }}>
                      <td className="px-5 py-3 font-semibold text-[#6B3E26]">
                        <span className="mr-1">{ACTION_EMOJI[log.action] || "📝"}</span>
                        {log.action.replace(/_/g, " ")}
                      </td>
                      <td className="px-5 py-3 text-[#7A5C45]">{admin ? admin.name : "—"}</td>
                      <td className="px-5 py-3 text-[#7A5C45]">{log.entityType}{log.entityId ? ` #${log.entityId.slice(-6)}` : ""}</td>
                      <td className="px-5 py-3 text-[#7A5C45] max-w-[160px] truncate">
                        {log.newValue ? JSON.stringify(log.newValue).slice(0, 50) : "—"}
                      </td>
                      <td className="px-5 py-3 text-[#7A5C45]">{formatDate(log.timestamp)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-[#7A5C45]">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-1.5 rounded-full border hover:bg-[#F5E9DA] transition-colors disabled:opacity-40 cursor-pointer" style={{ borderColor: "#E8D5BC" }}>← Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-1.5 rounded-full border hover:bg-[#F5E9DA] transition-colors disabled:opacity-40 cursor-pointer" style={{ borderColor: "#E8D5BC" }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Panel ─────────────────────────────────────────────────────────────

type SubTab = "all_users" | "customers" | "audit_logs";

export default function UserManagementPanel() {
  const { hasRole } = useAuth();
  const isSuperAdmin = hasRole(["super_admin"]);

  const [subTab, setSubTab] = useState<SubTab>("all_users");

  // Users list state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Customers state
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [customerFilter, setCustomerFilter] = useState<"recent" | "top" | "inactive">("recent");
  const [customerLoading, setCustomerLoading] = useState(false);

  // Selections + bulk
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<"activate" | "deactivate" | "block" | "">("");
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState("");
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadUsers = useCallback(async (p = 1) => {
    setLoading(true);
    const res = await adminListUsers({ page: p, limit: 20, search, role: roleFilter, status: statusFilter });
    setUsers(res.users || []);
    setTotal(res.total || 0);
    setTotalPages(res.totalPages || 1);
    setLoading(false);
    setSelected(new Set());
  }, [search, roleFilter, statusFilter]);

  const loadCustomers = useCallback(async () => {
    setCustomerLoading(true);
    const res = await adminListCustomers({ filter: customerFilter, limit: 20 });
    setCustomers(res.customers || []);
    setCustomerLoading(false);
  }, [customerFilter]);

  useEffect(() => { if (subTab === "all_users") loadUsers(page); }, [subTab, page, loadUsers]);
  useEffect(() => { if (subTab === "customers") loadCustomers(); }, [subTab, loadCustomers]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); loadUsers(1); }, 400);
    return () => clearTimeout(timer);
  }, [search, roleFilter, statusFilter]); // eslint-disable-line

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === users.length) { setSelected(new Set()); }
    else { setSelected(new Set(users.map(u => u._id))); }
  };

  const handleBulkConfirm = async () => {
    if (!bulkAction) return;
    setBulkLoading(true);
    const res = await adminBulkAction(Array.from(selected), bulkAction);
    setBulkLoading(false);
    setShowBulkConfirm(false);
    setBulkAction("");
    if (res.success) { showToast(`✅ ${res.affected} user(s) ${bulkAction}d successfully.`); loadUsers(page); }
    else showToast("❌ " + (res.error || "Bulk action failed."));
  };

  const subTabs: { key: SubTab; label: string; show?: boolean }[] = [
    { key: "all_users", label: "👥 All Users" },
    { key: "customers", label: "🛒 Customers" },
    { key: "audit_logs", label: "📋 Audit Logs", show: isSuperAdmin },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1A0E] text-[#F5E9DA] text-sm px-6 py-3 rounded-2xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold font-serif text-[#6B3E26]">User Management</h2>
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddUser(true)}
            className="px-5 py-2.5 bg-[#6B3E26] text-[#F5E9DA] text-xs font-bold rounded-full hover:bg-[#4e2c18] transition-colors cursor-pointer"
          >
            + Add User
          </button>
        )}
      </div>

      {/* Sub-tab navigation */}
      <div className="flex gap-2 flex-wrap">
        {subTabs.filter(t => t.show !== false).map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${subTab === t.key ? "bg-[#6B3E26] text-[#F5E9DA]" : "bg-[#FDF6EC] text-[#7A5C45] hover:bg-[#F5E9DA] border"}`}
            style={{ borderColor: subTab !== t.key ? "#E8D5BC" : undefined }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ALL USERS TAB ── */}
      {subTab === "all_users" && (
        <div className="space-y-5">
          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26] transition-colors"
              style={{ borderColor: "#E8D5BC" }}
            />
            <select
              value={roleFilter}
              onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26] transition-colors"
              style={{ borderColor: "#E8D5BC" }}
            >
              <option value="">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:border-[#6B3E26] transition-colors"
              style={{ borderColor: "#E8D5BC" }}
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            {isSuperAdmin && (
              <a
                href={adminExportUsersUrl({ role: roleFilter, status: statusFilter })}
                className="px-4 py-2.5 rounded-xl border bg-white text-xs font-semibold text-[#6B3E26] hover:bg-[#F5E9DA] transition-colors"
                style={{ borderColor: "#E8D5BC" }}
              >
                ⬇ Export CSV
              </a>
            )}
          </div>

          {/* Bulk Actions */}
          {isSuperAdmin && selected.size > 0 && (
            <div className="flex items-center gap-3 bg-[#FDF6EC] border p-4 rounded-2xl" style={{ borderColor: "#E8D5BC" }}>
              <span className="text-xs font-semibold text-[#6B3E26]">{selected.size} selected</span>
              {(["activate", "deactivate", "block"] as const).map(action => (
                <button
                  key={action}
                  onClick={() => { setBulkAction(action); setShowBulkConfirm(true); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${action === "block" ? "border-red-200 text-red-600 hover:bg-red-50" : "border-[#E8D5BC] text-[#6B3E26] hover:bg-[#F5E9DA]"}`}
                >
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Users Table */}
          <div className="bg-[#FDF6EC] border rounded-3xl overflow-hidden" style={{ borderColor: "#E8D5BC" }}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
                  {isSuperAdmin && (
                    <th className="px-4 py-3">
                      <input type="checkbox" checked={selected.size === users.length && users.length > 0} onChange={toggleSelectAll} className="cursor-pointer" />
                    </th>
                  )}
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-sm text-[#7A5C45]">Loading users…</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-sm text-[#7A5C45]">No users found.</td></tr>
                ) : users.map(u => (
                  <tr key={u._id} className="border-b hover:bg-[#F5E9DA]/30 transition-colors" style={{ borderColor: "#E8D5BC" }}>
                    {isSuperAdmin && (
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(u._id)} onChange={() => toggleSelect(u._id)} className="cursor-pointer" />
                      </td>
                    )}
                    <td className="px-4 py-3 font-semibold text-[#6B3E26]">{u.name}</td>
                    <td className="px-4 py-3 text-[#7A5C45]">{u.email}</td>
                    <td className="px-4 py-3 text-[#7A5C45]">{u.phoneNumber || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge text={ROLE_LABELS[u.role] || u.role} colorClass={ROLE_COLORS[u.role] || "bg-gray-100 text-gray-600 border-gray-200"} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge text={u.status} colorClass={STATUS_COLORS[u.status] || ""} />
                    </td>
                    <td className="px-4 py-3 text-[#7A5C45]">{formatDate(u.lastLogin)}</td>
                    <td className="px-4 py-3 text-[#7A5C45]">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setDetailUserId(u._id)}
                          className="text-[10px] px-3 py-1 rounded-full border text-[#6B3E26] hover:bg-[#F5E9DA] transition-colors cursor-pointer"
                          style={{ borderColor: "#E8D5BC" }}
                        >
                          View
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => setEditUser(u)}
                            className="text-[10px] px-3 py-1 rounded-full border text-[#6B3E26] hover:bg-[#F5E9DA] transition-colors cursor-pointer"
                            style={{ borderColor: "#E8D5BC" }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-[#7A5C45]">
            <span>{total} total users</span>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-1.5 rounded-full border hover:bg-[#F5E9DA] transition-colors disabled:opacity-40 cursor-pointer" style={{ borderColor: "#E8D5BC" }}>← Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-1.5 rounded-full border hover:bg-[#F5E9DA] transition-colors disabled:opacity-40 cursor-pointer" style={{ borderColor: "#E8D5BC" }}>Next →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOMERS TAB ── */}
      {subTab === "customers" && (
        <div className="space-y-5">
          <div className="flex gap-2">
            {(["recent", "top", "inactive"] as const).map(f => (
              <button
                key={f}
                onClick={() => setCustomerFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${customerFilter === f ? "bg-[#6B3E26] text-[#F5E9DA]" : "bg-[#FDF6EC] text-[#7A5C45] border hover:bg-[#F5E9DA]"}`}
                style={{ borderColor: customerFilter !== f ? "#E8D5BC" : undefined }}
              >
                {f === "recent" ? "🕐 Recent" : f === "top" ? "⭐ Top Spenders" : "💤 Inactive"}
              </button>
            ))}
          </div>

          <div className="bg-[#FDF6EC] border rounded-3xl overflow-hidden" style={{ borderColor: "#E8D5BC" }}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-[10px] uppercase font-bold text-[#7A5C45] bg-[#FDF6EC]" style={{ borderColor: "#E8D5BC" }}>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Status</th>
                  {customerFilter === "top" && <><th className="px-5 py-3 text-right">Orders</th><th className="px-5 py-3 text-right">Total Spent</th></>}
                  <th className="px-5 py-3">Last Login</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customerLoading ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#7A5C45]">Loading customers…</td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#7A5C45]">No customers found.</td></tr>
                ) : customers.map((c: any) => (
                  <tr key={c._id} className="border-b hover:bg-[#F5E9DA]/30 transition-colors" style={{ borderColor: "#E8D5BC" }}>
                    <td className="px-5 py-3 font-semibold text-[#6B3E26]">{c.name}</td>
                    <td className="px-5 py-3 text-[#7A5C45]">{c.email}</td>
                    <td className="px-5 py-3"><Badge text={c.status} colorClass={STATUS_COLORS[c.status] || ""} /></td>
                    {customerFilter === "top" && (
                      <>
                        <td className="px-5 py-3 text-right font-semibold text-[#6B3E26]">{c.totalOrders}</td>
                        <td className="px-5 py-3 text-right font-semibold text-[#6B3E26]">₹{c.totalSpent}</td>
                      </>
                    )}
                    <td className="px-5 py-3 text-[#7A5C45]">{formatDate(c.lastLogin)}</td>
                    <td className="px-5 py-3 text-[#7A5C45]">{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── AUDIT LOGS TAB ── */}
      {subTab === "audit_logs" && isSuperAdmin && <AuditLogsTab />}

      {/* ── Modals ── */}
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onCreated={() => loadUsers(1)} />}
      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={() => loadUsers(page)} />}
      {detailUserId && <UserDetailDrawer userId={detailUserId} onClose={() => setDetailUserId(null)} />}
      {showBulkConfirm && bulkAction && (
        <BulkConfirmModal
          count={selected.size}
          action={bulkAction}
          onConfirm={handleBulkConfirm}
          onClose={() => { setShowBulkConfirm(false); setBulkAction(""); }}
        />
      )}
      {bulkLoading && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"><div className="bg-white rounded-2xl p-8 shadow-xl text-sm font-semibold text-[#6B3E26]">Processing…</div></div>}
    </div>
  );
}
