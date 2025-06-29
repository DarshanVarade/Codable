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

## 📁 Project Structure

```
codable/
├── src/
│   ├── components/           # Reusable UI components
│   ├── pages/               # Application pages
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   └── context/             # React context providers
├── supabase/
│   └── migrations/          # Database schema migrations
├── public/                  # Static assets
└── dist/                    # Production build
```

## 🗄 Database Schema

### Core Tables
- **profiles**: User profile information
- **code_analyses**: Store code analysis results
- **problem_solutions**: Track problem-solving activities
- **user_stats**: User activity and progress tracking
- **achievements**: Gamification system
- **ai_conversations**: AI chat history
- **admin_users**: Admin user management

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
Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_COPILOTKIT_API_KEY=your_copilotkit_api_key
```

4. **Database Setup**
```bash
npx supabase db push
```

5. **Start Development Server**
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the provided migrations
3. Configure authentication providers
4. Set up Row Level Security policies

### Gemini AI Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to environment variables

### Admin Setup
Default admin credentials:
- Email: `vampire@gmail.com`
- Password: `vampirepass`

**⚠️ Important**: Change these credentials in production.

## 🎨 Customization

### Theme Configuration
Customize colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { light: '#3C82F6', dark: '#22D3EE' },
      secondary: { light: '#A855F7', dark: '#F472B6' }
    }
  }
}
```

### AI Provider Configuration
Switch between AI providers:
```typescript
localStorage.setItem('aiProvider', 'gemini'); // or 'copilotkit'
```

## 📊 Features Overview

### Code Analyzer
- Paste code and get instant AI analysis
- Visual flowcharts for complex logic
- Bug detection and performance insights
- Multi-language support

### Problem Solver
- Natural language problem descriptions
- Complete code solutions with explanations
- Optimization suggestions
- Execution simulation

### AI Assistant
- Dual AI provider support (Gemini + CopilotKit)
- Context-aware conversations
- Code explanations and debugging help
- Best practices guidance

### Dashboard
- Activity heatmap visualization
- Progress tracking and statistics
- Achievement system
- Streak monitoring

## 🔒 Security

### Authentication & Authorization
- Magic link authentication
- Row Level Security (RLS)
- JWT token management
- Admin protection system

### Data Protection
- Environment variable security
- Input sanitization
- Rate limiting
- HTTPS enforcement

## 🚀 Deployment

### Netlify (Recommended)
The project is configured for Netlify deployment:
- Automatic builds from Git
- Environment variable configuration
- Custom domain support

### Environment Variables
Set in Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_COPILOTKIT_API_KEY`

## 🧪 Testing

```bash
npm run test          # Unit tests
npm run test:coverage # Coverage report
npm run test:e2e      # End-to-end tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Conventional commits
- Component-based architecture

## 📈 Roadmap

### Upcoming Features
- [ ] Real-time collaborative editing
- [ ] Advanced analytics dashboard
- [ ] Plugin system for extensions
- [ ] Mobile applications
- [ ] Team management features
- [ ] Additional AI model integrations

### Performance Improvements
- [ ] Code splitting and lazy loading
- [ ] Service worker implementation
- [ ] Database query optimization
- [ ] CDN integration

## 🐛 Troubleshooting

### Common Issues

**AI API Errors**
```
Error: API key not valid
Solution: Check Gemini API key in environment variables
```

**Database Connection**
```
Error: Invalid JWT
Solution: Verify Supabase URL and anon key
```

**Build Errors**
```
Error: Module not found
Solution: Run npm install
```

### Debug Mode
Enable debug logging:
```env
VITE_DEBUG=true
```

## 👥 Team

### Creators

**Darshan Varade** - Full Stack Developer
- GitHub: [@DarshanVarade](https://github.com/DarshanVarade/)
- Specialties: Node.js, TypeScript, AI Integration

**Umesh Chaudhari** - Full Stack Developer  
- GitHub: [@chaudhariumesh051](https://github.com/chaudhariumesh051)
- Specialties: React, Database Design, UI/UX

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google AI** for Gemini 2.0 Flash API
- **CopilotKit** for AI development tools
- **Supabase** for backend infrastructure
- **Netlify** for hosting and deployment
- **Open Source Community** for amazing tools

## 📞 Support

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join GitHub Discussions
- **Email**: Contact support team

---

**Built with ❤️ by Darshan Varade & Umesh Chaudhari**

*Empowering developers with AI-powered coding assistance*