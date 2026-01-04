'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchSongs } from '@/services/search';
import { Song } from '@/types/music';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { currentSong, isPlaying, setPlaylist, setIsPlaying } = usePlayerStore();

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchSongs(query).then((data) => {
        setSongs(data);
        setLoading(false);
      });
    }
  }, [query]);

  const handlePlay = (song: Song) => {
    // If playing the same song, toggle pause
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
      return;
    }
    // Play new song and update playlist context (optional: make playlist just this search result or append)
    // For simplicity, we set the search results as the current playlist
    setPlaylist(songs);
    usePlayerStore.setState({ currentSong: song, isPlaying: true });
  };

  if (!query) return <div className="p-8 text-center text-gray-500">请输入搜索关键词</div>;
  if (loading) return <div className="p-8 text-center text-gray-500">搜索中...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">搜索 &quot;{query}&quot; 的结果</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-[50px_1fr_1fr_1fr_80px] gap-4 p-3 border-b bg-gray-50 text-sm text-gray-500">
          <div className="text-center">操作</div>
          <div>音乐标题</div>
          <div>歌手</div>
          <div>专辑</div>
          <div>时长</div>
        </div>
        <div>
          {songs.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <div 
                key={song.id} 
                className={`grid grid-cols-[50px_1fr_1fr_1fr_80px] gap-4 p-3 items-center hover:bg-gray-50 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                onDoubleClick={() => handlePlay(song)}
              >
                <div className="flex justify-center">
                  <span className="text-gray-400 mr-2">{index + 1}</span>
                </div>
                <div className={`font-medium truncate ${isCurrent ? 'text-red-600' : 'text-gray-800'}`}>
                  {song.name}
                </div>
                <div className="truncate text-gray-600">
                  {song.ar.map(a => a.name).join(' / ')}
                </div>
                <div className="truncate text-gray-600">
                  {song.al.name}
                </div>
                <div className="text-gray-400">
                  {Math.floor(song.dt / 1000 / 60)}:{(Math.floor(song.dt / 1000) % 60).toString().padStart(2, '0')}
                </div>
              </div>
            );
          })}
          {songs.length === 0 && (
            <div className="p-8 text-center text-gray-500">未找到相关歌曲</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">加载中...</div>}>
      <SearchResults />
    </Suspense>
  );
}
