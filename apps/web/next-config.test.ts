import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants.js";
import { describe, expect, it } from "vitest";

import nextConfig from "./next.config.js";

type ConfigFactory = (phase: string) => { distDir?: string };

describe("Next output directories", () => {
  it("isolates development output from production build output", () => {
    expect(nextConfig).toBeTypeOf("function");
    if (typeof nextConfig !== "function") return;

    const configFactory = nextConfig as ConfigFactory;

    expect(configFactory(PHASE_DEVELOPMENT_SERVER).distDir).toBe(".next-dev");
    expect(configFactory(PHASE_PRODUCTION_BUILD).distDir).toBe(".next");
  });
});
