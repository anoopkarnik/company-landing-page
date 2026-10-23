"use client";

import { useId } from "react";
import {
  groupServicePackages,
  SERVICE_CATEGORY_DESCRIPTIONS,
  SERVICE_LEVEL_LABELS,
} from "@/lib/service-packages";
import type { PublicServicePackage } from "@/lib/ts-types/conversion";
import { cn } from "@workspace/ui/lib/utils";

export const OTHER_SERVICE_CATEGORY = "__other__";
export const RECOMMEND_PACKAGE = "__recommend__";

export function servicePackageKey(service: PublicServicePackage) {
  return service.slug || service.id || service.title;
}

function ServiceOption({
  name,
  value,
  title,
  subtitle,
  description,
  meta,
  checked,
  onSelect,
}: {
  name: string;
  value: string;
  title: string;
  subtitle?: string;
  description: string;
  meta?: string;
  checked: boolean;
  onSelect: (value: string) => void;
}) {
  const descriptionId = useId();
  return (
    <label
      className={cn(
        "block cursor-pointer rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        checked && "border-primary bg-primary/5",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        aria-label={subtitle ? `${title}: ${subtitle}` : title}
        aria-describedby={descriptionId}
        className="sr-only"
      />
      <span className="flex items-start justify-between gap-3">
        <span>
          <span
            className={cn(
              "block text-sm font-semibold",
              subtitle && "text-primary",
            )}
          >
            {title}
          </span>
          {subtitle ? (
            <span className="mt-1 block text-base font-medium">{subtitle}</span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "mt-1 size-3 shrink-0 rounded-full border",
            checked && "border-primary bg-primary ring-2 ring-primary/20",
          )}
        />
      </span>
      <span
        id={descriptionId}
        className="mt-2 block text-sm font-normal leading-6 text-muted-foreground"
      >
        {description}
      </span>
      {meta ? (
        <span className="mt-3 block text-xs font-medium text-muted-foreground">
          {meta}
        </span>
      ) : null}
    </label>
  );
}

export function ServiceCategoryPicker({
  services,
  selected,
  onSelect,
}: {
  services: PublicServicePackage[];
  selected: string;
  onSelect: (category: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold">
        What kind of help do you need?
      </legend>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Start with a service area. You’ll choose a package on the next step.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {groupServicePackages(services).map((group) => (
          <ServiceOption
            key={group.category}
            name="service-category"
            value={group.category}
            title={group.category}
            description={
              (Object.hasOwn(SERVICE_CATEGORY_DESCRIPTIONS, group.category)
                ? SERVICE_CATEGORY_DESCRIPTIONS[group.category]
                : undefined) ||
              group.packages[0]?.description ||
              "Describe what you need and we’ll work out the right approach together."
            }
            checked={selected === group.category}
            onSelect={onSelect}
          />
        ))}
        <ServiceOption
          name="service-category"
          value={OTHER_SERVICE_CATEGORY}
          title="Something else"
          description="Have a different project or aren’t sure where it fits? Describe your needs and I’ll help you find the right approach."
          checked={selected === OTHER_SERVICE_CATEGORY}
          onSelect={onSelect}
        />
      </div>
    </fieldset>
  );
}

export function ServicePackagePicker({
  services,
  category,
  selected,
  onSelect,
}: {
  services: PublicServicePackage[];
  category: string;
  selected: string;
  onSelect: (value: string) => void;
}) {
  const packages =
    groupServicePackages(services).find((group) => group.category === category)
      ?.packages ?? [];
  return (
    <fieldset>
      <legend className="text-lg font-semibold">
        Which {category} package fits your project?
      </legend>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Compare the levels below. If you’re unsure, I can help you choose.
      </p>
      <div className="mt-5 space-y-3">
        {packages.map((service) => (
          <ServiceOption
            key={servicePackageKey(service)}
            name="service-package"
            value={servicePackageKey(service)}
            title={
              service.level
                ? SERVICE_LEVEL_LABELS[service.level]
                : service.title
            }
            subtitle={service.level ? service.title : undefined}
            description={service.description}
            meta={[
              service.priceFrom ? `Approx ${service.priceFrom}` : null,
              service.timeline ? `Timeline: ${service.timeline}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
            checked={selected === servicePackageKey(service)}
            onSelect={onSelect}
          />
        ))}
        <ServiceOption
          name="service-package"
          value={RECOMMEND_PACKAGE}
          title="Help me choose"
          description="Tell me about your project first. I’ll recommend the level and scope that best fit your needs."
          checked={selected === RECOMMEND_PACKAGE}
          onSelect={onSelect}
        />
      </div>
    </fieldset>
  );
}
