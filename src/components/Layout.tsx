import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';
import Navbar from './Navbar';
import AIAssistant from './AIAssistant';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPosition, setAiPosition] = useState({ x: 0, y: 0 });
  const location = useLocation();
  
  const isSettingsPage = location.pathname.includes('/settings');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Floating AI Assistant Button */}
      {!isSettingsPage && (
        <motion.div
          drag
          dragConstraints={{
            left: 0,
            right: typeof window !== 'undefined' ? window.innerWidth - 80 : 0,
            top: 0,
            bottom: typeof window !== 'undefined' ? window.innerHeight - 80 : 0,
          }}
          initial={{ 
            x: typeof window !== 'undefined' ? window.innerWidth - 100 : 0, 
            y: typeof window !== 'undefined' ? window.innerHeight - 150 : 0 
          }}
          animate={{ 
            x: aiPosition.x || (typeof window !== 'undefined' ? window.innerWidth - 100 : 0), 
            y: aiPosition.y || (typeof window !== 'undefined' ? window.innerHeight - 150 : 0) 
          }}
          onDragEnd={(event, info) => {
            setAiPosition({ x: info.point.x, y: info.point.y });
          }}
          className="fixed z-40 cursor-move"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="w-16 h-16 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white"
          >
            <Brain className="w-8 h-8" />
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {aiOpen && !isSettingsPage && <AIAssistant onClose={() => setAiOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Layout;