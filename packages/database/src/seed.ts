#!/usr/bin/env tsx
import { db } from './client';
import { hashPassword } from './utils';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await db.user.upsert({
      where: { email: 'admin@tofi.ch' },
      update: {},
      create: {
        email: 'admin@tofi.ch',
        firstName: 'Admin',
        lastName: 'User',
        password: adminPassword,
        role: 'ADMIN',
        language: 'de-CH',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create sample customer
    const customerPassword = await hashPassword('customer123');
    const customer = await db.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        email: 'customer@example.com',
        firstName: 'Max',
        lastName: 'Mustermann',
        password: customerPassword,
        role: 'CUSTOMER',
        language: 'de-CH',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Created customer user:', customer.email);

    // Create sample merchant user
    const merchantPassword = await hashPassword('merchant123');
    const merchantUser = await db.user.upsert({
      where: { email: 'merchant@blumen-zurich.ch' },
      update: {},
      create: {
        email: 'merchant@blumen-zurich.ch',
        firstName: 'Anna',
        lastName: 'Blumen',
        password: merchantPassword,
        role: 'MERCHANT',
        language: 'de-CH',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Created merchant user:', merchantUser.email);

    // Create sample merchant
    const merchant = await db.merchant.upsert({
      where: { userId: merchantUser.id },
      update: {},
      create: {
        userId: merchantUser.id,
        businessName: 'Blumen Zürich GmbH',
        displayName: 'Blumen Zürich',
        description: 'Frische Blumen aus der Region Zürich. Spezialisiert auf Hochzeits- und Eventoßdekoration.',
        businessType: 'gmbh',
        vatNumber: 'CHE-123.456.789 MWST',
        email: 'info@blumen-zurich.ch',
        phone: '+41 44 123 45 67',
        street: 'Bahnhofstrasse',
        streetNumber: '42',
        city: 'Zürich',
        zipCode: '8001',
        canton: 'ZH',
        status: 'APPROVED',
        isVerified: true,
        minOrderValue: 25.00,
        processingTime: '2-4 Stunden',
      },
    });
    console.log('✅ Created merchant:', merchant.displayName);

    // Create delivery zones for the merchant
    await db.deliveryZone.createMany({
      data: [
        {
          merchantId: merchant.id,
          name: 'Zürich City',
          zipCodes: ['8001', '8002', '8003', '8004', '8005'],
          canton: 'ZH',
          deliveryFee: 5.00,
          estimatedTime: '1-2 Stunden',
        },
        {
          merchantId: merchant.id,
          name: 'Zürich Umgebung',
          zipCodes: ['8006', '8008', '8032', '8037', '8038'],
          canton: 'ZH',
          deliveryFee: 8.00,
          estimatedTime: '2-4 Stunden',
        },
      ],
    });
    console.log('✅ Created delivery zones');

    // Create business hours
    await db.businessHours.createMany({
      data: [
        { merchantId: merchant.id, dayOfWeek: 1, openTime: '08:00', closeTime: '18:00' }, // Monday
        { merchantId: merchant.id, dayOfWeek: 2, openTime: '08:00', closeTime: '18:00' }, // Tuesday
        { merchantId: merchant.id, dayOfWeek: 3, openTime: '08:00', closeTime: '18:00' }, // Wednesday
        { merchantId: merchant.id, dayOfWeek: 4, openTime: '08:00', closeTime: '18:00' }, // Thursday
        { merchantId: merchant.id, dayOfWeek: 5, openTime: '08:00', closeTime: '18:00' }, // Friday
        { merchantId: merchant.id, dayOfWeek: 6, openTime: '08:00', closeTime: '16:00' }, // Saturday
        { merchantId: merchant.id, dayOfWeek: 0, isClosed: true }, // Sunday
      ],
    });
    console.log('✅ Created business hours');

    // Create sample products
    const products = [
      {
        name: 'Rosenstrauss Classic',
        description: 'Ein wunderschöner Strauss aus 12 roten Rosen, liebevoll arrangiert mit Schleierkraut und Grün.',
        shortDescription: 'Klassischer Rosenstrauss mit 12 roten Rosen',
        category: 'BOUQUETS',
        price: 45.00,
        flowerTypes: ['Rose'],
        colors: ['Rot'],
        occasions: ['Liebe', 'Geburtstag', 'Jahrestag'],
        fragrance: 'MEDIUM',
        careLevel: 'MEDIUM',
        lifespan: '5-7 Tage',
      },
      {
        name: 'Frühlingswiese',
        description: 'Bunter Frühlingsstrauss mit Tulpen, Narzissen und Freesien in frischen Pastelltönen.',
        shortDescription: 'Bunter Frühlingsstrauss',
        category: 'BOUQUETS',
        price: 35.00,
        flowerTypes: ['Tulpe', 'Narzisse', 'Freesie'],
        colors: ['Gelb', 'Rosa', 'Weiss'],
        occasions: ['Frühling', 'Geburtstag', 'Dankeschön'],
        fragrance: 'LIGHT',
        careLevel: 'LOW',
        lifespan: '7-10 Tage',
      },
      {
        name: 'Orchidee im Topf',
        description: 'Elegante weisse Phalaenopsis-Orchidee im dekorativen Keramiktopf. Perfekt als langanhaltende Dekoration.',
        shortDescription: 'Weisse Orchidee im Keramiktopf',
        category: 'PLANTS',
        price: 65.00,
        flowerTypes: ['Orchidee'],
        colors: ['Weiss'],
        occasions: ['Einzug', 'Büro', 'Dekoration'],
        fragrance: 'NONE',
        careLevel: 'HIGH',
        lifespan: '2-3 Monate',
      },
    ];

    for (const productData of products) {
      const product = await db.product.create({
        data: {
          ...productData,
          merchantId: merchant.id,
          unit: 'BOUQUET',
          isAvailable: true,
          stockQuantity: 10,
        },
      });

      // Add sample image
      await db.productImage.create({
        data: {
          productId: product.id,
          url: `https://images.unsplash.com/photo-${Date.now()}?w=400&h=400&fit=crop`,
          alt: product.name,
          isPrimary: true,
          order: 0,
        },
      });

      console.log('✅ Created product:', product.name);
    }

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

if (require.main === module) {
  seed();
}

export { seed };