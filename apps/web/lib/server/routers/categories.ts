import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
                stock: { gt: 0 },
              },
            },
          },
        },
      },
    });

    return categories;
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    }),

  getWithProducts: publicProcedure
    .input(z.object({ 
      slug: z.string(),
      limit: z.number().max(50).default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
        include: {
          products: {
            where: {
              isActive: true,
            },
            take: input.limit,
            skip: input.offset,
            orderBy: {
              name: 'asc',
            },
          },
        },
      });

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    }),
});