import { supportRouter } from './supportProcedures';
import {  createTRPCRouter } from '../init';
import { landingRouter } from './landingProcedures';
import { documentationRouter } from './docProcedures';
import { blogRouter } from './blogProcedures';
import { adminRouter } from './adminProcedures';
import { conversionRouter } from './conversionProcedures';

export const appRouter = createTRPCRouter({
    support: supportRouter,
    landing: landingRouter,
    documentation: documentationRouter,
    blog: blogRouter,
    admin: adminRouter,
    conversion: conversionRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
