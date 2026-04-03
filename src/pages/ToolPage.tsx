import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { TOOLS } from '../lib/tools';
import { Generator } from '../components/Generator';
import * as Icons from 'lucide-react';

export const ToolPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tool = TOOLS.find(t => t.id === id);

  if (!tool) {
    return <Navigate to="/" />;
  }

  const IconComponent = (Icons as any)[tool.icon];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          <p className="text-zinc-400">Optimize your video with AI-generated {tool.id}s</p>
        </div>
      </div>

      <Generator tool={tool} />

      {/* Related Tools Section */}
      <div className="pt-12 border-t border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold italic uppercase tracking-tighter">You might also <span className="text-red-600">like...</span></h2>
            <p className="text-zinc-500 text-sm font-medium">Other relevant tools to help your channel grow.</p>
          </div>
          <Link to="/" className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest">
            View All Tools
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.filter(t => t.id !== tool.id).slice(0, 2).map((relatedTool) => {
            const RelatedIcon = (Icons as any)[relatedTool.icon];
            return (
              <Link
                key={relatedTool.id}
                to={`/tool/${relatedTool.id}`}
                className="group p-6 bg-zinc-900/30 border border-white/5 rounded-3xl hover:border-red-600/30 transition-all hover:bg-zinc-900/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-red-600 transition-colors">
                    <RelatedIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-red-500 transition-colors">{relatedTool.name}</h3>
                    <p className="text-zinc-500 text-xs line-clamp-1">{relatedTool.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
