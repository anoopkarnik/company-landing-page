"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@repo/ui/providers/theme-provider";
import { Button } from "@repo/ui/atoms/shadcn/button";
import { Input } from "@repo/ui/atoms/shadcn/input";
import { KeyRound, Palette, Database, LogOut, Shield, Sun, Moon, Monitor, FileCode } from "lucide-react";
import Navbar from "@repo/ui/organisms/custom/landing/v1/Navbar";
import { useGlobalData } from "../../context/DataContext";

type Tab = "password" | "theme" | "cms";

const ADMIN_PASSWORD_KEY = "adminPassword";
const ADMIN_AUTH_KEY = "adminAuthenticated";
const DEFAULT_PASSWORD = "password";

export default function AdminPage() {
  const data = useGlobalData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("password");
  const { theme, setTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem(ADMIN_AUTH_KEY);
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const getStoredPassword = () =>
    localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;

  const handleLogin = () => {
    if (loginPassword === getStoredPassword()) {
      localStorage.setItem(ADMIN_AUTH_KEY, "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
    setLoginPassword("");
  };

  const handlePasswordChange = () => {
    if (currentPassword !== getStoredPassword()) {
      setPasswordMessage({ text: "Current password is incorrect.", success: false });
      return;
    }
    if (newPassword.length < 4) {
      setPasswordMessage({ text: "Password must be at least 4 characters.", success: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: "Passwords do not match.", success: false });
      return;
    }
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
    setPasswordMessage({ text: "Password updated successfully.", success: true });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col">
        <Navbar navbarSection={data.navbarSectionState} />
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="w-full max-w-sm p-8 rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground mt-1">Enter password to continue</p>
            </div>
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              <Button className="w-full" onClick={handleLogin}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { id: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "password", label: "Change Password", icon: <KeyRound className="w-4 h-4" /> },
    { id: "theme", label: "Theme", icon: <Palette className="w-4 h-4" /> },
    { id: "cms", label: "Data Source", icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Navbar navbarSection={data.navbarSectionState} />
      <div className="flex-1 flex bg-background overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg">Admin</span>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(({ id, label, icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                {icon}
                {label}
                {badge && (
                  <span className="ml-auto text-[10px] uppercase tracking-wide opacity-60">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === "password" && (
            <div className="max-w-md">
              <h2 className="text-xl font-semibold mb-1">Change Password</h2>
              <p className="text-sm text-muted-foreground mb-6">Update your admin panel password</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Current Password</label>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">New Password</label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {passwordMessage && (
                  <p className={`text-sm ${passwordMessage.success ? "text-green-500" : "text-red-500"}`}>
                    {passwordMessage.text}
                  </p>
                )}
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </div>
            </div>
          )}

          {activeTab === "theme" && (
            <div className="max-w-md">
              <h2 className="text-xl font-semibold mb-1">Theme</h2>
              <p className="text-sm text-muted-foreground mb-6">Choose your preferred appearance</p>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { value: "light", label: "Light", icon: <Sun className="w-5 h-5 mx-auto mb-2" /> },
                    { value: "dark", label: "Dark", icon: <Moon className="w-5 h-5 mx-auto mb-2" /> },
                    { value: "system", label: "System", icon: <Monitor className="w-5 h-5 mx-auto mb-2" /> },
                  ] as const
                ).map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`p-5 rounded-xl border-2 text-sm font-medium transition-all ${theme === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "cms" && (
            <div className="max-w-md">
              <h2 className="text-xl font-semibold mb-1">Data Source</h2>
              <p className="text-sm text-muted-foreground mb-6">Choose where your landing page content is loaded from</p>
              <div className="grid grid-cols-1 gap-3">
                {([
                  {
                    value: "file" as const,
                    label: "File Constants",
                    description: "Load data from local TypeScript constant files",
                    icon: <FileCode className="w-5 h-5" />,
                  },
                  {
                    value: "notion" as const,
                    label: "Notion",
                    description: "Load data from Notion databases",
                    icon: <Database className="w-5 h-5" />,
                  },
                ]).map(({ value, label, description, icon }) => (
                  <button
                    key={value}
                    onClick={() => data.handleConstantsType(value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                      data.constantsType === value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      data.constantsType === value ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {icon}
                    </div>
                    <div>
                      <p className={`font-medium ${data.constantsType === value ? "text-primary" : ""}`}>{label}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
              {data.isLoading && (
                <p className="text-sm text-muted-foreground mt-4 animate-pulse">Loading data...</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
