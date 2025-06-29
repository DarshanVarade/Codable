import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            right: window.innerWidth - 80,
            top: 0,
            bottom: window.innerHeight - 80,
          }}
          initial={{ x: window.innerWidth - 100, y: window.innerHeight - 150 }}
          animate={{ x: aiPosition.x || window.innerWidth - 100, y: aiPosition.y || window.innerHeight - 150 }}
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
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
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