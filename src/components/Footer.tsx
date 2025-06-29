import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Github, 
  Heart, 
  Code, 
  Coffee,
  Star,
  Users,
  Zap,
  Mail,
  ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const creators = [
    {
      name: 'Darshan Varade',
      role: 'Lead Developer & AI Architect',
      github: 'https://github.com/DarshanVarade/',
      username: 'DarshanVarade',
      avatar: 'DV',
      gradient: 'from-blue-500 to-purple-500',
      skills: ['React', 'TypeScript', 'AI Integration']
    },
    {
      name: 'Umesh Chaudhari',
      role: 'Full Stack Developer & UI/UX Designer',
      github: 'https://github.com/chaudhariumesh051',
      username: 'chaudhariumesh051',
      avatar: 'UC',
      gradient: 'from-green-500 to-blue-500',
      skills: ['Node.js', 'Database Design', 'UI/UX']
    }
  ];

  const stats = [
    { icon: Code, label: 'Lines of Code', value: '10K+' },
    { icon: Coffee, label: 'Cups of Coffee', value: '100+' },
    { icon: Star, label: 'GitHub Stars', value: 'Growing' },
    { icon: Users, label: 'Happy Users', value: '1K+' }
  ];

  const technologies = [
    'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 
    'Gemini AI', 'CopilotKit', 'Framer Motion', 'Vite'
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-dark/20 to-secondary-dark/20" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-dark/10 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary-dark/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent">
                    Codable
                  </h3>
                  <p className="text-sm text-gray-400">AI-Powered Coding Platform</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Empowering developers with intelligent code analysis, problem-solving assistance, 
                and AI-powered insights. Built with passion for the coding community.
              </p>

              {/* Tech Stack */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  Built With
                </h4>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-full text-xs text-gray-300 hover:bg-gray-700/50 transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/30"
                  >
                    <stat.icon className="w-5 h-5 text-primary-dark mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Creators Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-8">
                <Heart className="w-6 h-6 text-red-500" />
                <h3 className="text-2xl font-bold">Meet the Creators</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {creators.map((creator, index) => (
                  <motion.div
                    key={creator.name}
                    initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                    className="group"
                  >
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105">
                      {/* Creator Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${creator.gradient} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                          {creator.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white group-hover:text-primary-dark transition-colors">
                            {creator.name}
                          </h4>
                          <p className="text-sm text-gray-400 mb-2">{creator.role}</p>
                          <div className="flex items-center gap-2">
                            <Github className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">@{creator.username}</span>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {creator.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-gray-700/50 rounded-md text-xs text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* GitHub Link */}
                      <a
                        href={creator.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-300 text-sm font-medium group-hover:bg-primary-dark/20 group-hover:text-primary-dark"
                      >
                        <Github className="w-4 h-4" />
                        View GitHub Profile
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Collaboration Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 p-6 bg-gradient-to-r from-primary-dark/20 to-secondary-dark/20 border border-primary-dark/30 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-primary-dark" />
                  <h4 className="text-lg font-semibold">Collaborative Excellence</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  This project represents the combined expertise and passion of two dedicated developers. 
                  From AI integration to user experience design, every aspect has been crafted with attention 
                  to detail and a commitment to empowering the developer community.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Powered by Innovation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Built with Passion</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-400">
                  © {currentYear} Codable. Crafted with{' '}
                  <Heart className="w-4 h-4 text-red-500 inline mx-1" />
                  by passionate developers.
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/DarshanVarade/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Darshan Varade
                </a>
                <a
                  href="https://github.com/chaudhariumesh051"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Umesh Chaudhari
                </a>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>Open Source Project</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;