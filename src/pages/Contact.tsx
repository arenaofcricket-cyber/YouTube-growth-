import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Get in <span className="text-red-600">Touch</span></h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Have questions or need help growing your channel? Our team is here to support you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-600/10 rounded-xl">
              <Mail className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Email Us</h3>
              <p className="text-zinc-400 text-sm">support@ytgrowthai.com</p>
              <p className="text-zinc-500 text-xs mt-1">We typically reply within 24 hours.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600/10 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Community Support</h3>
              <p className="text-zinc-400 text-sm">Join our Discord server</p>
              <p className="text-zinc-500 text-xs mt-1">Get help from other creators.</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-2xl font-bold">Message Sent!</h3>
              <p className="text-zinc-400">Thank you for reaching out. We'll get back to you soon.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-red-500 font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Message</label>
                <textarea 
                  required
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all min-h-[120px] resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
