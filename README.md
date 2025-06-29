# Codable - AI-Powered Code Analysis Platform

![Codable Logo](https://img.shields.io/badge/Codable-AI%20Powered-blue?style=for-the-badge&logo=brain&logoColor=white)

**Live Demo**: [https://bolt-codable.netlify.app](https://bolt-codable.netlify.app)

Codable is a comprehensive AI-powered coding platform that helps developers analyze code, solve programming problems, and learn through intelligent assistance. Built with React, TypeScript, and powered by Gemini 2.0 Flash AI and CopilotKit integration.

## 🚀 Features

### 🧠 AI-Powered Code Analysis
- **Intelligent Code Review**: Get comprehensive analysis of your code quality, bugs, and optimization opportunities
- **Visual Flowcharts**: Transform complex code logic into beautiful, interactive flowcharts
- **Multi-Language Support**: JavaScript, Python, Java, C++, TypeScript, Go, Rust, PHP
- **Performance Metrics**: Time and space complexity analysis
- **Security Insights**: Identify potential security vulnerabilities

### 🎯 Problem Solver
- **Natural Language Input**: Describe programming problems in plain English
- **Complete Solutions**: Get working code with detailed explanations
- **Code Optimization**: Automatic suggestions for performance improvements
- **Execution Simulation**: See how your code would run with sample outputs
- **Best Practices**: Learn industry-standard coding practices

### 🤖 Dual AI Assistant
- **Gemini 2.0 Flash**: Google's advanced AI model for comprehensive code analysis
- **CopilotKit Integration**: Enhanced workflow automation and code assistance
- **Seamless Switching**: Toggle between AI providers instantly via navbar
- **Context-Aware**: Maintains conversation history and understands your coding context

### 📊 Progress Tracking
- **Activity Heatmap**: GitHub-style contribution tracking
- **Streak System**: Maintain coding consistency with daily streak tracking
- **Achievement System**: Unlock badges for coding milestones
- **Statistics Dashboard**: Track analyses, problems solved, and time invested
- **Performance Analytics**: Monitor your coding improvement over time

### 🎨 Modern UI/UX
- **Dark/Light Theme**: Automatic system theme detection with manual override
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Professional Design**: Apple-level design aesthetics with attention to detail

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with full IntelliSense
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Framer Motion** - Production-ready motion library for animations
- **Monaco Editor** - VS Code's editor for in-browser code editing
- **Recharts** - Composable charting library for data visualization
- **Lucide React** - Beautiful, customizable SVG icons

### Backend & Database
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security (RLS)** - Secure data access with user-based policies
- **Edge Functions** - Serverless functions for API endpoints
- **Authentication** - Magic link and email/password authentication
- **Real-time Updates** - Live data synchronization across clients

### AI Integration
- **Google Gemini 2.0 Flash** - Advanced AI model for code analysis
- **CopilotKit** - AI-powered development assistance
- **Custom AI Hooks** - Optimized React hooks for AI interactions
- **Context Management** - Intelligent conversation and code context handling

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **PostCSS** - CSS processing with Autoprefixer
- **Git Hooks** - Pre-commit code quality checks
- **Environment Variables** - Secure configuration management

## 📁 Project Structure

```
codable/
├── public/                     # Static assets
│   └── _redirects             # Netlify routing configuration
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── AdminNavbar.tsx    # Admin panel navigation
│   │   ├── AdminRoute.tsx     # Admin access protection
│   │   ├── AIAssistant.tsx    # Floating AI assistant
│   │   ├── AuthModal.tsx      # Authentication modal
│   │   ├── CopilotKitProvider.tsx # CopilotKit configuration
│   │   ├── Layout.tsx         # Main application layout
│   │   ├── Navbar.tsx         # Primary navigation
│   │   └── ProtectedRoute.tsx # Authentication guard
│   ├── context/               # React context providers
│   │   └── ThemeContext.tsx   # Theme management
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAdminAuth.ts    # Admin authentication
│   │   ├── useAuth.ts         # User authentication
│   │   ├── useCopilotKit.ts   # CopilotKit integration
│   │   ├── useGemini.ts       # Gemini AI integration
│   │   ├── useProfile.ts      # User profile management
│   │   └── useUserStats.ts    # User statistics tracking
│   ├── lib/                   # Utility libraries
│   │   ├── copilotkit.ts      # CopilotKit configuration
│   │   ├── database.types.ts  # TypeScript database types
│   │   ├── gemini.ts          # Gemini AI service
│   │   └── supabase.ts        # Supabase client and helpers
│   ├── pages/                 # Application pages
│   │   ├── AdminPanel.tsx     # Admin user management
│   │   ├── CodableAI.tsx      # AI chat interface
│   │   ├── CodeAnalyzer.tsx   # Code analysis tool
│   │   ├── Dashboard.tsx      # User dashboard
│   │   ├── LandingPage.tsx    # Marketing landing page
│   │   ├── ProblemSolver.tsx  # Problem solving interface
│   │   ├── ResetPassword.tsx  # Password reset flow
│   │   ├── Settings.tsx       # User preferences
│   │   └── WelcomeGuide.tsx   # Onboarding tutorial
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── supabase/
│   └── migrations/            # Database schema migrations
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.ts             # Vite build configuration
└── package.json               # Dependencies and scripts
```

## 🗄 Database Schema

### Core Tables

#### `profiles`
User profile information linked to Supabase Auth
```sql
- id (uuid, FK to auth.users)
- username (text, unique)
- full_name (text)
- avatar_url (text)
- website (text)
- location (text)
- bio (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `code_analyses`
Store code analysis results and history
```sql
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- title (text)
- code_content (text)
- language (text)
- analysis_result (jsonb)
- score (integer, 0-100)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `problem_solutions`
Track problem-solving activities and solutions
```sql
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- problem_statement (text)
- language (text)
- solution_code (text)
- explanation (text)
- execution_result (jsonb)
- optimization_suggestions (jsonb)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `user_stats`
User activity and progress tracking
```sql
- user_id (uuid, PK, FK to profiles)
- total_analyses (integer)
- problems_solved (integer)
- current_streak (integer)
- longest_streak (integer)
- time_saved_minutes (integer)
- total_points (integer)
- last_activity (timestamptz)
- updated_at (timestamptz)
```

#### `achievements` & `user_achievements`
Gamification system for user engagement
```sql
achievements:
- id (uuid, PK)
- name (text)
- description (text)
- icon (text)
- criteria (jsonb)
- points (integer)

user_achievements:
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- achievement_id (uuid, FK to achievements)
- unlocked_at (timestamptz)
- progress (jsonb)
```

#### `ai_conversations` & `ai_messages`
AI chat history and conversation management
```sql
ai_conversations:
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- title (text)
- created_at (timestamptz)
- updated_at (timestamptz)

ai_messages:
- id (uuid, PK)
- conversation_id (uuid, FK to ai_conversations)
- role (text: 'user' | 'assistant')
- content (text)
- metadata (jsonb)
- created_at (timestamptz)
```

#### `admin_users`
Admin user management with secure authentication
```sql
- id (uuid, PK)
- email (text, unique)
- password_hash (text, bcrypt)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **User-based access control** - users can only access their own data
- **Admin-only functions** for user management
- **Secure password hashing** using bcrypt
- **API key protection** with environment variables

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google AI Studio account (for Gemini API)
- CopilotKit account (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/codable.git
cd codable
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_COPILOTKIT_API_KEY=your_copilotkit_api_key
```

4. **Database Setup**
```bash
# Run Supabase migrations
npx supabase db push
```

5. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🔧 Configuration

### Supabase Configuration
1. Create a new Supabase project
2. Run the provided migrations in `supabase/migrations/`
3. Configure authentication providers (email/password, magic links)
4. Set up Row Level Security policies
5. Add your project URL and anon key to environment variables

### Gemini AI Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your environment variables
4. Configure rate limits and usage quotas as needed

### CopilotKit Setup (Optional)
1. Sign up at [CopilotKit](https://copilotkit.ai)
2. Get your public API key
3. Add to environment variables
4. Configure backend proxy for full functionality (optional)

### Admin Setup
Default admin credentials:
- Email: `vampire@gmail.com`
- Password: `vampirepass`

**⚠️ Important**: Change these credentials in production by updating the `admin_users` table.

## 🎨 Customization

### Theme Configuration
The application supports extensive theming through Tailwind CSS:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        light: '#3C82F6',
        dark: '#22D3EE',
      },
      secondary: {
        light: '#A855F7',
        dark: '#F472B6',
      },
      // ... more colors
    }
  }
}
```

### AI Provider Configuration
Switch between AI providers programmatically:

```typescript
// Set AI provider preference
localStorage.setItem('aiProvider', 'gemini'); // or 'copilotkit'

// Listen for provider changes
window.addEventListener('aiProviderChanged', (event) => {
  console.log('AI provider changed to:', event.detail.newValue);
});
```

## 📊 Analytics & Monitoring

### User Analytics
- **Activity Tracking**: Daily coding activity with heatmap visualization
- **Progress Metrics**: Code analyses, problems solved, time invested
- **Streak System**: Consecutive day tracking with gamification
- **Achievement System**: Milestone-based rewards and badges

### Performance Monitoring
- **AI Response Times**: Track Gemini and CopilotKit performance
- **User Engagement**: Monitor feature usage and retention
- **Error Tracking**: Comprehensive error logging and reporting
- **Database Performance**: Query optimization and monitoring

## 🔒 Security

### Authentication & Authorization
- **Magic Link Authentication**: Passwordless login with email verification
- **Row Level Security**: Database-level access control
- **JWT Tokens**: Secure session management with Supabase Auth
- **Admin Protection**: Separate admin authentication system

### Data Protection
- **Environment Variables**: Secure API key management
- **Input Sanitization**: XSS and injection attack prevention
- **Rate Limiting**: API abuse prevention
- **HTTPS Enforcement**: Secure data transmission

### Privacy
- **User Data Isolation**: Each user can only access their own data
- **Conversation Privacy**: AI chat history is user-specific
- **Secure Deletion**: Complete data removal on account deletion
- **GDPR Compliance**: User data export and deletion capabilities

## 🚀 Deployment

### Netlify Deployment (Recommended)
The project is configured for seamless Netlify deployment:

1. **Automatic Deployment**
```bash
# The project includes Netlify configuration
# _redirects file for SPA routing
# Build command: npm run build
# Publish directory: dist
```

2. **Environment Variables**
Set the following in Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_COPILOTKIT_API_KEY`

3. **Custom Domain**
Configure custom domain through Netlify dashboard or use the provided domain setup tools.

### Alternative Deployment Options

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Structure
- **Unit Tests**: Component and hook testing with Jest and React Testing Library
- **Integration Tests**: API and database interaction testing
- **E2E Tests**: Full user workflow testing with Playwright
- **Performance Tests**: Load testing and performance benchmarking

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (configured in ESLint)
- **Conventional Commits**: Standardized commit messages
- **Component Structure**: Consistent file organization and naming

### Pull Request Guidelines
- Include tests for new features
- Update documentation as needed
- Follow the existing code style
- Provide clear description of changes
- Link related issues

## 📝 API Documentation

### Supabase Functions

#### `get_all_users_for_admin_panel()`
Securely fetch all users with profiles and stats for admin panel
```sql
-- Returns: user data with profiles and statistics
-- Security: Admin-only access
```

#### `delete_user_admin(user_id)`
Securely delete a user and all associated data
```sql
-- Parameters: user_id (uuid)
-- Returns: boolean success
-- Security: Admin-only access with cascade deletion
```

#### `verify_admin_password(email, password)`
Verify admin credentials using bcrypt
```sql
-- Parameters: email (text), password (text)
-- Returns: boolean verification result
-- Security: Secure password hashing
```

### AI Integration APIs

#### Gemini 2.0 Flash
```typescript
// Code analysis
const analysis = await geminiService.analyzeCode(code, language);

// Problem solving
const solution = await geminiService.solveProblem(problem, language);

// AI chat
const response = await geminiService.chatWithAssistant(message, context);
```

#### CopilotKit
```typescript
// Code generation
const code = await copilotKitService.generateCode(prompt, language);

// Chat assistance
const response = await copilotKitService.chat(message, context);
```

## 🐛 Troubleshooting

### Common Issues

#### AI API Errors
```
Error: API key not valid
Solution: Check your Gemini API key in environment variables
```

#### Database Connection Issues
```
Error: Invalid JWT
Solution: Verify Supabase URL and anon key configuration
```

#### Build Errors
```
Error: Module not found
Solution: Run npm install to ensure all dependencies are installed
```

### Debug Mode
Enable debug logging by setting:
```env
VITE_DEBUG=true
```

## 📈 Roadmap

### Upcoming Features
- [ ] **Code Collaboration**: Real-time collaborative code editing
- [ ] **Advanced Analytics**: Detailed performance insights and recommendations
- [ ] **Plugin System**: Extensible architecture for third-party integrations
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Team Features**: Organization and team management capabilities
- [ ] **Advanced AI Models**: Integration with GPT-4, Claude, and other AI providers

### Performance Improvements
- [ ] **Code Splitting**: Lazy loading for better initial load times
- [ ] **Service Worker**: Offline functionality and caching
- [ ] **Database Optimization**: Query optimization and indexing improvements
- [ ] **CDN Integration**: Global content delivery for faster access

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI** for Gemini 2.0 Flash API
- **CopilotKit** for AI development tools
- **Supabase** for backend infrastructure
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the design system
- **React Team** for the amazing framework
- **Open Source Community** for the incredible tools and libraries

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions
- **Email**: Contact support at support@codable.dev

### Community
- **Discord**: Join our developer community
- **Twitter**: Follow [@CodableAI](https://twitter.com/codableai) for updates
- **Blog**: Read development updates and tutorials
- **Newsletter**: Subscribe for feature announcements

---

**Built with ❤️ by the Codable Team**

*Empowering developers with AI-powered coding assistance*