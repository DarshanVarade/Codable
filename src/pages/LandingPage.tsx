import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Code, 
  Zap, 
  TrendingUp, 
  Users, 
  Award,
  ChevronRight,
  GitBranch,
  Bot,
  Target
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const stats = [
    { icon: Code, label: 'Codes Analyzed', value: '50K+' },
    { icon: Users, label: 'Active Users', value: '1M+' },
    { icon: TrendingUp, label: 'Accuracy Rate', value: '95%' },
    { icon: Zap, label: 'Uptime', value: '24/7' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI algorithms analyze your code for bugs, performance issues, and optimization opportunities.',
    },
    {
      icon: GitBranch,
      title: 'Visual Flowcharts',
      description: 'Transform complex code logic into beautiful, interactive flowcharts for better understanding.',
    },
    {
      icon: Bot,
      title: 'Intelligent Assistant',
      description: 'Get instant help with coding problems, explanations, and best practices from our AI assistant.',
    },
    {
      icon: Target,
      title: 'Smart Challenges',
      description: 'Personalized coding challenges that adapt to your skill level and learning progress.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark via-gray-900 to-background-dark text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent">
            Codable
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
          <Link
            to="/app/dashboard"
            className="px-4 py-2 bg-primary-dark rounded-lg hover:bg-primary-dark/80 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Master Code
              <br />
              <span className="bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              AI-powered code analysis with personalized explanations, interactive flowcharts, and 
              intelligent challenges. Transform how you learn, debug, and master programming.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              to="/app/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-dark to-secondary-dark rounded-lg hover:shadow-lg hover:shadow-primary-dark/25 transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-lg font-semibold">Start Learning Free</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-dark/20 rounded-lg mb-3">
                  <stat.icon className="w-6 h-6 text-primary-dark" />
                </div>
                <div className="text-2xl font-bold text-primary-dark">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-dark/20 rounded-full filter blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary-dark/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-primary-dark">Codable</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the features that make Codable the most advanced AI-powered coding platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 bg-card-dark/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-primary-dark/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Coding Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who are already mastering code with AI-powered insights
          </p>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-dark to-secondary-dark rounded-lg hover:shadow-lg hover:shadow-primary-dark/25 transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-lg font-semibold">Get Started Now</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;