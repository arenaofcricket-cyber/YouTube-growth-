import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateContent } from '../lib/gemini';
import { Tool } from '../lib/tools';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { doc, updateDoc, collection, addDoc, serverTimestamp, increment } from 'firebase/firestore';
import { Loader2, Send, Copy, Check, AlertCircle, Sparkles, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Generator: React.FC<{ tool: Tool }> = ({ tool }) => {
  const { user, profile } = useAuth();
  const [input, setInput] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Hype');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (tool.id === 'script') {
      setTone('Funny');
    } else if (tool.id === 'title') {
      setTone('Hype');
    } else if (tool.id === 'description') {
      setTone('Informative');
    }
    setInput('');
    setResult('');
    setError('');
  }, [tool.id]);

  const handleGenerate = async () => {
    if (!user || !profile) {
      setError('Please login to use this tool.');
      return;
    }

    if (!profile.isPro && profile.usageCount >= 5) {
      setError('Daily limit reached. Please upgrade to Pro for unlimited usage.');
      return;
    }

    if (!input.trim()) return;

    setLoading(true);
    setError('');
    try {
      let finalPrompt = tool.prompt;
      if (finalPrompt.includes('{topic}')) {
        finalPrompt = finalPrompt.replace('{topic}', input);
      } else {
        finalPrompt += input;
      }

      if (finalPrompt.includes('{audience}')) {
        finalPrompt = finalPrompt.replace('{audience}', audience || 'General YouTube Audience');
      }

      if (finalPrompt.includes('{tone}')) {
        finalPrompt = finalPrompt.replace('{tone}', tone);
      }

      const output = await generateContent(finalPrompt, tool.systemInstruction);
      
      if (!output) {
        throw new Error('AI returned an empty response. Please try with more specific keywords.');
      }

      setResult(output);

      // Update usage count
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, {
          usageCount: increment(1)
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }

      // Save to history
      try {
        await addDoc(collection(db, 'generations'), {
          uid: user.uid,
          tool: tool.id,
          input: input + (audience ? ` (Audience: ${audience})` : '') + (['title', 'script', 'description'].includes(tool.id) ? ` (Tone: ${tone})` : ''),
          output: output,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'generations');
      }

    } catch (err: any) {
      console.error('Generation error:', err);
      
      let errorMessage = err.message || '';
      
      // Handle Firestore JSON errors
      try {
        const parsed = JSON.parse(errorMessage);
        if (parsed.error && parsed.operationType) {
          setError(`Database error (${parsed.operationType}): ${parsed.error}. Please check your connection.`);
          return;
        }
      } catch (e) {
        // Not a JSON error, continue
      }

      const lowerMessage = errorMessage.toLowerCase();
      
      if (lowerMessage.includes('safety')) {
        setError('Content was blocked by AI safety filters. Please try a different topic or more appropriate keywords.');
      } else if (lowerMessage.includes('recitation')) {
        setError('Content was blocked due to copyright recitation. Please rephrase your request.');
      } else if (lowerMessage.includes('no response') || lowerMessage.includes('empty')) {
        setError('AI returned an empty response. This can happen with very short or ambiguous prompts.');
      } else if (lowerMessage.includes('quota') || lowerMessage.includes('429') || lowerMessage.includes('limit')) {
        setError('AI service is currently busy or rate limited. Please wait a moment and try again.');
      } else if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (lowerMessage.includes('permission') || lowerMessage.includes('insufficient')) {
        setError('Database error: Insufficient permissions. Please ensure you are logged in correctly.');
      } else if (lowerMessage.includes('invalid') || lowerMessage.includes('400')) {
        setError('Invalid request. Please check your input and try again.');
      } else {
        setError(errorMessage || 'An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {tool.name}
              {profile?.isPro && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-red-600 to-orange-500 text-[10px] text-white font-black uppercase tracking-tighter rounded-md shadow-lg shadow-red-600/20">
                  Pro
                </span>
              )}
            </h2>
            <p className="text-zinc-400 text-sm">{tool.description}</p>

            <div className="space-y-4">
              {!profile?.isPro && profile && (
                <div className={cn(
                  "bg-zinc-900/80 border rounded-2xl p-4 space-y-3 transition-all duration-500",
                  profile.usageCount >= 4 ? "border-orange-500/50 bg-orange-500/5" : "border-white/5"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        profile.usageCount >= 4 ? "bg-orange-500/20" : "bg-red-600/10"
                      )}>
                        <Sparkles className={cn(
                          "w-4 h-4",
                          profile.usageCount >= 4 ? "text-orange-500" : "text-red-500"
                        )} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-wider">Free Credits</p>
                        <p className="text-[10px] text-zinc-500 font-medium">Daily limit resets at midnight</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-black",
                        profile.usageCount >= 4 ? "text-orange-500" : "text-white"
                      )}>{Math.max(0, 5 - profile.usageCount)} / 5</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Remaining</p>
                    </div>
                  </div>
                  <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "absolute inset-y-0 left-0 transition-all duration-1000 ease-out rounded-full",
                        profile.usageCount >= 4 ? "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                      )}
                      style={{ width: `${Math.min((profile.usageCount / 5) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {!profile?.isPro && profile && profile.usageCount >= 3 && profile.usageCount < 5 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-top-2 duration-500">
                  <div className="p-2 bg-orange-500/20 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Running low on credits!</p>
                    <p className="text-xs text-zinc-400">You have {5 - profile.usageCount} generations left today. Upgrade to Pro for unlimited access.</p>
                  </div>
                  <Link to="/pricing" className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-xs transition-all whitespace-nowrap shadow-lg shadow-orange-500/20">
                    Upgrade Now
                  </Link>
                </div>
              )}

              {!profile?.isPro && profile && profile.usageCount >= 5 ? (
                <div className="bg-red-600/5 border border-red-600/20 rounded-3xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Daily Limit Reached</h3>
                    <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                      You've used all your free generations for today. Upgrade to Pro for unlimited access to all tools and faster generation.
                    </p>
                  </div>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-red-600/20"
                  >
                    Upgrade to Pro Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Enter video topic or keywords</label>
                    <div className="relative">
                      <textarea
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="e.g. How to grow on YouTube in 2026"
                        className="w-full bg-black border border-white/10 rounded-2xl p-4 min-h-[120px] text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all resize-none"
                      />
                      <div className="absolute bottom-4 right-4 flex items-center gap-3">
                        <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest hidden sm:block">
                          Powered by Gemini 3 Flash
                        </span>
                        <button
                          onClick={handleGenerate}
                          disabled={loading || !input.trim()}
                          className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {tool.id === 'title' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Target Audience (Optional)</label>
                        <input
                          type="text"
                          value={audience}
                          onChange={(e) => setAudience(e.target.value)}
                          placeholder="e.g. Beginners, Tech Enthusiasts, Gamers"
                          className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Tone</label>
                        <div className="relative">
                          <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none pr-10"
                          >
                            <option value="Hype">Hype (Viral Style)</option>
                            <option value="Educational">Educational (Professional)</option>
                            <option value="Shocking">Shocking (Clickbait-ish)</option>
                            <option value="Storytelling">Storytelling (Narrative)</option>
                            <option value="Minimalist">Minimalist (Clean)</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {tool.id === 'script' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Tone</label>
                      <div className="relative">
                        <select
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none pr-10"
                        >
                          <option value="Funny">Funny</option>
                          <option value="Informative">Informative</option>
                          <option value="Inspiring">Inspiring</option>
                          <option value="Dramatic">Dramatic</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {tool.id === 'description' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Tone</label>
                      <div className="relative">
                        <select
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none pr-10"
                        >
                          <option value="Informative">Informative</option>
                          <option value="Engaging">Engaging</option>
                          <option value="Promotional">Promotional</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

            {error && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                <div className="flex items-center gap-2 flex-1">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setError('')}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {error.includes('upgrade') ? (
                    <Link to="/pricing" className="font-bold underline whitespace-nowrap">Upgrade</Link>
                  ) : (
                    <button 
                      onClick={handleGenerate}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all text-xs whitespace-nowrap"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Generated Result
            </h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-all border border-white/5"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </div>
          <div className="markdown-content bg-black/30 p-6 rounded-2xl border border-white/5 relative group">
            <ReactMarkdown>{result}</ReactMarkdown>
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/20"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Entire Result'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
