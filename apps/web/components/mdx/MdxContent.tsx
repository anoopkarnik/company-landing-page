"use client";

import type { ComponentProps, ReactNode } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import { cn } from "@workspace/ui/lib/utils";

function Callout({
  children,
  type = "info",
}: {
  children: ReactNode;
  type?: "info" | "success" | "warning" | "danger";
}) {
  const styles = {
    info: "border-blue-500/40 bg-blue-500/10",
    success: "border-emerald-500/40 bg-emerald-500/10",
    warning: "border-amber-500/40 bg-amber-500/10",
    danger: "border-red-500/40 bg-red-500/10",
  };

  return (
    <aside className={cn("my-6 rounded-lg border p-4", styles[type])}>
      {children}
    </aside>
  );
}

const components = {
  Callout,
  a: (props: ComponentProps<"a">) => <a {...props} rel="noreferrer noopener" />,
  img: (props: ComponentProps<"img">) => (
    // MDX content may reference remote or user-managed image hosts.
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} loading="lazy" />
  ),
  table: ({ children, ...props }: ComponentProps<"table">) => (
    <div className="my-8 overflow-x-auto rounded-xl border">
      <table {...props} className="my-0 min-w-full">
        {children}
      </table>
    </div>
  ),
};

export function MdxContent({
  source,
}: {
  source: Partial<MDXRemoteSerializeResult>;
}) {
  if (!source.compiledSource) return null;
  return (
    <MDXRemote
      {...(source as MDXRemoteSerializeResult)}
      components={components}
    />
  );
}
