"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { Shield, Trash2, Users, Trophy, Search } from "lucide-react";
import Link from "next/link";

interface AdminUser {
  id: string;
  email: string;
  display_name: string;
  xp: number;
  level: number;
  level_name: string;
  streak_current: number;
  total_minutes: number;
  telegram_handle: string;
  is_admin: boolean;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (!user.is_admin) { router.push("/dashboard"); return; }
    loadUsers();
  }, [user, router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.adminListUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch { toast("Failed to load users", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.adminDeleteUser(id);
      toast(`Deleted ${name}`, "success");
      setUsers(users.filter((u) => u.id !== id));
    } catch { toast("Failed to delete", "error"); }
  };

  if (!user?.is_admin) return null;

  const filtered = users.filter((u) =>
    u.display_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={20} className="text-primary" />
          <h1 className="text-3xl font-black uppercase tracking-tighter text-text">Admin Panel</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-0 border-4 border-border mb-6">
          <div className="p-4 text-center border-r-2 border-border">
            <div className="text-2xl font-black text-text">{users.length}</div>
            <div className="text-[10px] font-bold uppercase text-text-muted">Total Users</div>
          </div>
          <div className="p-4 text-center border-r-2 border-border">
            <div className="text-2xl font-black text-text">{users.filter((u) => u.is_admin).length}</div>
            <div className="text-[10px] font-bold uppercase text-text-muted">Admins</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-black text-text">{users.reduce((sum, u) => sum + u.total_minutes, 0).toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase text-text-muted">Total Minutes</div>
          </div>
        </div>

        {/* Search */}
        <div className="border-4 border-border mb-0">
          <div className="px-4 py-3 flex items-center gap-3 bg-surface-sunken border-b-2 border-border">
            <Search size={14} className="text-text-muted" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="flex-1 bg-transparent text-sm text-text font-medium outline-none placeholder:text-text-muted" />
            <span className="text-xs text-text-muted font-mono">{filtered.length} users</span>
          </div>
        </div>

        {/* User Table */}
        <div className="border-4 border-border border-t-0">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_80px_80px_60px_60px_50px] gap-0 px-4 py-2 bg-surface-sunken border-b-2 border-border text-[10px] font-black uppercase tracking-wider text-text-muted">
            <div>Name</div>
            <div>Email</div>
            <div>Level</div>
            <div>XP</div>
            <div>Streak</div>
            <div>Mins</div>
            <div></div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm font-bold uppercase animate-pulse">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-muted">No users found</div>
          ) : (
            filtered.map((u) => (
              <div key={u.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px_80px_60px_60px_50px] gap-2 sm:gap-0 px-4 py-3 border-b-2 border-border hover:bg-surface-sunken transition-colors items-center">
                <Link href={`/users/${u.id}`} prefetch={false} className="text-sm font-bold text-text hover:text-primary flex items-center gap-2">
                  <div className="w-6 h-6 bg-surface-sunken border border-border flex items-center justify-center text-[10px] font-black shrink-0">
                    {u.display_name[0].toUpperCase()}
                  </div>
                  {u.display_name}
                  {u.is_admin && <Shield size={10} className="text-primary" />}
                </Link>
                <div className="text-xs text-text-muted font-mono truncate">{u.email}</div>
                <div className="text-xs font-bold text-text">Lvl {u.level}</div>
                <div className="text-xs font-mono text-text">{u.xp}</div>
                <div className="text-xs text-text">{u.streak_current}d</div>
                <div className="text-xs font-mono text-text">{u.total_minutes}</div>
                <div>
                  {!u.is_admin && (
                    <button onClick={() => handleDelete(u.id, u.display_name)}
                      className="p-1 text-text-muted hover:text-danger transition-colors" title="Delete user">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
