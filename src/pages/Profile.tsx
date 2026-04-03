import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Save, Check, Loader2, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateProfile({ displayName: displayName.trim() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          User <span className="text-red-600">Profile</span>
        </h1>
        <p className="text-zinc-500 font-medium">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" />
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-zinc-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-zinc-600 font-medium">Email cannot be changed as it is linked to your Google account.</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm">
              <Check className="w-5 h-5 flex-shrink-0" />
              <p>Profile updated successfully!</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !displayName.trim() || displayName === profile.displayName}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-red-600/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>

        <div className="pt-8 border-t border-white/5">
          <div className="flex items-center justify-between p-6 bg-black/30 rounded-3xl border border-white/5">
            <div className="space-y-1">
              <p className="text-sm font-bold text-white uppercase tracking-widest">Account Status</p>
              <p className="text-xs text-zinc-500 font-medium">
                {profile.isPro ? 'You are a Pro member with unlimited access.' : 'You are on the Free plan with limited daily usage.'}
              </p>
            </div>
            {profile.isPro ? (
              <span className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-xs text-white font-black uppercase tracking-tighter rounded-xl shadow-lg shadow-red-600/20">
                Pro Member
              </span>
            ) : (
              <span className="px-4 py-2 bg-zinc-800 text-xs text-zinc-400 font-black uppercase tracking-tighter rounded-xl border border-white/5">
                Free Plan
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
