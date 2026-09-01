import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { z } from "zod";

import {
  clearAdminSessionCookie,
  hasAdminAuthConfiguration,
  setAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/auth/admin-session";
import { getRatelimit } from "@/server/ratelimit";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/trpc/init";

async function enforceLoginRateLimit() {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identifier = `admin-login:${ip || "127.0.0.1"}`;
  const ratelimit = getRatelimit();
  if (!ratelimit) return;

  const { success } = await ratelimit.limit(identifier);
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many login attempts. Please try again later.",
    });
  }
}

export const adminRouter = createTRPCRouter({
  status: baseProcedure.query(({ ctx }) => ({
    authenticated: ctx.isAdmin,
    configured: hasAdminAuthConfiguration(),
  })),
  login: baseProcedure
    .input(z.object({ password: z.string().min(1).max(256) }))
    .mutation(async ({ input }) => {
      await enforceLoginRateLimit();
      if (!hasAdminAuthConfiguration()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Admin authentication is not configured on the server",
        });
      }
      if (!verifyAdminPassword(input.password)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect password",
        });
      }

      await setAdminSessionCookie();
      return { authenticated: true };
    }),
  logout: adminProcedure.mutation(async () => {
    await clearAdminSessionCookie();
    return { authenticated: false };
  }),
});
