import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { TOOLS } from '../lib/tools';
import { Trash2, Clock, ExternalLink, Sparkles, AlertCircle, Type, Hash, FileText, Image, Zap, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const ICON_MAP: Record<string, any> = {
  Type,
  Hash,
  FileText,
  Image,
  Zap,
  TrendingUp
};

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'generations'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(docs);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching history:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'generations', id));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Are you sure?</h3>
            <p className="text-zinc-400 text-center text-sm mb-8">
              Are you sure you want to delete this generation? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(deletingId);
                  setDeletingId(null);
                }}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.displayName || user.email}</h1>
          <p className="text-zinc-400 mt-1">Track your usage and view your generation history.</p>
        </div>
        {!profile?.isPro && (
          <Link
            to="/pricing"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-red-600/20"
          >
            <Sparkles className="w-5 h-5" />
            Upgrade to Pro
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-3xl">
          <p className="text-zinc-500 text-sm font-medium mb-1">Usage Today</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{profile?.usageCount || 0}</span>
            <span className="text-zinc-500 mb-1.5">/ {profile?.isPro ? '∞' : '5'} generations</span>
          </div>
          {!profile?.isPro && (
            <div className="mt-4 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-red-600 h-full transition-all duration-500" 
                style={{ width: `${Math.min(((profile?.usageCount || 0) / 5) * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </div>
        <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-3xl">
          <p className="text-zinc-500 text-sm font-medium mb-1">Plan Status</p>
          <div className="flex items-center gap-2">
            <span className={profile?.isPro ? "text-4xl font-bold text-orange-500" : "text-4xl font-bold"}>
              {profile?.isPro ? 'Pro' : 'Free'}
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-2">
            {profile?.isPro ? 'Unlimited access to all tools' : '5 generations per day limit'}
          </p>
        </div>
      </div>

      {/* History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent History
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-zinc-900/50 border border-white/10 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {history.map((item) => {
              const tool = TOOLS.find(t => t.id === item.tool);
              const IconComponent = tool ? ICON_MAP[tool.icon] : ExternalLink;
              
              return (
                <div key={item.id} className="p-6 bg-zinc-900/50 border border-white/10 rounded-3xl group hover:border-red-600/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-600/10 rounded-xl border border-red-600/20">
                        <IconComponent className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{tool?.name || item.tool}</h3>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                            {item.tool}
                          </span>
                        </div>
                        {tool?.description && (
                          <p className="text-zinc-400 text-sm mt-0.5">{tool.description}</p>
                        )}
                        <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mt-2">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt?.toDate()).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-2 text-zinc-500 hover:text-red-500 transition-colors bg-zinc-800/50 rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold text-lg leading-none">“</span>
                      <p className="text-sm text-zinc-300 font-medium italic">{item.input}</p>
                      <span className="text-red-500 font-bold text-lg leading-none self-end">”</span>
                    </div>
                    <div className="p-5 bg-black/40 rounded-2xl text-sm text-zinc-400 line-clamp-4 prose prose-invert prose-sm max-w-none border border-white/5 group-hover:border-white/10 transition-all">
                      <ReactMarkdown>{item.output}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-900/30 border border-dashed border-white/10 rounded-3xl">
            <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">No history yet. Start generating!</p>
            <Link to="/" className="text-red-500 font-bold mt-2 inline-block hover:underline">Explore Tools</Link>
          </div>
        )}
      </div>
    </div>
  );
};
