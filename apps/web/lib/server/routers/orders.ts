import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { 
  OrderStatus, 
  PaymentMethod, 
  PaymentStatus, 
  AddressSchema, 
  generateOrderNumber,
  calculateMWST 
} from '@tofi/types';

export const ordersRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().min(1),
          })
        ),
        shippingAddress: AddressSchema,
        billingAddress: AddressSchema,
        paymentMethod: z.nativeEnum(PaymentMethod),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get products to calculate prices
      const productIds = input.items.map(item => item.productId);
      const products = await ctx.db.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      });

      if (products.length !== productIds.length) {
        throw new Error('Some products are not available');
      }

      // Check stock availability
      for (const item of input.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
          throw new Error(`Not enough stock for product ${product?.name || 'unknown'}`);
        }
      }

      // Calculate totals
      const subtotal = input.items.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId)!;
        return acc + (product.price * item.quantity);
      }, 0);

      const mwst = calculateMWST(subtotal);
      const shippingCost = subtotal >= 100 ? 0 : 9.90; // Free shipping over CHF 100
      const total = subtotal + mwst + shippingCost;

      // Create order
      const order = await ctx.db.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: OrderStatus.PENDING,
          paymentMethod: input.paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          shippingAddress: JSON.stringify(input.shippingAddress),
          billingAddress: JSON.stringify(input.billingAddress),
          subtotal,
          mwst,
          shippingCost,
          total,
          notes: input.notes,
          items: {
            create: input.items.map(item => {
              const product = products.find(p => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                total: product.price * item.quantity,
              };
            }),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update stock
      for (const item of input.items) {
        await ctx.db.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    }),

  getByOrderNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { orderNumber: input.orderNumber },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    }),

  simulatePayment: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        paymentMethod: z.nativeEnum(PaymentMethod),
        success: z.boolean().default(true), // For demo purposes
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.update({
        where: { id: input.orderId },
        data: {
          paymentStatus: input.success ? PaymentStatus.PAID : PaymentStatus.FAILED,
          status: input.success ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return order;
    }),
});