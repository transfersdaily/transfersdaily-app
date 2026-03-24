# TransfersDaily Frontend

TransfersDaily is a comprehensive football transfer news website that provides real-time updates, rumors, and confirmed transfers across major European leagues. Built with Next.js 15 and modern web technologies, it offers both public content consumption and administrative content management capabilities.

## About the Website

TransfersDaily serves as a central hub for football transfer news, offering:

- **Latest Transfer News**: Up-to-date coverage of player movements, rumors, and confirmed deals
- **League Coverage**: Dedicated sections for Premier League, La Liga, Serie A, Bundesliga, and Ligue 1
- **Transfer Categories**: Organized content for completed transfers, confirmed deals, and transfer rumors
- **Club & Player Profiles**: Detailed information about football clubs and players
- **Search Functionality**: Advanced search capabilities to find specific transfers or news
- **Admin Management**: Comprehensive backend for content creation and management

## Key Features

- **Real-time Transfer Updates**: Latest football transfer news across major leagues
- **League-specific Coverage**: Dedicated pages for Premier League, La Liga, Serie A, Bundesliga, Ligue 1
- **Transfer Categorization**: Separate sections for completed, confirmed, and rumored transfers
- **Transfer Tracker**: Monitor ongoing transfer activities and deadlines
- **Article Management**: Full content management system with draft and published states
- **Admin Dashboard**: Protected admin panel for comprehensive site management
- **Responsive Design**: Mobile-first design with shadcn/ui components
- **AI-powered Content**: Automated article generation and processing
- **Search & Discovery**: Advanced search functionality for transfers and news
- **Contact System**: Direct communication channel for users

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + shadcn/ui components
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React + React Icons
- **Charts**: Recharts for data visualization
- **Themes**: next-themes for dark/light mode support
- **Authentication**: AWS Cognito (Admin-only access)
- **API**: AWS API Gateway + Lambda functions
- **Database**: PostgreSQL with RDS Proxy
- **Infrastructure**: AWS CDK for deployment
- **Deployment**: AWS infrastructure (CloudFront, S3, etc.)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- AWS account with deployed backend infrastructure
- Admin access credentials for content management

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `src/lib/config.ts`:
   - Update API endpoints
   - Set Cognito admin user pool credentials

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- Only admin users can access the dashboard at `/admin`
- Admin accounts are created manually in AWS Cognito
- No public user registration available

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Protected admin dashboard
│   │   ├── articles/      # Article management (drafts, published, edit)
│   │   ├── clubs/         # Club management
│   │   ├── leagues/       # League management
│   │   ├── players/       # Player management
│   │   ├── users/         # User management
│   │   └── settings/      # System settings
│   ├── league/            # League-specific pages
│   │   ├── premier-league/
│   │   ├── la-liga/
│   │   ├── serie-a/
│   │   ├── bundesliga/
│   │   └── ligue-1/
│   ├── transfers/         # Transfer categories
│   │   ├── completed/
│   │   ├── confirmed/
│   │   └── rumors/
│   ├── article/           # Individual article pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── latest/            # Latest news
│   ├── search/            # Search functionality
│   ├── transfer-tracker/  # Transfer tracking
│   └── login/             # Authentication
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
└── hooks/                 # Custom React hooks
```

## Website Structure

### Public Pages
- `/` - Homepage with latest transfer news and highlights
- `/latest` - Most recent transfer updates and news
- `/about` - Information about TransfersDaily
- `/contact` - Contact form and information
- `/search` - Advanced search functionality

### League Pages
- `/league/premier-league` - Premier League transfers and news
- `/league/la-liga` - La Liga transfers and news
- `/league/serie-a` - Serie A transfers and news
- `/league/bundesliga` - Bundesliga transfers and news
- `/league/ligue-1` - Ligue 1 transfers and news

### Transfer Categories
- `/transfers/completed` - Finalized transfer deals
- `/transfers/confirmed` - Officially confirmed transfers
- `/transfers/rumors` - Transfer rumors and speculation
- `/transfer-tracker` - Live transfer tracking dashboard

### Content Pages
- `/article/[slug]` - Individual article pages
- `/clubs` - Club profiles and information

### Admin Panel (Protected)
- `/login` - Admin authentication
- `/admin` - Main admin dashboard
- `/admin/articles/published` - Published articles management
- `/admin/articles/drafts` - Draft articles management
- `/admin/articles/edit/[id]` - Article editing interface
- `/admin/clubs` - Club management
- `/admin/leagues` - League management
- `/admin/players` - Player management
- `/admin/users` - User management
- `/admin/settings` - System settings

## Content Management

TransfersDaily features a comprehensive admin system:

- **Article Management**: Create, edit, and publish transfer news articles
- **Draft System**: Save work-in-progress articles as drafts
- **Content Categories**: Organize content by leagues, transfer types, and status
- **Club & Player Database**: Maintain comprehensive databases of clubs and players
- **User Management**: Admin user access control
- **System Settings**: Configure site-wide settings and preferences

## Development

- **TypeScript**: Full type safety across the application
- **ESLint**: Code quality and consistency enforcement
- **Turbopack**: Fast development builds with Next.js 15
- **shadcn/ui**: Consistent, accessible UI component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern React**: Uses React 19 with latest features
- **Component Architecture**: Modular, reusable component design

## Deployment

The frontend is designed to integrate seamlessly with the AWS backend infrastructure:

1. **Backend First**: Ensure the AWS backend stack is deployed
2. **Configuration**: Update API endpoints in `src/lib/config.ts`
3. **Authentication**: Configure AWS Cognito admin credentials
4. **Build & Deploy**: The application builds to static assets for CDN deployment

## Features in Detail

### Public Features
- Browse latest transfer news and rumors
- Filter content by league, club, or transfer type
- Search for specific players, clubs, or transfers
- Read detailed articles about transfer developments
- Track ongoing transfer windows and deadlines

### Admin Features
- Create and edit transfer news articles
- Manage draft and published content
- Maintain club and player databases
- Configure system settings
- Monitor site analytics and user engagement
- Manage user access and permissions# transfersdaily-app
