import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Lock, Save, Zap, Flame, Star, Award, Heart } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { setUser } from '@/store/slices/authSlice';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', bio: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', bio: user.bio || '', phone: user.phone || '' });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch('/users/me', form);
      dispatch(setUser(data.data));
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await api.patch('/users/me/password', pwForm);
      toast.success('Password updated!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setPwSaving(false); }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const { data } = await api.patch('/users/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      dispatch(setUser(data.data));
      toast.success('Avatar updated!');
    } catch { toast.error('Upload failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>My Profile</h1>

      {/* Avatar */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />}
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
            <Camera className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          </label>
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          <span className="badge badge-primary capitalize mt-1">{user?.role}</span>
        </div>
      </div>

      {/* XP & Badges */}
      {(user?.xpPoints > 0 || user?.badges?.length > 0 || user?.wishlist?.length > 0) && (
        <div className="card p-5 mb-6">
          <h3 className="font-display text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {user?.xpPoints > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#F4845F15' }}>
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.xpPoints} XP</span>
              </div>
            )}
            {user?.streak > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#F59E0B15' }}>
                <Flame className="w-4 h-4" style={{ color: '#F59E0B' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.streak} days</span>
              </div>
            )}
            {user?.badges?.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#10B98115' }}>
                <Award className="w-4 h-4" style={{ color: '#10B981' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{badge.name}</span>
              </div>
            ))}
            {user?.wishlist?.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#EC489915' }}>
                <Heart className="w-4 h-4" style={{ color: '#EC4899' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.wishlist.length} in wishlist</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist */}
      {user?.wishlist?.length > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="font-display text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>My Wishlist</h3>
          <div className="space-y-2">
            {user.wishlist.map((course, i) => (
              <a key={i} href={`/course/${course.slug || course._id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] no-underline" style={{ border: '1px solid var(--border)' }}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt="" className="w-10 h-10 rounded object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center"><Award className="w-4 h-4 text-primary" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>₹{course.price || 0}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Profile form */}
      <form onSubmit={handleSave} className="card p-6 mb-6 space-y-4">
        <h3 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>Personal Info</h3>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Bio</label>
          <textarea className="input" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91..." />
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary btn-sm"><Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>

      {/* Password */}
      {!user?.oauthProvider && (
        <form onSubmit={handlePasswordChange} className="card p-6 space-y-4">
          <h3 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
          <input type="password" className="input" placeholder="Current password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
          <input type="password" className="input" placeholder="New password (min 8 chars)" minLength={8} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
          <button type="submit" disabled={pwSaving} className="btn btn-secondary btn-sm"><Lock className="w-4 h-4" />{pwSaving ? 'Updating...' : 'Update Password'}</button>
        </form>
      )}
    </div>
  );
}
