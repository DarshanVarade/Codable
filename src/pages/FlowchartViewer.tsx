import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Maximize,
  RotateCcw,
  Share,
  Code
} from 'lucide-react';

const FlowchartViewer: React.FC = () => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Logic Flowchart</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive flowchart • Click nodes to explore
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-card-light dark:bg-card-dark border border-gray-200/20 dark:border-gray-700/20 rounded-lg">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          
          <button className="p-2 bg-card-light dark:bg-card-dark border border-gray-200/20 dark:border-gray-700/20 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button className="p-2 bg-card-light dark:bg-card-dark border border-gray-200/20 dark:border-gray-700/20 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1">
            <button className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/80 transition-colors">
              Export PNG
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
              Export SVG
            </button>
          </div>
        </div>
      </div>

      {/* Flowchart Canvas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden"
      >
        <div className="h-full p-8 overflow-auto">
          <div 
            className="flex flex-col items-center space-y-8 transition-transform duration-300"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Start Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="group cursor-pointer"
            >
              <div className="w-32 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="font-semibold">Initialize Variables</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 mt-2 text-xs text-center text-gray-600 dark:text-gray-400 transition-opacity">
                const a = 1, b = 2
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="w-px h-12 bg-gray-400" />
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-400" />
            </motion.div>

            {/* Process Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="w-40 h-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="font-semibold text-center">Calculate Sum<br />c = a + b</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 mt-2 text-xs text-center text-gray-600 dark:text-gray-400 transition-opacity">
                Arithmetic operation
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="w-px h-12 bg-gray-400" />
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-400" />
            </motion.div>

            {/* Decision Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              className="group cursor-pointer"
            >
              <div className="w-40 h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white transform rotate-45 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="font-semibold -rotate-45 text-center">Output<br />Result?</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 mt-8 text-xs text-center text-gray-600 dark:text-gray-400 transition-opacity">
                console.log(c)
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-px h-12 bg-gray-400" />
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-400" />
            </motion.div>

            {/* End Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              className="group cursor-pointer"
            >
              <div className="w-24 h-16 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="font-semibold">End</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 mt-2 text-xs text-center text-gray-600 dark:text-gray-400 transition-opacity">
                Program terminates
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20"
      >
        <div className="flex items-start gap-4">
          <Code className="w-5 h-5 text-primary-dark mt-1" />
          <div>
            <h3 className="font-semibold mb-1">Interactive Flowchart • Click nodes to explore</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This flowchart represents the logical flow of your code. Hover over nodes to see related code snippets and click to explore connections.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlowchartViewer;