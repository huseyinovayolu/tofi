# Development Guide

This guide provides detailed information for developers working on the tofi.ch Swiss Flowers Marketplace.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - Use nvm for easy version management
- **pnpm 8+** - Package manager (faster than npm/yarn)
- **Docker & Docker Compose** - For local development services
- **Git** - Version control
- **VS Code** (recommended) - With workspace configuration

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/huseyinovayolu/tofi.git
cd tofi

# Install pnpm if not already installed
npm install -g pnpm@8.10.0

# Install dependencies
pnpm install
```

### 2. Development Services

Start the required services with Docker Compose:

```bash
# Start all development services
pnpm docker:dev

# Check service status
docker-compose -f docker-compose.dev.yml ps
```

This starts:
- PostgreSQL 15 with PostGIS (port 5432)
- Redis 7 (port 6379)
- OpenSearch (port 9200)
- OpenSearch Dashboards (port 5601)
- MailHog for email testing (port 8025)
- MinIO for S3-compatible storage (port 9001)

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your local configuration
nano .env.local
```

Essential variables for local development:
```bash
DATABASE_URL="postgresql://tofi:tofi@localhost:5432/tofi_dev"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-development-secret-32-chars-min"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (creates tables)
pnpm db:push

# Optional: Open Prisma Studio to inspect database
pnpm db:studio
```

### 5. Start Development

```bash
# Start all applications in development mode
pnpm dev
```

Applications will be available at:
- Customer app: http://localhost:3000
- Merchant portal: http://localhost:3001 (when implemented)
- API: http://localhost:3002 (when implemented)

## Project Structure

### Monorepo Organization

```
tofi/
├── apps/                    # Applications
│   ├── web/                # Customer-facing Next.js app
│   ├── merchant/           # Merchant portal (coming soon)
│   └── api/                # API application (coming soon)
├── packages/               # Shared packages
│   ├── ui/                # UI components and design system
│   ├── auth/              # Authentication utilities
│   ├── database/          # Prisma schema and utilities
│   ├── config/            # Shared configurations
│   └── types/             # TypeScript type definitions
├── infrastructure/        # Infrastructure as Code
│   └── terraform/         # Terraform configurations
└── .github/workflows/     # CI/CD pipelines
```

### Key Directories

- **`apps/web/src/app/`** - Next.js 14 App Router pages
- **`packages/ui/src/`** - Reusable UI components
- **`packages/database/schema.prisma`** - Database schema
- **`packages/types/index.ts`** - TypeScript definitions

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test locally
pnpm dev

# Run quality checks
pnpm lint
pnpm type-check
pnpm test

# Commit changes
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### 2. Code Quality

We use automated tools to maintain code quality:

```bash
# Linting (ESLint)
pnpm lint
pnpm lint:fix  # Auto-fix issues

# Type checking (TypeScript)
pnpm type-check

# Formatting (Prettier)
pnpm format
pnpm format:check

# Run all quality checks
pnpm lint && pnpm type-check && pnpm format:check
```

### 3. Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test packages/ui/src/components/button.test.tsx
```

## Working with Packages

### Adding Dependencies

```bash
# Add to root package.json (dev dependencies)
pnpm add -D -w eslint

# Add to specific package
pnpm add --filter @tofi/web react-query

# Add to UI package
pnpm add --filter @tofi/ui lucide-react
```

### Creating Components

When creating new UI components:

1. Create the component in `packages/ui/src/components/`
2. Export it in `packages/ui/index.tsx`
3. Add tests in the same directory
4. Update Storybook stories if applicable

### Database Changes

```bash
# 1. Modify packages/database/schema.prisma
# 2. Generate new client
pnpm db:generate

# 3. Apply changes to database
pnpm db:push

# For production, create migration instead:
pnpm --filter @tofi/database prisma migrate dev --name your_migration_name
```

## Swiss-Specific Development

### Localization

```bash
# Add new translations to:
apps/web/messages/de-CH.json
apps/web/messages/fr-CH.json  # Future
apps/web/messages/it-CH.json  # Future
```

### Swiss Address Handling

```typescript
import { swissUI } from '@tofi/ui';

// Validate postal code
const isValid = swissUI.validatePostalCode('8001'); // true

// Format phone number
const formatted = swissUI.formatPhone('+41 44 123 45 67');

// Get cantons for dropdown
const cantons = swissUI.getCantons();
```

### Currency Formatting

```typescript
import { swissUtils } from '@tofi/database';

// Format price from centimes
const price = swissUtils.formatPrice(1250); // "CHF 12.50"

// Convert CHF to centimes
const centimes = swissUtils.toCentimes(12.50); // 1250

// Calculate VAT
const vat = swissUtils.calculateVAT(1250); // Swiss VAT 7.7%
```

## Debugging

### Database Debugging

```bash
# Open Prisma Studio
pnpm db:studio

# Connect to PostgreSQL directly
docker exec -it tofi-postgres psql -U tofi -d tofi_dev

# View PostGIS extensions
SELECT * FROM pg_extension WHERE extname = 'postgis';
```

### Redis Debugging

```bash
# Connect to Redis
docker exec -it tofi-redis redis-cli

# List all keys
KEYS *

# Get session data
GET "next-auth.session-token.your-token"
```

### OpenSearch Debugging

```bash
# Check cluster health
curl http://localhost:9200/_cat/health

# List indices
curl http://localhost:9200/_cat/indices
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
cd apps/web
pnpm build
pnpm analyze
```

### Database Performance

```sql
-- Check slow queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;

-- Check PostGIS query performance
EXPLAIN ANALYZE SELECT * FROM users 
WHERE ST_DWithin(coordinates, ST_MakePoint(8.5417, 47.3769), 1000);
```

## Common Issues

### Port Conflicts

If you encounter port conflicts:

```bash
# Check which process is using port 3000
lsof -i :3000

# Kill the process
kill -9 PID

# Or use different ports
PORT=3001 pnpm dev
```

### Docker Issues

```bash
# Reset Docker services
pnpm docker:down
docker system prune -f
pnpm docker:dev

# Check service logs
docker-compose -f docker-compose.dev.yml logs postgres
```

### Prisma Issues

```bash
# Reset database completely
pnpm --filter @tofi/database prisma migrate reset

# Regenerate client
rm -rf node_modules/.prisma
pnpm db:generate
```

## IDE Setup

### VS Code Configuration

The repository includes VS Code workspace settings. Install recommended extensions:

- TypeScript and JavaScript Language Features
- Prisma
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- GitLens

### Settings

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Deployment Testing

### Build Testing

```bash
# Test production builds locally
pnpm build

# Test Docker builds
docker build -t tofi-web -f apps/web/Dockerfile .
docker run -p 3000:3000 tofi-web
```

### Environment Testing

```bash
# Test with staging environment variables
cp .env.staging .env.local
pnpm build && pnpm start
```

## Contributing Guidelines

1. **Branch naming**: `feature/description`, `fix/description`, `chore/description`
2. **Commit messages**: Use conventional commits (feat, fix, docs, style, refactor, test, chore)
3. **Pull requests**: Include description, testing steps, and screenshots if UI changes
4. **Code review**: At least one approval required before merging
5. **Testing**: All tests must pass, and new features should include tests

## Getting Help

- **Documentation**: Check the main README.md and this guide
- **Issues**: Search existing GitHub issues before creating new ones
- **Code**: Look at existing implementations for patterns
- **Community**: Ask questions in pull request discussions

---

Happy coding! 🚀🇨🇭