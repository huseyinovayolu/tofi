import { createTRPCRouter } from '../trpc';
import { productsRouter } from './products';
import { categoriesRouter } from './categories';
import { ordersRouter } from './orders';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  products: productsRouter,
  categories: categoriesRouter,
  orders: ordersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;