import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../lib/tools';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[120px] rounded-full -z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-sm font-medium">
            <Icons.Sparkles className="w-4 h-4" />
            <span>AI-Powered YouTube Growth</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Grow Your Channel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Faster with AI</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Generate viral titles, SEO tags, engaging scripts, and creative thumbnail ideas in seconds. The all-in-one toolkit for content creators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/20"
            >
              Start Creating for Free
            </Link>
            <a
              href="#tools"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all"
            >
              Explore Tools
            </a>
          </div>
        </motion.div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Our AI Toolkit</h2>
          <p className="text-zinc-400">Everything you need to optimize your YouTube workflow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool, index) => {
            const IconComponent = (Icons as any)[tool.icon];
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/tool/${tool.id}`}
                  className="group block p-8 bg-zinc-900/50 border border-white/10 rounded-3xl hover:border-red-600/50 transition-all hover:shadow-2xl hover:shadow-red-600/5"
                >
                  <div className="p-3 bg-zinc-800 rounded-2xl w-fit mb-6 group-hover:bg-red-600 transition-colors">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{tool.name}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{tool.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-red-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Try now <Icons.ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Recommended Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold italic uppercase tracking-tighter">You might also <span className="text-red-600">like...</span></h2>
            <p className="text-zinc-500 text-sm font-medium">Recommended tools for your next viral video.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.slice(3, 6).map((tool, index) => {
            const IconComponent = (Icons as any)[tool.icon];
            return (
              <motion.div
                key={`rec-${tool.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/tool/${tool.id}`}
                  className="group flex items-center gap-4 p-6 bg-zinc-900/30 border border-white/5 rounded-3xl hover:border-red-600/30 transition-all hover:bg-zinc-900/50"
                >
                  <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-red-600 transition-colors">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-red-500 transition-colors">{tool.name}</h3>
                    <p className="text-zinc-500 text-xs line-clamp-1">{tool.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-900/30 rounded-[40px] border border-white/5 p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
              <Icons.Zap className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-zinc-400 text-sm">Generate high-quality content ideas in under 5 seconds using advanced AI models.</p>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-green-500/10 rounded-2xl w-fit">
              <Icons.Search className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">SEO Optimized</h3>
            <p className="text-zinc-400 text-sm">Our tools are trained on YouTube search algorithms to help you rank higher.</p>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl w-fit">
              <Icons.TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold">Growth Focused</h3>
            <p className="text-zinc-400 text-sm">Designed specifically to increase your CTR and audience retention.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
