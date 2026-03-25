"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { KeyRound, Palette, Database, LogOut, Shield, Sun, Moon, Monitor, Settings2, Loader2, LayoutPanelTop, Home, Sparkles, MessageSquareQuote, Package, Users, PanelBottom, ShieldCheck, Info } from "lucide-react";
import NavbarSection from "@/components/landing/NavbarSection";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/shadcn/tabs";
import { Card, CardContent } from "@workspace/ui/components/shadcn/card";
import type { CmsFormValues } from "@/lib/zod/cms";
import { NavbarTabContent } from "@/blocks/admin/NavbarTabContent";
import { HeroTabContent } from "@/blocks/admin/HeroTabContent";
import { AboutTabContent } from "@/blocks/admin/AboutTabContent";
import { ServicesTabContent } from "@/blocks/admin/ServicesTabContent";
import { ProjectsTabContent } from "@/blocks/admin/ProjectsTabContent";
import { TestimonialsTabContent } from "@/blocks/admin/TestimonialsTabContent";
import { TeamTabContent } from "@/blocks/admin/TeamTabContent";
import { FooterTabContent } from "@/blocks/admin/FooterTabContent";
import { LegalTabContent } from "@/blocks/admin/LegalTabContent";

type Tab = "password" | "theme" | "cms";

const ADMIN_PASSWORD_KEY = "adminPassword";
const ADMIN_AUTH_KEY = "adminAuthenticated";
const DEFAULT_PASSWORD = "password";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("password");
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; success: boolean } | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: landingInfo, isLoading: isLoadingCMS } = useQuery(trpc.landing.getLandingInfoFromNotion.queryOptions());

  const updateLandingInfoMutation = useMutation(
    trpc.landing.updateLandingInfo.mutationOptions({
      onSuccess: () => {
        toast.success("CMS updated successfully!", {
          description: "Your landing page Notion database has been updated."
        });
        queryClient.invalidateQueries(trpc.landing.getLandingInfoFromNotion.queryFilter());
      },
      onError: (error) => {
        console.error("Failed to update CMS:", error);
        toast.error("Failed to update CMS", {
          description: error.message || "Please check server logs for details."
        });
      }
    })
  );

  const handleCmsSave = (values: Partial<CmsFormValues>) => {
    updateLandingInfoMutation.mutate(values as any);
  };

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
        <NavbarSection />
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
      <NavbarSection />
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
            <div className="max-w-5xl">
              <div className="mb-8 flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Settings2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Content Management</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Update your landing page content. Changes sync directly to Notion.
                  </p>
                </div>
              </div>

              <Card className="min-h-[500px]">
                {isLoadingCMS ? (
                  <div className="flex flex-col justify-center items-center h-[400px] gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading CMS data...</p>
                  </div>
                ) : (
                  <CardContent>
                    <Tabs defaultValue="navbar" className="w-full">
                      <TabsList className="flex flex-wrap w-full h-auto gap-1 mb-8 justify-start bg-muted/50 p-1.5 rounded-lg">
                        <TabsTrigger value="navbar" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"><LayoutPanelTop className="w-3.5 h-3.5" /> Navbar</TabsTrigger>
                        <TabsTrigger value="hero" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"><Home className="w-3.5 h-3.5" /> Hero</TabsTrigger>
                        <TabsTrigger value="about" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"><Info className="w-3.5 h-3.5" /> About</TabsTrigger>
                        <TabsTrigger value="services" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"><Sparkles className="w-3.5 h-3.5" /> Services</TabsTrigger>
                        <TabsTrigger value="projects" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"><Package className="w-3.5 h-3.5" /> Projects</TabsTrigger>
                        <TabsTrigger value="testimonials" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"><MessageSquareQuote className="w-3.5 h-3.5" /> Testimonials</TabsTrigger>
                        <TabsTrigger value="team" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"><Users className="w-3.5 h-3.5" /> Team</TabsTrigger>
                        <TabsTrigger value="footer" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"><PanelBottom className="w-3.5 h-3.5" /> Footer</TabsTrigger>
                        <TabsTrigger value="legal" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"><ShieldCheck className="w-3.5 h-3.5" /> Legal</TabsTrigger>
                      </TabsList>

                      <TabsContent value="navbar"><NavbarTabContent initialData={landingInfo} onSave={handleCmsSave} isSaving={updateLandingInfoMutation.isPending} /></TabsContent>
                      <TabsContent value="hero"><HeroTabContent initialData={landingInfo} onSave={handleCmsSave} isSaving={updateLandingInfoMutation.isPending} /></TabsContent>
                      <TabsContent value="about"><AboutTabContent initialData={landingInfo} onSave={handleCmsSave} isSaving={updateLandingInfoMutation.isPending} /></TabsContent>
                      <TabsContent value="services"><ServicesTabContent initialData={landingInfo} onSave={handleCmsSave} isSaving={updateLandingInfoMutation.isPending} /></TabsContent>
                      <TabsContent value="projects"><ProjectsTabContent initialData={landingInfo} onSave={handleCmsSave} isSaving={updateLandingInfoMutation.isPending} /></TabsContent>
                      <TabsContent value="testimonials"><TestimonialsTabContent initialData={landingInfo} onSave={handleCmsSave} isSaving={updateLandingInfoMutation.isPending} /></TabsContent>
                      <TabsContent value="team"><TeamTabContent initialData={landingInfo} onSave={handleCmsSave} isSaving={updateLandingInfoMutation.isPending} /></TabsContent>
                      <TabsContent value="footer"><FooterTabContent initialData={landingInfo} onSave={handleCmsSave} isSaving={updateLandingInfoMutation.isPending} /></TabsContent>
                      <TabsContent value="legal"><LegalTabContent initialData={landingInfo} onSave={handleCmsSave} isSaving={updateLandingInfoMutation.isPending} /></TabsContent>
                    </Tabs>
                  </CardContent>
                )}
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
