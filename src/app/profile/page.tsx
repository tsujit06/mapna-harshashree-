'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, User } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  mobile: string;
  avatar_url?: string | null;
  date_of_birth?: string | null;
}

type PageProps = {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export default function ProfilePage(props: PageProps) {
  if (props.params) React.use(props.params);
  if (props.searchParams) React.use(props.searchParams);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, mobile, avatar_url, date_of_birth')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        setError('Failed to load profile.');
      } else {
        if (!data) {
          // Fallback if no profile row exists yet: initialize from auth user metadata
          const fallback: Profile = {
            id: user.id,
            full_name: (user.user_metadata?.full_name as string) || '',
            mobile: (user.user_metadata?.mobile as string) || '',
            avatar_url: null,
          };
          setProfile(fallback);
          setAvatarPreview(null);
        } else {
          const typed = data as Profile;
          setProfile(typed);
          setAvatarPreview(typed.avatar_url ?? null);
          setDateOfBirth(typed.date_of_birth ?? '');
        }
      }

      setLoading(false);
    };

    load();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    let avatarUrl = profile.avatar_url ?? null;

    // If a new avatar file is selected, upload it to the "photo" bucket
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop() || 'jpg';
      const filePath = `avatars/${profile.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('photo')
        .upload(filePath, avatarFile, {
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);
        setError('Failed to upload profile image.');
        setSaving(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('photo').getPublicUrl(filePath);

      avatarUrl = publicUrl;
    }

    // Normalize mobile to always include +91 prefix
    let normalizedMobile = profile.mobile.trim().replace(/\s+/g, '');
    if (!normalizedMobile.startsWith('+91')) {
      normalizedMobile = normalizedMobile.replace(/^0+/, '');
      normalizedMobile = `+91${normalizedMobile}`;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        mobile: normalizedMobile,
        avatar_url: avatarUrl,
        // Store date of birth as ISO date (yyyy-mm-dd) or null
        date_of_birth: dateOfBirth || null,
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error(updateError);
      setError('Failed to update profile.');
    } else {
      setSuccess('Profile updated successfully.');
      setProfile((p) => (p ? { ...p, avatar_url: avatarUrl } : p));
      if (avatarUrl) {
        setAvatarPreview(avatarUrl);
      }
    }

    setSaving(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-zinc-500 hover:text-red-600 transition-colors text-sm"
            aria-label="Back to Dashboard"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <span className="border-l-2 border-b-2 border-current rotate-45 inline-block h-2.5 w-2.5" />
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white">Profile</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-xl">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Account details
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            Update your basic information used across QRgency.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium border border-emerald-100 dark:border-emerald-800">
              {success}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Profile avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-zinc-600 dark:text-zinc-300">
                    {profile?.full_name?.[0] ?? 'U'}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Profile photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="text-xs text-zinc-600 dark:text-zinc-300"
                />
                <p className="text-[11px] text-zinc-400">
                  For best results, use a square image.
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required
                value={profile?.full_name ?? ''}
                onChange={(e) => setProfile((p) => (p ? { ...p, full_name: e.target.value } : p))}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-900 dark:text-white text-sm"
                placeholder="John Doe"
              />
            </div>

            {/* Date of birth */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Date of birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-900 dark:text-white text-sm"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                This will be used to calculate your age for emergency info.
              </p>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Mobile number
              </label>
              <input
                type="tel"
                required
                value={profile?.mobile ?? ''}
                onChange={(e) => setProfile((p) => (p ? { ...p, mobile: e.target.value } : p))}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-900 dark:text-white text-sm"
                placeholder="+91 98765 43210"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:scale-[0.98] transition disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save changes'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

