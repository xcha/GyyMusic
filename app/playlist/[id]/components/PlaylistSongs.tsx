"use client";

import { Song } from "@/types/music";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlaylistTracks } from "@/services/playlist";

interface Props {
  songs: Song[];
  playlistId?: number | string;
}

export default function PlaylistSongs({ songs, playlistId }: Props) {
  const { playSong, setPlaylist, currentSong } = usePlayerStore();
  const [data, setData] = useState<Song[]>(songs || []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 100;

  const handlePlay = (song: Song) => {
    setPlaylist(data);
    playSong(song);
  };

  const formatDuration = (dt: number) => {
    const minutes = Math.floor(dt / 1000 / 60);
    const seconds = Math.floor((dt / 1000) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayAll = () => {
    if (data.length > 0) {
      setPlaylist(data);
      playSong(data[0]);
    }
  };

  const loadMore = async () => {
    if (!playlistId || loadingMore || !hasMore) return;
    setLoadingMore(true);
    const more = await getPlaylistTracks(playlistId, PAGE_SIZE, data.length);
    if (more.length > 0) {
      setData(prev => [...prev, ...more]);
      if (more.length < PAGE_SIZE) setHasMore(false);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    setData(songs || []);
    setHasMore(true);
  }, [songs]);

  return (
    <div className="w-full border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayAll}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
          >
            播放全部
          </button>
          <span className="text-xs text-gray-500">共 {data.length} 首</span>
        </div>
        {playlistId && (
          <button
            onClick={loadMore}
            disabled={loadingMore || !hasMore}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-xs disabled:opacity-50"
          >
            {hasMore ? (loadingMore ? "加载中..." : "加载更多") : "已全部加载"}
          </button>
        )}
      </div>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="h-9 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-gray-500">
            <th className="w-12 text-center font-normal"></th>
            <th className="font-normal px-2">歌曲标题</th>
            <th className="w-24 font-normal px-2">时长</th>
            <th className="w-40 font-normal px-2">歌手</th>
            <th className="w-52 font-normal px-2">专辑</th>
          </tr>
        </thead>
        <tbody>
          {data.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <tr 
                key={song.id} 
                className={`
                  h-8 hover:bg-gray-100 dark:hover:bg-zinc-800 group
                  ${(index % 2 === 0) ? 'bg-white dark:bg-black' : 'bg-gray-50 dark:bg-zinc-900'}
                `}
                onDoubleClick={() => handlePlay(song)}
              >
                <td className="text-center text-gray-400 w-12">
                  <div className="flex items-center justify-center">
                    <span className={`group-hover:hidden ${isCurrent ? 'text-red-600' : ''}`}>
                      {index + 1}
                    </span>
                    <Play 
                      onClick={() => handlePlay(song)}
                      className={`w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer hidden group-hover:block ${isCurrent ? 'fill-red-600 text-red-600 block' : ''}`} 
                    />
                  </div>
                </td>
                <td className="px-2 truncate max-w-[300px]">
                  <span className={`cursor-pointer hover:underline ${isCurrent ? 'text-red-600' : 'text-gray-800 dark:text-gray-200'}`}>
                    {song.name || '未知歌曲'}
                  </span>
                </td>
                <td className="px-2 text-gray-500 font-sans">
                  {formatDuration(song.dt || 0)}
                </td>
                <td className="px-2 truncate max-w-[150px] text-gray-600 dark:text-gray-400">
                  <span className="cursor-pointer hover:underline">
                    {song.ar?.[0]?.name || '未知歌手'}
                  </span>
                </td>
                <td className="px-2 truncate max-w-[200px] text-gray-600 dark:text-gray-400">
                  <span className="cursor-pointer hover:underline">
                    {song.al?.name || '未知专辑'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
