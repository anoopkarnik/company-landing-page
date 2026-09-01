"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Database,
  ExternalLink,
  FileSearch,
  FolderKanban,
  Inbox,
  LayoutPanelTop,
  Loader2,
  LogOut,
  MessageSquareQuote,
  Moon,
  Newspaper,
  PackageOpen,
  Palette,
  SearchCheck,
  Shield,
  Sun,
  Monitor,
  Home,
  Info,
  Sparkles,
  Users,
  PanelBottom,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { AboutTabContent } from "@/blocks/admin/AboutTabContent";
import { CaseStudiesAdmin } from "@/blocks/admin/CaseStudiesAdmin";
import { ContentPagesTabContent } from "@/blocks/admin/ContentPagesTabContent";
import { ConversionSettingsAdmin } from "@/blocks/admin/ConversionSettingsAdmin";
import { FooterTabContent } from "@/blocks/admin/FooterTabContent";
import { HeroTabContent } from "@/blocks/admin/HeroTabContent";
import { LeadsAdmin } from "@/blocks/admin/LeadsAdmin";
import { LegalTabContent } from "@/blocks/admin/LegalTabContent";
import { NavbarTabContent } from "@/blocks/admin/NavbarTabContent";
import { PortfolioPublishingAdmin } from "@/blocks/admin/PortfolioPublishingAdmin";
import { ProofMetricsAdmin } from "@/blocks/admin/ProofMetricsAdmin";
import { ServicePackagesAdmin } from "@/blocks/admin/ServicePackagesAdmin";
import { ServicesTabContent } from "@/blocks/admin/ServicesTabContent";
import { SocialProofAdmin } from "@/blocks/admin/SocialProofAdmin";
import { TeamTabContent } from "@/blocks/admin/TeamTabContent";
import type { CmsFormValues } from "@/lib/zod/cms";
import { useTRPC } from "@/trpc/client";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Card, CardContent } from "@workspace/ui/components/shadcn/card";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/shadcn/tabs";

type Tab =
  | "landing"
  | "services"
  | "case-studies"
  | "portfolio"
  | "proof"
  | "social-proof"
  | "leads"
  | "positioning"
  | "blogs"
  | "documentation"
  | "theme";

const navItems: Array<{ id: Tab; label: string; icon: typeof Database }> = [
  { id: "landing", label: "Landing CMS", icon: Database },
  { id: "services", label: "Service Packages", icon: PackageOpen },
  { id: "case-studies", label: "Case Studies", icon: BriefcaseBusiness },
  { id: "portfolio", label: "Portfolio Publishing", icon: FolderKanban },
  { id: "proof", label: "Proof Metrics", icon: BarChart3 },
  { id: "social-proof", label: "Social Proof", icon: MessageSquareQuote },
  { id: "leads", label: "Project Leads", icon: Inbox },
  { id: "positioning", label: "SEO & Founder", icon: SearchCheck },
  { id: "blogs", label: "Blogs", icon: Newspaper },
  { id: "documentation", label: "Documentation", icon: BookOpen },
  { id: "theme", label: "Theme", icon: Palette },
];

export default function AdminPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("landing");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const authQuery = useQuery(trpc.admin.status.queryOptions());
  const authenticated = authQuery.data?.authenticated === true;

  const landingQuery = useQuery({
    ...trpc.landing.getLandingInfo.queryOptions(),
    enabled: authenticated,
  });
  const blogsQuery = useQuery({
    ...trpc.blog.getBlogPostsForAdmin.queryOptions(),
    enabled: authenticated,
  });
  const documentationQuery = useQuery({
    ...trpc.documentation.getDocumentationPagesForAdmin.queryOptions(),
    enabled: authenticated,
  });
  const conversionQuery = useQuery({
    ...trpc.conversion.getAdminConversionData.queryOptions(),
    enabled: authenticated,
  });

  const loginMutation = useMutation(
    trpc.admin.login.mutationOptions({
      onSuccess: async () => {
        setLoginError("");
        setLoginPassword("");
        await queryClient.invalidateQueries(trpc.admin.status.queryFilter());
      },
      onError: (error) => setLoginError(error.message),
    }),
  );
  const logoutMutation = useMutation(
    trpc.admin.logout.mutationOptions({
      onSuccess: async () => {
        queryClient.removeQueries({
          predicate: (query) => query.queryKey[0] !== "admin",
        });
        await queryClient.invalidateQueries(trpc.admin.status.queryFilter());
      },
    }),
  );

  const invalidateConversion = async () => {
    await Promise.all([
      queryClient.invalidateQueries(
        trpc.conversion.getAdminConversionData.queryFilter(),
      ),
      queryClient.invalidateQueries(
        trpc.conversion.getPublicConversionData.queryFilter(),
      ),
      queryClient.invalidateQueries(
        trpc.conversion.listCaseStudies.queryFilter(),
      ),
    ]);
  };
  const success = (message: string) => () => {
    toast.success(message);
    void invalidateConversion();
  };
  const failure = (message: string) => (error: { message: string }) =>
    toast.error(message, { description: error.message });

  const updateLanding = useMutation(
    trpc.landing.updateLandingInfo.mutationOptions({
      onSuccess: () => {
        toast.success("Landing CMS updated");
        void queryClient.invalidateQueries(
          trpc.landing.getLandingInfo.queryFilter(),
        );
      },
      onError: failure("Could not update landing CMS"),
    }),
  );
  const updateBlogs = useMutation(
    trpc.blog.updateBlogPosts.mutationOptions({
      onSuccess: () => {
        toast.success("Blog CMS updated");
        void queryClient.invalidateQueries(
          trpc.blog.getBlogPostsForAdmin.queryFilter(),
        );
        void queryClient.invalidateQueries(trpc.blog.getBlogInfo.queryFilter());
      },
      onError: failure("Could not update blog CMS"),
    }),
  );
  const updateDocumentation = useMutation(
    trpc.documentation.updateDocumentationPages.mutationOptions({
      onSuccess: () => {
        toast.success("Documentation CMS updated");
        void queryClient.invalidateQueries(
          trpc.documentation.getDocumentationPagesForAdmin.queryFilter(),
        );
        void queryClient.invalidateQueries(
          trpc.documentation.getDocumentationInfo.queryFilter(),
        );
      },
      onError: failure("Could not update documentation CMS"),
    }),
  );
  const updateServices = useMutation(
    trpc.conversion.updateServicePackages.mutationOptions({
      onSuccess: success("Service packages updated"),
      onError: failure("Could not update service packages"),
    }),
  );
  const updateCaseStudies = useMutation(
    trpc.conversion.updateCaseStudies.mutationOptions({
      onSuccess: success("Case studies updated"),
      onError: failure("Could not update case studies"),
    }),
  );
  const updatePortfolio = useMutation(
    trpc.conversion.updatePortfolioProjects.mutationOptions({
      onSuccess: success("Portfolio publishing updated"),
      onError: failure("Could not update portfolio"),
    }),
  );
  const updateProof = useMutation(
    trpc.conversion.updateProofMetrics.mutationOptions({
      onSuccess: success("Proof metrics updated"),
      onError: failure("Could not update proof metrics"),
    }),
  );
  const updateSocialProof = useMutation(
    trpc.conversion.updateSocialProof.mutationOptions({
      onSuccess: success("Social proof updated"),
      onError: failure("Could not update social proof"),
    }),
  );
  const updateSettings = useMutation(
    trpc.conversion.updateConversionSettings.mutationOptions({
      onSuccess: success("Positioning and SEO updated"),
      onError: failure("Could not update positioning and SEO"),
    }),
  );
  const updateLead = useMutation(
    trpc.conversion.updateLead.mutationOptions({
      onSuccess: success("Lead updated"),
      onError: failure("Could not update lead"),
    }),
  );

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    loginMutation.mutate({ password: loginPassword });
  }

  if (authQuery.isLoading) {
    return <FullPageLoading label="Checking admin session…" />;
  }

  if (!authenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/20 p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Shield className="size-7" />
            </div>
            <h1 className="mt-6 text-center text-2xl font-bold">
              Bayesian Labs CMS
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Sign in with the server-configured admin password.
            </p>
            {!authQuery.data?.configured ? (
              <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                Set <code>ADMIN_PASSWORD</code> and{" "}
                <code>ADMIN_SESSION_SECRET</code> in the server environment
                before using the CMS.
              </div>
            ) : null}
            <form className="mt-7 space-y-4" onSubmit={handleLogin}>
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="Admin password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                disabled={!authQuery.data?.configured || loginMutation.isPending}
              />
              {loginError ? (
                <p className="text-sm text-destructive" role="alert">
                  {loginError}
                </p>
              ) : null}
              <Button
                className="w-full"
                type="submit"
                disabled={!authQuery.data?.configured || loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
            <Button asChild variant="ghost" className="mt-3 w-full">
              <Link href="/">Return to website</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const conversion = conversionQuery.data;
  const newLeadCount =
    conversion?.leads.filter((lead) => lead.status === "NEW").length ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-muted/15">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="size-5" />
          </span>
          <div>
            <p className="font-semibold leading-tight">Bayesian Labs CMS</p>
            <p className="text-xs text-muted-foreground">
              PostgreSQL content workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/" target="_blank">
              View site <ExternalLink className="size-3.5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 border-r bg-background lg:flex lg:flex-col">
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
                {id === "leads" && newLeadCount ? (
                  <Badge className="ml-auto bg-background/20 text-current">
                    {newLeadCount}
                  </Badge>
                ) : null}
              </button>
            ))}
          </nav>
          <div className="border-t p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileSearch className="size-3.5" /> Drafts stay private until
              published.
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="border-b bg-background p-4 lg:hidden">
            <label className="grid gap-1.5 text-sm font-medium">
              Admin section
              <select
                className="h-10 rounded-md border bg-background px-3"
                value={activeTab}
                onChange={(event) => setActiveTab(event.target.value as Tab)}
              >
                {navItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                    {item.id === "leads" && newLeadCount
                      ? ` (${newLeadCount})`
                      : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
            {activeTab === "landing" ? (
              <LandingCms
                data={landingQuery.data}
                isLoading={landingQuery.isLoading}
                isSaving={updateLanding.isPending}
                onSave={(values) => updateLanding.mutate(values as any)}
              />
            ) : null}
            {activeTab === "services" ? (
              <ServicePackagesAdmin
                initialData={conversion?.servicePackages}
                isLoading={conversionQuery.isLoading}
                isSaving={updateServices.isPending}
                onSave={(servicePackages) =>
                  updateServices.mutate({ servicePackages })
                }
              />
            ) : null}
            {activeTab === "case-studies" ? (
              <CaseStudiesAdmin
                initialData={conversion?.caseStudies}
                isLoading={conversionQuery.isLoading}
                isSaving={updateCaseStudies.isPending}
                onSave={(caseStudies) =>
                  updateCaseStudies.mutate({ caseStudies })
                }
              />
            ) : null}
            {activeTab === "portfolio" ? (
              <PortfolioPublishingAdmin
                initialData={conversion?.portfolioProjects}
                isLoading={conversionQuery.isLoading}
                isSaving={updatePortfolio.isPending}
                onSave={(portfolioProjects) =>
                  updatePortfolio.mutate({ portfolioProjects })
                }
              />
            ) : null}
            {activeTab === "proof" ? (
              <ProofMetricsAdmin
                initialData={conversion?.proofMetrics}
                isLoading={conversionQuery.isLoading}
                isSaving={updateProof.isPending}
                onSave={(proofMetrics) =>
                  updateProof.mutate({ proofMetrics })
                }
              />
            ) : null}
            {activeTab === "social-proof" ? (
              <SocialProofAdmin
                clientLogos={conversion?.clientLogos}
                testimonials={conversion?.testimonials}
                isLoading={conversionQuery.isLoading}
                isSaving={updateSocialProof.isPending}
                onSave={(value) => updateSocialProof.mutate(value)}
              />
            ) : null}
            {activeTab === "leads" ? (
              <LeadsAdmin
                initialData={conversion?.leads}
                isLoading={conversionQuery.isLoading}
                isSaving={updateLead.isPending}
                onUpdate={(lead) => updateLead.mutate(lead)}
              />
            ) : null}
            {activeTab === "positioning" ? (
              <ConversionSettingsAdmin
                initialData={conversion?.landingPage}
                isLoading={conversionQuery.isLoading}
                isSaving={updateSettings.isPending}
                onSave={(settings) => updateSettings.mutate(settings)}
              />
            ) : null}
            {activeTab === "blogs" ? (
              <ContentCard>
                <ContentPagesTabContent
                  title="Blog CMS"
                  description="Create client-focused MDX articles with publishing and SEO controls."
                  itemLabel="Blog Post"
                  icon={Newspaper}
                  initialData={blogsQuery.data}
                  isLoading={blogsQuery.isLoading}
                  isSaving={updateBlogs.isPending}
                  onSave={(posts) => updateBlogs.mutate({ posts })}
                />
              </ContentCard>
            ) : null}
            {activeTab === "documentation" ? (
              <ContentCard>
                <ContentPagesTabContent
                  title="Documentation CMS"
                  description="Create MDX documentation with publishing and SEO controls."
                  itemLabel="Documentation Page"
                  icon={BookOpen}
                  initialData={documentationQuery.data}
                  isLoading={documentationQuery.isLoading}
                  isSaving={updateDocumentation.isPending}
                  onSave={(pages) => updateDocumentation.mutate({ pages })}
                />
              </ContentCard>
            ) : null}
            {activeTab === "theme" ? (
              <ThemePanel theme={theme} setTheme={setTheme} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

function FullPageLoading({ label }: { label: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-primary" />
        {label}
      </div>
    </div>
  );
}

function ContentCard({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}

function LandingCms({
  data,
  isLoading,
  isSaving,
  onSave,
}: {
  data: any;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (values: Partial<CmsFormValues>) => void;
}) {
  if (isLoading) return <FullPageLoading label="Loading landing CMS…" />;
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold">Landing CMS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the shared brand, legacy sections, team, footer, and legal
          content.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="navbar">
            <TabsList className="mb-7 flex h-auto flex-wrap justify-start gap-1 p-1.5">
              <TabsTrigger value="navbar">
                <LayoutPanelTop className="size-3.5" /> Navbar
              </TabsTrigger>
              <TabsTrigger value="hero">
                <Home className="size-3.5" /> Hero
              </TabsTrigger>
              <TabsTrigger value="about">
                <Info className="size-3.5" /> About
              </TabsTrigger>
              <TabsTrigger value="services">
                <Sparkles className="size-3.5" /> Legacy Services
              </TabsTrigger>
              <TabsTrigger value="team">
                <Users className="size-3.5" /> Team
              </TabsTrigger>
              <TabsTrigger value="footer">
                <PanelBottom className="size-3.5" /> Footer
              </TabsTrigger>
              <TabsTrigger value="legal">
                <ShieldCheck className="size-3.5" /> Legal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="navbar">
              <NavbarTabContent
                initialData={data}
                onSave={onSave}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="hero">
              <HeroTabContent
                initialData={data}
                onSave={onSave}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="about">
              <AboutTabContent
                initialData={data}
                onSave={onSave}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="services">
              <ServicesTabContent
                initialData={data}
                onSave={onSave}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="team">
              <TeamTabContent
                initialData={data}
                onSave={onSave}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="footer">
              <FooterTabContent
                initialData={data}
                onSave={onSave}
                isSaving={isSaving}
              />
            </TabsContent>
            <TabsContent value="legal">
              <LegalTabContent
                initialData={data}
                onSave={onSave}
                isSaving={isSaving}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ThemePanel({
  theme,
  setTheme,
}: {
  theme?: string;
  setTheme: (theme: string) => void;
}) {
  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">CMS appearance</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose the color mode used in this browser.
      </p>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {options.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`rounded-2xl border-2 p-6 text-sm font-medium transition ${
              theme === value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            <Icon className="mx-auto mb-3 size-6" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
