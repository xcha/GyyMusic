'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { getUserPlaylists } from '@/services/playlist';
import { Playlist } from '@/types/music';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from '@/components/auth/LoginModal';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const { isLoggedIn, profile } = useUserStore();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [importId, setImportId] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && profile) {
      setLoading(true);
      getUserPlaylists(profile.userId).then((data) => {
        setPlaylists(data);
        setLoading(false);
      });
    }
  }, [isLoggedIn, profile]);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (importId.trim()) {
      // Extract ID if it's a link
      let id = importId.trim();
      const match = id.match(/id=(\d+)/);
      if (match) {
        id = match[1];
      }
      router.push(`/playlist/${id}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="p-8 bg-gray-100 rounded-lg text-center">
          <p className="mb-4 text-gray-600">登录后查看我的音乐</p>
          <button 
            onClick={() => setShowLogin(true)}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            立即登录
          </button>
        </div>
        
        <div className="mt-12 w-full max-w-md p-6 bg-white border rounded-lg">
          <h3 className="text-lg font-bold mb-4">导入歌单</h3>
          <form onSubmit={handleImport} className="flex gap-2">
            <input 
              type="text" 
              placeholder="输入歌单ID或链接" 
              className="flex-1 px-3 py-2 border rounded text-sm"
              value={importId}
              onChange={(e) => setImportId(e.target.value)}
            />
            <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded text-sm">
              打开
            </button>
          </form>
        </div>

        <LoginModal open={showLogin} onOpenChange={setShowLogin} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <img src={profile?.avatarUrl} alt={profile?.nickname} className="w-16 h-16 rounded-full border-2 border-gray-200" />
        <div>
          <h1 className="text-2xl font-bold">{profile?.nickname} 的音乐</h1>
          <p className="text-sm text-gray-500">
            Lv.{profile?.vipType || 0}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <div>
          <h2 className="text-xl font-bold mb-6 border-b pb-2">我的歌单 ({playlists.length})</h2>
          {loading ? (
            <div>加载中...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <Link href={`/playlist/${playlist.id}`} key={playlist.id} className="group">
                  <div className="relative aspect-square rounded-md overflow-hidden mb-2 bg-gray-100">
                    {playlist.coverImgUrl && (
                      <Image 
                        src={playlist.coverImgUrl} 
                        alt={playlist.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-medium truncate group-hover:underline">{playlist.name}</h3>
                  <p className="text-xs text-gray-500">{playlist.trackCount}首</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
           <div className="p-6 bg-gray-50 border rounded-lg sticky top-24">
            <h3 className="text-lg font-bold mb-4">导入歌单</h3>
            <p className="text-xs text-gray-500 mb-4">输入网易云音乐歌单链接或ID，即可直接查看歌单内容。</p>
            <form onSubmit={handleImport} className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="例如: 24381616" 
                className="w-full px-3 py-2 border rounded text-sm"
                value={importId}
                onChange={(e) => setImportId(e.target.value)}
              />
              <button type="submit" className="w-full px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                查看歌单
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
