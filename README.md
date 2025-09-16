# tofi.ch - Swiss Flowers Marketplace

[![CI/CD Pipeline](https://github.com/huseyinovayolu/tofi/actions/workflows/ci.yml/badge.svg)](https://github.com/huseyinovayolu/tofi/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A production-ready Swiss flowers marketplace built with modern web technologies, designed specifically for the Swiss market with localization, Swiss payment methods, and geo-location features.

## 🇨🇭 Swiss Market Features

- **German Localization (de-CH)** - Complete Swiss German interface
- **CHF Currency Support** - Native Swiss Franc handling with MWST calculations
- **Swiss Address System** - PostGIS integration for Swiss postal codes and cantons
- **TWINT Payment Integration** - Native Swiss mobile payment support
- **Swiss Postal Validation** - Real-time address verification
- **Swiss Design System** - Clean, minimalist design following Swiss principles

## 🏗️ Architecture

### Monorepo Structure

```
tofi/
├── apps/
│   ├── web/                 # Next.js 14+ customer frontend
│   ├── merchant/            # Merchant portal (Coming soon)
│   └── api/                 # API routes (Coming soon)
├── packages/
│   ├── ui/                  # Swiss UI components (shadcn/ui + Tailwind)
│   ├── auth/                # Authentication with NextAuth.js + MFA
│   ├── database/            # Prisma schema with PostGIS
│   ├── config/              # Shared configurations
│   └── types/               # TypeScript definitions
├── infrastructure/
│   └── terraform/           # Infrastructure as Code
└── .github/workflows/       # CI/CD pipelines
```

### Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Node.js, tRPC (Coming soon), Prisma ORM
- **Database**: PostgreSQL 15+ with PostGIS extension
- **Cache**: Redis 7+ for sessions and caching
- **Search**: OpenSearch with Swiss German analyzer
- **Auth**: NextAuth.js with multi-factor authentication
- **UI**: shadcn/ui components with Swiss design system
- **Infrastructure**: Google Cloud Platform (GKE), Terraform
- **CDN**: Cloudflare with Swiss edge locations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/huseyinovayolu/tofi.git
   cd tofi
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development services**
   ```bash
   # Start PostgreSQL, Redis, OpenSearch, and other services
   pnpm docker:dev
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Push database schema
   pnpm db:push
   ```

6. **Start development servers**
   ```bash
   # Start all applications in development mode
   pnpm dev
   ```

The applications will be available at:
- **Customer App**: http://localhost:3000
- **Merchant Portal**: http://localhost:3001 (Coming soon)
- **API**: http://localhost:3002 (Coming soon)

### Development Services

When you run `pnpm docker:dev`, the following services will be available:

- **PostgreSQL**: `localhost:5432` (with PostGIS extension)
- **Redis**: `localhost:6379`
- **OpenSearch**: `localhost:9200`
- **OpenSearch Dashboards**: `localhost:5601`
- **MailHog** (Email testing): `localhost:8025`
- **MinIO** (S3-compatible storage): `localhost:9001`
- **Prisma Studio**: `localhost:5555`

## 🛠️ Development Commands

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all applications
pnpm lint             # Lint all packages
pnpm type-check       # TypeScript type checking
pnpm format           # Format code with Prettier

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Prisma Studio

# Docker
pnpm docker:dev       # Start development services
pnpm docker:down      # Stop development services

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
```

## 📦 Package Structure

### `@tofi/ui`
Swiss-themed UI components built on shadcn/ui with:
- Swiss color palette and typography
- Swiss address forms with postal code validation
- Currency formatting for CHF
- Responsive design for all device sizes

### `@tofi/database`
Prisma schema optimized for Swiss marketplace:
- PostGIS integration for geo-location
- Swiss address structure with cantons
- Multi-language support
- Audit logging for GDPR compliance

### `@tofi/auth`
Authentication package with:
- NextAuth.js integration
- Multi-factor authentication (TOTP)
- Swiss GDPR/nFADP compliance
- Role-based access control

### `@tofi/types`
Comprehensive TypeScript definitions for:
- Swiss addresses and postal codes
- Currency handling (CHF)
- Product and order management
- Multi-language content

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# Database
DATABASE_URL="postgresql://tofi:tofi@localhost:5432/tofi_dev"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Swiss Integrations
SWISS_POST_API_KEY="your-swiss-post-api-key"
TWINT_MERCHANT_ID="your-twint-merchant-id"

# Feature Flags
FEATURE_PAYMENT_TWINT="true"
FEATURE_MULTI_LANGUAGE="true"
```

### Swiss Localization

The application supports Swiss German (de-CH) with:
- Swiss-specific date and number formats
- CHF currency formatting
- Swiss postal code validation
- Canton selection with proper German names

## 🚀 Deployment

### Production Infrastructure

The application is designed to run on Google Cloud Platform with:

- **GKE Cluster** in europe-west6 (Zurich) region
- **Cloud SQL PostgreSQL** with PostGIS extension
- **Memorystore Redis** for caching
- **Cloud Storage** for file uploads
- **Cloudflare CDN** for global content delivery

### Deploy with Terraform

1. **Configure Terraform variables**
   ```bash
   cd infrastructure/terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

2. **Initialize and deploy**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

### CI/CD Pipeline

The GitHub Actions pipeline includes:
- **Quality checks**: ESLint, TypeScript, Prettier
- **Security scanning**: CodeQL, Trivy
- **Testing**: Unit and integration tests
- **Docker builds**: Multi-platform container images
- **Deployment**: Automated staging and production deployment

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

Testing includes:
- Unit tests for utilities and components
- Integration tests for API endpoints
- E2E tests for critical user journeys
- Swiss-specific functionality testing

## 🔒 Security

Security measures implemented:
- **OWASP compliance** with security headers
- **Data encryption** at rest and in transit
- **Multi-factor authentication** with TOTP
- **Rate limiting** and DDoS protection
- **Swiss GDPR/nFADP compliance** with audit logging
- **Dependency scanning** with automated updates

## 🌍 Swiss Compliance

The application is designed to comply with Swiss regulations:
- **nFADP (Swiss Data Protection Act)** compliance
- **Swiss VAT (MWST)** calculation and display
- **Swiss address validation** with PostGIS
- **Multi-language support** for Swiss languages
- **Local data processing** in Swiss/EU regions

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- **Email**: support@tofi.ch
- **Issues**: [GitHub Issues](https://github.com/huseyinovayolu/tofi/issues)
- **Documentation**: [Wiki](https://github.com/huseyinovayolu/tofi/wiki)

---

Built with ❤️ for the Swiss flowers marketplace 🌸🇨🇭