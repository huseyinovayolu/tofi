import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Season, Canton } from '@tofi/types';

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        search: z.string().nullish(),
        categoryId: z.string().nullish(),
        season: z.nativeEnum(Season).nullish(),
        region: z.nativeEnum(Canton).nullish(),
        minPrice: z.number().min(0).nullish(),
        maxPrice: z.number().min(0).nullish(),
        sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const where = {
        isActive: true,
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            { description: { contains: input.search, mode: 'insensitive' as const } },
            { farmer: { contains: input.search, mode: 'insensitive' as const } },
          ],
        }),
        ...(input.categoryId && { categoryId: input.categoryId }),
        ...(input.season && { season: input.season }),
        ...(input.region && { region: input.region }),
        ...(input.minPrice !== undefined && { price: { gte: input.minPrice } }),
        ...(input.maxPrice !== undefined && { price: { lte: input.maxPrice } }),
      };

      const products = await ctx.db.product.findMany({
        take: limit + 1,
        where,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { [input.sortBy]: input.sortOrder },
        include: {
          category: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (products.length > limit) {
        const nextItem = products.pop();
        nextCursor = nextItem!.id;
      }

      return {
        products,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: {
          category: true,
        },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    }),

  search: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().max(20).default(10) }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: input.query, mode: 'insensitive' } },
            { description: { contains: input.query, mode: 'insensitive' } },
            { farmer: { contains: input.query, mode: 'insensitive' } },
          ],
        },
        take: input.limit,
        include: {
          category: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return products;
    }),

  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      where: {
        isActive: true,
        stock: { gt: 0 },
      },
      take: 8,
      include: {
        category: true,
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    return products;
  }),

  getByCategory: publicProcedure
    .input(z.object({ categorySlug: z.string(), limit: z.number().max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          isActive: true,
          category: {
            slug: input.categorySlug,
          },
        },
        take: input.limit,
        include: {
          category: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return products;
    }),
});