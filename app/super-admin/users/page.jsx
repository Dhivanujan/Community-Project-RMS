"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Search, Plus, Edit3, Trash2, KeyRound, ShieldCheck, ShieldOff, MoreVertical, X, Eye, EyeOff, ChevronDown, Filter, RefreshCw } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/Skeleton";

const ROLES = ["SUPER_ADMIN", "STAFF", "STUDENT"];
const ROLE_BADGE = { SUPER_ADMIN: "rose", STAFF: "purple", STUDENT: "info" };
const DEPARTMENTS = ["Software Engineering", "Computing and Information System", "Data Science"];

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showResetPw, setShowResetPw] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tempPw, setTempPw] = useState("");
  const [showTempPw, setShowTempPw] = useState(false);
  const [createForm, setCreateForm] = useState({ fullName: "", username: "", email: "", role: "STAFF", department: "", password: "", studentId: "", enrollmentYear: "" });
  const [editForm, setEditForm] = useState({});
  const [resetPwForm, setResetPwForm] = useState({ newPassword: "" });

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10, search, ...(roleFilter && { role: roleFilter }), ...(statusFilter && { status: statusFilter }) });
      const res = await fetch(`/api/super-admin/users?${params}`);
      const data = await res.json();
      if (res.ok) { setUsers(data.users); setPagination(data.pagination); }
    } catch { toast.error("Failed to fetch users"); }
    finally { setLoading(false); }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.fullName || !createForm.username) return toast.error("Name and username required");
    if (createForm.role === "STUDENT" && (!createForm.studentId || !createForm.enrollmentYear)) return toast.error("Student ID and Enrollment Year required for students");
    setSaving(true);
    try {
      const res = await fetch("/api/super-admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(createForm) });
      const data = await res.json();
      if (res.ok) {
        toast.success("User created successfully");
        setTempPw(data.tempPassword); setShowTempPw(true);
        setShowCreate(false); setCreateForm({ fullName: "", username: "", email: "", role: "STAFF", department: "", password: "", studentId: "", enrollmentYear: "" });
        fetchUsers();
      } else toast.error(data.message);
    } catch { toast.error("Failed to create user"); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/super-admin/users/${selectedUser.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
      const data = await res.json();
      if (res.ok) { toast.success("User updated"); setShowEdit(false); fetchUsers(); }
      else toast.error(data.message);
    } catch { toast.error("Failed to update user"); }
    finally { setSaving(false); }
  };

  const handleResetPassword = async () => {
    if (!resetPwForm.newPassword || resetPwForm.newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setSaving(true);
    try {
      const res = await fetch(`/api/super-admin/users/${selectedUser.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ newPassword: resetPwForm.newPassword }) });
      if (res.ok) { toast.success("Password reset successfully"); setShowResetPw(false); setResetPwForm({ newPassword: "" }); }
      else toast.error("Failed to reset password");
    } catch { toast.error("Failed to reset password"); }
    finally { setSaving(false); }
  };

  const handleToggleStatus = async (user) => {
    try {
      const res = await fetch(`/api/super-admin/users/${user.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !user.active }) });
      if (res.ok) { toast.success(`User ${user.active ? "deactivated" : "activated"}`); fetchUsers(); }
    } catch { toast.error("Failed to update status"); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/super-admin/users/${selectedUser.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) { toast.success("User deleted"); setShowDelete(false); fetchUsers(); }
      else toast.error(data.message);
    } catch { toast.error("Failed to delete user"); }
    finally { setSaving(false); }
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setEditForm({ username: user.username, email: user.email || "", role: user.role, department: user.department || "", active: user.active });
    setShowEdit(true); setActionMenu(null);
  };

  const getDisplayName = (u) => {
    if (u.staffProfile) return `${u.staffProfile.firstName} ${u.staffProfile.lastName}`;
    if (u.studentProfile) return `${u.studentProfile.firstName} ${u.studentProfile.lastName}`;
    return u.username;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage system access, roles, and security policies.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm shadow-rose-500/20">
          <Plus className="w-4 h-4" /> Create User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20">
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={() => fetchUsers()} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Table */}
        {loading ? <div className="p-4"><TableSkeleton rows={5} cols={6} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
                <tr>
                  <th className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800">User</th>
                  <th className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800">Role</th>
                  <th className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800">Status</th>
                  <th className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 hidden md:table-cell">Last Login</th>
                  <th className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 hidden lg:table-cell">Created</th>
                  <th className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-16 text-center">
                    <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 dark:text-slate-500 text-sm">No users found</p>
                  </td></tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs uppercase">
                          {user.username.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{getDisplayName(user)}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{user.email || user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5"><Badge variant={ROLE_BADGE[user.role] || "default"}>{user.role.replace("_", " ")}</Badge></td>
                    <td className="px-6 py-3.5">
                      <button onClick={() => handleToggleStatus(user)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${user.active ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100" : "text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100"}`}>
                        {user.active ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                        {user.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 hidden md:table-cell text-slate-500 dark:text-slate-400 text-xs">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</td>
                    <td className="px-6 py-3.5 hidden lg:table-cell text-slate-500 dark:text-slate-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {actionMenu === user.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setActionMenu(null)} />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-40 animate-fadeIn">
                              <button onClick={() => openEdit(user)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <Edit3 className="w-3.5 h-3.5" /> Edit User
                              </button>
                              <button onClick={() => { setSelectedUser(user); setShowResetPw(true); setActionMenu(null); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <KeyRound className="w-3.5 h-3.5" /> Reset Password
                              </button>
                              <button onClick={() => { setSelectedUser(user); setShowDelete(true); setActionMenu(null); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" /> Delete User
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-slate-100 dark:border-slate-800 px-4">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => fetchUsers(p)} totalItems={pagination.total} itemsPerPage={pagination.limit} />
        </div>
      </div>

      {/* Create User Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New User" description="Add a new staff or admin account to the system.">
        <form onSubmit={handleCreate} className="space-y-4">
          {[{ l: "Full Name", k: "fullName", p: "Enter full name", r: true },
            { l: "Username", k: "username", p: "Enter username", r: true },
            { l: "Email", k: "email", p: "Enter email address", t: "email" },
            { l: "Department", k: "department", p: "Select department" },
            { l: "Temporary Password", k: "password", p: "Auto-generated if empty" }
          ].map(f => (
            <div key={f.k}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.l} {f.r && <span className="text-red-500">*</span>}</label>
              {f.k === "department" ? (
                <select value={createForm[f.k]} onChange={(e) => setCreateForm(p => ({ ...p, [f.k]: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400">
                  <option value="">Select a department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              ) : (
                <input type={f.t || "text"} placeholder={f.p} value={createForm[f.k]} onChange={(e) => setCreateForm(p => ({ ...p, [f.k]: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role <span className="text-red-500">*</span></label>
            <select value={createForm.role} onChange={(e) => setCreateForm(p => ({ ...p, role: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20">
              {ROLES.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
            </select>
          </div>
          {createForm.role === "STUDENT" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Student ID <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter student ID" value={createForm.studentId} onChange={(e) => setCreateForm(p => ({ ...p, studentId: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Enrollment Year <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. 2024" value={createForm.enrollmentYear} onChange={(e) => setCreateForm(p => ({ ...p, enrollmentYear: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" />
              </div>
            </>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50">
              {saving ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit User" description={`Editing ${selectedUser?.username}`}>
        <form onSubmit={handleEdit} className="space-y-4">
          {[{ l: "Username", k: "username" }, { l: "Email", k: "email", t: "email" }, { l: "Department", k: "department" }].map(f => (
            <div key={f.k}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.l}</label>
              {f.k === "department" ? (
                <select value={editForm[f.k] || ""} onChange={(e) => setEditForm(p => ({ ...p, [f.k]: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400">
                  <option value="">Select a department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              ) : (
                <input type={f.t || "text"} value={editForm[f.k] || ""} onChange={(e) => setEditForm(p => ({ ...p, [f.k]: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
            <select value={editForm.role || ""} onChange={(e) => setEditForm(p => ({ ...p, role: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20">
              {ROLES.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEdit(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={showResetPw} onClose={() => setShowResetPw(false)} title="Reset Password" description={`Reset password for ${selectedUser?.username}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
            <input type="password" placeholder="Enter new password" value={resetPwForm.newPassword} onChange={(e) => setResetPwForm({ newPassword: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowResetPw(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
            <button onClick={handleResetPassword} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50">
              {saving ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Temp Password Display */}
      <Modal isOpen={showTempPw} onClose={() => { setShowTempPw(false); setTempPw(""); }} title="User Created Successfully" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">The temporary password is:</p>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 font-mono text-lg font-bold text-slate-800 dark:text-white select-all border border-slate-200 dark:border-slate-700">{tempPw}</div>
          <p className="text-xs text-slate-400">Please share this securely. The user will be required to change it on first login.</p>
          <button onClick={() => { navigator.clipboard.writeText(tempPw); toast.success("Copied to clipboard"); }} className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors">Copy Password</button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Delete User" message={`This will permanently delete "${selectedUser?.username}". This action cannot be undone.`} confirmText="Delete" variant="danger" loading={saving} />
    </div>
  );
}
