# CA Project - Personal Finance Management App

A modern personal finance management application built with Next.js 15, React 19, and TypeScript.

## Features

- **User Authentication**: Secure login/signup system
- **Expense Tracking**: Add and categorize expenses
- **Budget Management**: Set and track monthly budgets
- **Income Management**: Record income from multiple sources
- **Financial Goals**: Set and monitor financial goals
- **AI Chat Assistant**: Get financial advice through AI-powered chat
- **Analytics Dashboard**: Visualize your financial data
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI components
- **Charts**: Recharts
- **Database**: Oracle ORDS (with in-memory fallback)
- **AI**: OpenRouter API integration

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- (Optional) Oracle Database with ORDS enabled

## Getting Started

### 1. Clone and Install Dependencies

```bash
cd "e:\\CA project"
npm install --legacy-peer-deps
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# Required for AI chat functionality
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: OpenRouter model selection
OPENROUTER_MODEL=openai/gpt-4o-mini

# Optional: Oracle ORDS Database (falls back to in-memory storage)
# ORACLE_ORDS_BASE_URL=https://your-oracle-instance.com
# ORACLE_ORDS_SCHEMA=your_schema_name
# ORACLE_ORDS_AUTH=Basic your_base64_encoded_credentials
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── data/         # Data management endpoints
│   │   ├── expenses/     # Expense management
│   │   ├── chat/         # AI chat endpoint
│   │   └── analytics/    # Analytics endpoint
│   ├── dashboard/        # Dashboard page
│   ├── login/           # Login page
│   └── onboarding/      # Onboarding flow
├── components/           # Reusable React components
│   ├── ui/              # Base UI components (Radix UI)
│   └── auth/            # Authentication components
├── lib/                 # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── repository.ts    # Data layer
│   ├── ai.ts           # AI integration
│   └── analytics.ts     # Analytics utilities
├── hooks/              # Custom React hooks
└── public/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Data Management
- `POST /api/data/profile` - Update user profile
- `POST /api/data/income` - Add income entries
- `POST /api/data/budget` - Set budget allocations
- `POST /api/data/goal` - Set financial goals

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Add expense

### Analytics & AI
- `GET /api/analytics` - Get financial analytics
- `POST /api/chat` - AI chat assistant
- `GET /api/me` - Get user data

## Database Setup (Optional)

If you want to use Oracle Database instead of in-memory storage:

1. Set up Oracle Database with ORDS enabled
2. Run the SQL scripts in `scripts/oracle/`:
   - `001_create_tables.sql` - Creates required tables
   - `002_ords_modules.sql` - Sets up ORDS modules
3. Configure the environment variables in `.env.local`

## Troubleshooting

### Dependency Conflicts
If you encounter dependency conflicts during installation, use:
```bash
npm install --legacy-peer-deps
```

### Environment Variables
Make sure to set up your `.env.local` file with the required API keys, especially `OPENROUTER_API_KEY` for the AI chat functionality.

### TypeScript Errors
The project is configured to ignore TypeScript build errors in production. If you encounter development issues, check:
- All dependencies are installed
- `next-env.d.ts` exists in the root directory
- TypeScript version compatibility

## License

This project is for demonstration purposes.
