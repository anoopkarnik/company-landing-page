
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";

import { hasValidAdminSession } from "@/lib/auth/admin-session";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return {
    userId: "anonymous",
    isAdmin: await hasValidAdminSession(),
  };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
  });
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "An authenticated admin session is required",
    });
  }

  return next({ ctx });
});
