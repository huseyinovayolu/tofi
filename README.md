# tofi.ch - Swiss Flowers Marketplace

> **Complete technical foundation for Switzerland's premier flowers marketplace**

tofi.ch is a modern, scalable e-commerce platform connecting Swiss flower lovers with local florists. Built with Swiss market requirements in mind, featuring multi-language support, Swiss payment methods, and compliance with Swiss data protection laws.

## 🌸 Features

### For Customers
- **Swiss-focused experience** - German, French, Italian, and Romansh language support
- **Local florist discovery** - Find and support florists in your canton
- **Fresh flower guarantee** - Quality assurance with local sourcing
- **Flexible delivery options** - Same-day, scheduled, and pickup options
- **Swiss payment methods** - TWINT, PostFinance, bank transfer, and credit cards

### For Merchants
- **Professional merchant portal** - Complete business management tools
- **Swiss business compliance** - VAT handling, Swiss business registration
- **Inventory management** - Real-time stock updates with seasonal tracking
- **Order management** - Automated workflows with customizable processing times
- **Analytics & reporting** - Business insights and performance metrics

### Technical Excellence
- **Monorepo architecture** - Turborepo + pnpm for optimal development experience
- **Type-safe codebase** - Full TypeScript coverage with shared type definitions
- **Swiss design system** - Tailwind CSS with Swiss-inspired components
- **Production-ready infrastructure** - Terraform, AWS, Cloudflare integration
- **Comprehensive security** - SAST/DAST scanning, dependency auditing
- **CI/CD pipeline** - Automated testing, building, and deployment

## 🏗️ Architecture

```
tofi/
├── apps/
│   ├── web/                 # Customer frontend (Next.js 14)
│   ├── merchant/            # Merchant portal (Next.js 14)
│   └── api/                 # API backend (Next.js API routes)
├── packages/
│   ├── ui/                  # Shared UI components (shadcn/ui + Tailwind)
│   ├── auth/                # Authentication utilities (NextAuth.js)
│   ├── database/            # Database schema and utilities (Prisma + PostgreSQL)
│   ├── config/              # Shared configurations (ESLint, TypeScript, Tailwind)
│   └── types/               # TypeScript type definitions
├── infrastructure/
│   └── terraform/           # Infrastructure as Code (AWS + Cloudflare)
└── .github/workflows/       # CI/CD pipelines
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0 or higher
- pnpm 8.15.0 or higher
- PostgreSQL 15+ with PostGIS
- Redis 7+

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/huseyinovayolu/tofi.git
   cd tofi
   pnpm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup**
   ```bash
   # Start PostgreSQL and Redis (using Docker)
   docker run -d --name tofi-postgres -p 5432:5432 \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=tofi \
     postgis/postgis:15-3.3

   docker run -d --name tofi-redis -p 6379:6379 redis:7-alpine

   # Run database migrations
   pnpm db:push
   pnpm db:seed
   ```

4. **Start development servers**
   ```bash
   # Start all applications
   pnpm dev

   # Or start individually
   pnpm --filter @tofi/web dev        # Customer frontend (http://localhost:3000)
   pnpm --filter @tofi/merchant dev   # Merchant portal (http://localhost:3001)
   pnpm --filter @tofi/api dev        # API backend (http://localhost:3002)
   ```

### Testing

```bash
# Run all tests
pnpm test

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Build all applications
pnpm build
```

## 📦 Package Overview

### `@tofi/ui` - Design System
Swiss-inspired UI component library with:
- **Design tokens** - Colors, typography, spacing based on Swiss design principles
- **Components** - Button, Input, Card, and business-specific components
- **Utilities** - Swiss formatting (currency, dates, phone numbers)
- **Hooks** - Swiss locale management and formatting

### `@tofi/types` - Type Definitions
Comprehensive TypeScript types for:
- **Swiss-specific types** - Cantons, postal codes, VAT handling
- **Business models** - Users, merchants, products, orders
- **API contracts** - Request/response types with validation
- **Utility types** - Pagination, filtering, and common patterns

### `@tofi/database` - Data Layer
Complete database solution featuring:
- **Prisma schema** - PostgreSQL with PostGIS for geospatial features
- **Swiss compliance** - Address validation, VAT calculations
- **Seed data** - Sample merchants, products, and users
- **Utilities** - Password hashing, order number generation

### `@tofi/auth` - Authentication
Secure authentication system with:
- **NextAuth.js integration** - Credentials and OAuth providers
- **Multi-factor authentication** - TOTP support for enhanced security
- **Role-based access control** - Customer, Merchant, Admin roles
- **Swiss session management** - Compliant with data protection laws

### `@tofi/config` - Shared Configuration
Unified configuration for:
- **ESLint rules** - Consistent code quality across packages
- **TypeScript configs** - Optimized for different package types
- **Tailwind setup** - Swiss design system integration

## 🇨🇭 Swiss Market Features

### Language Support
- **German (de-CH)** - Primary language with Swiss German considerations
- **French (fr-CH)** - Full French localization
- **Italian (it-CH)** - Italian translation support
- **Romansh (rm-CH)** - Romansh language support

### Payment Integration
- **TWINT** - Switzerland's leading mobile payment solution
- **PostFinance** - Swiss postal financial services
- **Swiss QR-Bills** - QR-IBAN support for invoicing
- **Credit cards** - International card processing

### Compliance & Legal
- **nFADP compliance** - Swiss Federal Act on Data Protection
- **GDPR compatibility** - European data protection standards
- **Swiss VAT handling** - 7.7% standard rate with exemptions
- **Business registration** - UID, commercial register integration

### Geographic Features
- **Canton-based delivery** - All 26 Swiss cantons supported
- **Postal code validation** - Swiss 4-digit postal code system
- **Address formatting** - Swiss address standards
- **Delivery zones** - Urban and rural delivery optimization

## 🔒 Security & Privacy

### Security Measures
- **SAST/DAST scanning** - Automated security testing in CI/CD
- **Dependency auditing** - Regular vulnerability assessments
- **Secrets detection** - Prevention of credential leaks
- **Container security** - Docker image vulnerability scanning

### Privacy Protection
- **Data minimization** - Collect only necessary information
- **Consent management** - Granular privacy controls
- **Right to deletion** - GDPR Article 17 compliance
- **Data portability** - Export user data functionality

## 🚢 Deployment

### Infrastructure
The platform is designed for deployment on:
- **AWS EU-Central-1** - Frankfurt region for Swiss data residency
- **PostgreSQL RDS** - Managed database with automated backups
- **ElastiCache Redis** - Managed caching layer
- **OpenSearch** - Full-text search capabilities
- **Cloudflare** - CDN, WAF, and DDoS protection

### CI/CD Pipeline
Automated workflows for:
- **Code quality** - Linting, type checking, security scanning
- **Testing** - Unit, integration, and end-to-end tests
- **Building** - Optimized production builds
- **Deployment** - Blue-green deployments with rollback capability

## 📚 Documentation

- [API Documentation](./docs/api.md) - REST API endpoints and GraphQL schema
- [Database Schema](./docs/database.md) - Complete data model documentation
- [Deployment Guide](./docs/deployment.md) - Production deployment instructions
- [Contributing](./docs/contributing.md) - Development and contribution guidelines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details on:
- Development workflow
- Code standards
- Testing requirements
- Pull request process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🌟 Acknowledgments

- Swiss Federal Statistical Office for canton and postal code data
- Swiss Post for address formatting standards
- Swiss Bankers Association for payment method guidelines
- The open-source community for the excellent tools and libraries

---

**Made with 🇨🇭 for Switzerland's flower lovers**