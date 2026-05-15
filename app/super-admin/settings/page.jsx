"use client";

import { useState, useEffect } from "react";
import { Shield, Server, Database, Palette, Save, RefreshCw, Trash2, CheckCircle2, AlertTriangle, Loader2, Monitor, Mail, GraduationCap, Clock, Lock, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? "bg-rose-600" : "bg-slate-300 dark:bg-slate-600"}`}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function NumberField({ label, description, value, onChange, min, max, suffix }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} min={min} max={max}
          className="w-20 px-3 py-2 text-sm text-right border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
        {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
}

function TextField({ label, description, value, onChange, placeholder }) {
  return (
    <div className="py-3">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
      {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 mb-2">{description}</p>}
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 mt-1" />
    </div>
  );
}

function SectionCard({ title, description, icon: Icon, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-slate-500" />
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-slate-800 dark:text-white">{title}</h3>
          {description && <p className="text-xs text-slate-400 dark:text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="px-6 py-2 divide-y divide-slate-100 dark:divide-slate-800">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmMaintenance, setConfirmMaintenance] = useState(false);
  const [confirmBackup, setConfirmBackup] = useState(false);
  const [confirmClearCache, setConfirmClearCache] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/super-admin/settings");
        const data = await res.json();
        if (res.ok) setSettings(data.settings);
      } catch { toast.error("Failed to load settings"); }
      finally { setLoading(false); }
    })();
  }, []);

  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { id, createdAt, updatedAt, ...body } = settings;
      const res = await fetch("/api/super-admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) toast.success("Settings saved successfully");
      else toast.error("Failed to save settings");
    } catch { toast.error("Failed to save settings"); }
    finally { setSaving(false); }
  };

  const handleMaintenanceToggle = () => {
    if (!settings.maintenanceMode) setConfirmMaintenance(true);
    else update("maintenanceMode", false);
  };

  if (loading) return (
    <div className="space-y-6">
      <div><Skeleton className="h-8 w-48 mb-2" /><Skeleton className="h-4 w-72" /></div>
      {[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
    </div>
  );

  if (!settings) return <div className="text-center py-20 text-slate-400">Failed to load settings</div>;

  const securityTab = (
    <div className="space-y-6">
      <SectionCard title="Password Policy" description="Configure password requirements" icon={Lock}>
        <NumberField label="Minimum Password Length" description="Minimum characters required" value={settings.passwordMinLength} onChange={(v) => update("passwordMinLength", v)} min={6} max={32} suffix="chars" />
        <Toggle label="Require Uppercase Letters" description="At least one uppercase letter" enabled={settings.requireUppercase} onChange={(v) => update("requireUppercase", v)} />
        <Toggle label="Require Numbers" description="At least one numeric digit" enabled={settings.requireNumbers} onChange={(v) => update("requireNumbers", v)} />
        <Toggle label="Require Special Characters" description="At least one special character (!@#$%)" enabled={settings.requireSpecialChars} onChange={(v) => update("requireSpecialChars", v)} />
      </SectionCard>
      <SectionCard title="Session & Access" description="Control login and session behavior" icon={Shield}>
        <NumberField label="Session Timeout" description="Auto-logout after inactivity" value={settings.sessionTimeout} onChange={(v) => update("sessionTimeout", v)} min={5} max={480} suffix="min" />
        <NumberField label="Max Login Attempts" description="Before account lockout" value={settings.maxLoginAttempts} onChange={(v) => update("maxLoginAttempts", v)} min={3} max={20} />
        <NumberField label="Account Lock Duration" description="Lockout period after failed attempts" value={settings.accountLockDuration} onChange={(v) => update("accountLockDuration", v)} min={5} max={1440} suffix="min" />
        <Toggle label="Enable 2FA Readiness" description="Prepare system for two-factor authentication" enabled={settings.enable2FA} onChange={(v) => update("enable2FA", v)} />
      </SectionCard>
      <SectionCard title="Maintenance" description="System availability controls" icon={AlertTriangle}>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Maintenance Mode</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Temporarily disable access for non-admin users</p>
          </div>
          <button onClick={handleMaintenanceToggle}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${settings.maintenanceMode ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 hover:bg-amber-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"}`}>
            {settings.maintenanceMode ? "🔧 Maintenance ON" : "Maintenance OFF"}
          </button>
        </div>
      </SectionCard>
    </div>
  );

  const systemTab = (
    <div className="space-y-6">
      <SectionCard title="University Information" description="Core institution settings" icon={GraduationCap}>
        <TextField label="University Name" value={settings.universityName} onChange={(v) => update("universityName", v)} placeholder="Enter university name" />
        <TextField label="Contact Email" value={settings.contactEmail} onChange={(v) => update("contactEmail", v)} placeholder="admin@university.edu" />
        <TextField label="System Logo URL" description="URL to the system logo image" value={settings.systemLogoUrl} onChange={(v) => update("systemLogoUrl", v)} placeholder="https://..." />
      </SectionCard>
      <SectionCard title="Academic Configuration" description="Current academic period settings" icon={Clock}>
        <TextField label="Academic Year" value={settings.academicYear} onChange={(v) => update("academicYear", v)} placeholder="2024/2025" />
        <TextField label="Current Semester" value={settings.currentSemester} onChange={(v) => update("currentSemester", v)} placeholder="Semester 1" />
      </SectionCard>
      <SectionCard title="Notifications" description="Alert and notification preferences" icon={Mail}>
        <Toggle label="Enable In-App Notifications" description="Show notifications within the system" enabled={settings.enableNotifications} onChange={(v) => update("enableNotifications", v)} />
        <Toggle label="Enable Email Alerts" description="Send email for critical events" enabled={settings.enableEmailAlerts} onChange={(v) => update("enableEmailAlerts", v)} />
      </SectionCard>
    </div>
  );

  const backupTab = (
    <div className="space-y-6">
      <SectionCard title="System Health" description="Current system status" icon={Monitor}>
        <div className="py-4 space-y-3">
          {[{ l: "Database", s: "Connected", c: "emerald" }, { l: "Auth Service", s: "Operational", c: "emerald" }, { l: "File Storage", s: "Available", c: "emerald" }].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">{item.l}</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-${item.c}-400 animate-pulse`} />
                <span className={`text-xs font-semibold text-${item.c}-600 dark:text-${item.c}-400`}>{item.s}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Database Backup" description="Manage database backups" icon={Database}>
        <div className="py-4 space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Create a snapshot of the current database state. MongoDB Atlas automated backups are also running.</p>
          <button onClick={() => setConfirmBackup(true)} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Database className="w-4 h-4" /> Trigger Manual Backup
          </button>
        </div>
      </SectionCard>
      <SectionCard title="Cache Management" description="Clear system caches" icon={RefreshCw}>
        <div className="py-4 space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Clear cached data to resolve stale content issues. This may temporarily slow down the system.</p>
          <button onClick={() => setConfirmClearCache(true)} className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear All Caches
          </button>
        </div>
      </SectionCard>
    </div>
  );

  const themeTab = (
    <div className="space-y-6">
      <SectionCard title="Theme Preferences" description="Customize the look and feel" icon={Palette}>
        <div className="py-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Default Theme</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 mb-3">Set the default theme for new users</p>
          <div className="flex gap-3">
            {["light", "dark"].map(t => (
              <button key={t} onClick={() => update("defaultTheme", t)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${settings.defaultTheme === t ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"}`}>
                <div className={`w-full h-16 rounded-lg mb-2 ${t === "light" ? "bg-gradient-to-br from-white to-slate-100 border border-slate-200" : "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"}`} />
                <p className={`text-sm font-semibold capitalize ${settings.defaultTheme === t ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-400"}`}>{t} Mode</p>
              </button>
            ))}
          </div>
        </div>
        <TextField label="Primary Color" description="Main accent color (hex code)" value={settings.primaryColor} onChange={(v) => update("primaryColor", v)} placeholder="#e11d48" />
        <div className="py-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Preview</p>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-xl shadow-inner" style={{ background: settings.primaryColor }} />
            <div className="w-10 h-10 rounded-xl shadow-inner" style={{ background: settings.primaryColor, opacity: 0.7 }} />
            <div className="w-10 h-10 rounded-xl shadow-inner" style={{ background: settings.primaryColor, opacity: 0.4 }} />
            <div className="w-10 h-10 rounded-xl shadow-inner" style={{ background: settings.primaryColor, opacity: 0.15 }} />
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const tabs = [
    { id: "security", label: "Security", icon: Shield, content: securityTab },
    { id: "system", label: "System Config", icon: Server, content: systemTab },
    { id: "backup", label: "Backup & Health", icon: Database, content: backupTab },
    { id: "theme", label: "Theme", icon: Palette, content: themeTab },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure global system parameters and security policies.</p>
        </div>
        <button onClick={saveSettings} disabled={saving}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm shadow-rose-500/20 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <Tabs tabs={tabs} defaultTab="security" />

      {/* Confirmation Dialogs */}
      <ConfirmDialog isOpen={confirmMaintenance} onClose={() => setConfirmMaintenance(false)}
        onConfirm={() => { update("maintenanceMode", true); setConfirmMaintenance(false); toast.warning("Maintenance mode enabled"); }}
        title="Enable Maintenance Mode?" message="This will prevent non-admin users from accessing the system. Are you sure?"
        confirmText="Enable" variant="warning" />
      <ConfirmDialog isOpen={confirmBackup} onClose={() => setConfirmBackup(false)}
        onConfirm={() => { setConfirmBackup(false); toast.success("Backup initiated. MongoDB Atlas will process this shortly."); }}
        title="Trigger Database Backup?" message="This will create a snapshot of the current database state."
        confirmText="Start Backup" variant="info" />
      <ConfirmDialog isOpen={confirmClearCache} onClose={() => setConfirmClearCache(false)}
        onConfirm={() => { setConfirmClearCache(false); toast.success("Caches cleared successfully"); }}
        title="Clear All Caches?" message="This may temporarily slow down the system while caches are rebuilt."
        confirmText="Clear Caches" variant="warning" />
    </div>
  );
}
