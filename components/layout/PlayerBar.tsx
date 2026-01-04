"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Repeat, 
  ListMusic,
  Maximize2
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { getSongUrl } from "@/services/player";

export const PlayerBar = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrev, 
    volume, 
    setVolume 
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [songUrl, setSongUrl] = useState<string | undefined>(undefined);

  // 获取真实播放链接
  useEffect(() => {
    if (currentSong?.id) {
      getSongUrl(currentSong.id).then((url) => {
        if (url) {
          setSongUrl(url);
        } else {
          // Fallback to standard MP3 url if API fails or returns null (e.g. copyright)
          setSongUrl(`https://music.163.com/song/media/outer/url?id=${currentSong.id}.mp3`);
        }
      });
    } else {
      setSongUrl(undefined);
    }
  }, [currentSong]);

  // 监听歌曲变化和播放状态
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && songUrl) {
        // Add a small delay or ensure readyState? 
        // Audio element usually handles src change. 
        // We rely on autoPlay or manual play after src change.
        // Actually, changing src pauses the audio. We need to call play() after src loads.
        // But here we just set isPlaying. 
        // We need another effect or logic: when songUrl changes, if isPlaying, play.
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // When songUrl changes, if isPlaying is true, we should try to play
  useEffect(() => {
    if (audioRef.current && songUrl && isPlaying) {
        audioRef.current.play().catch(e => console.log('Playback error:', e));
    }
  }, [songUrl, isPlaying]);


  // 音量控制
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (!audioRef.current || isDragging) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (isPlaying) audioRef.current.play();
    }
  };

  const handleSliderChange = (val: number[]) => {
    setIsDragging(true);
    setCurrentTime(val[0]);
  };

  const handleSliderCommit = (val: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val[0];
    }
    setIsDragging(false);
  };

  const handleEnded = () => {
    playNext();
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[53px] bg-[#212124] border-t border-[#232323] z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
      {/* 隐藏的 Audio 元素 */}
      <audio
        ref={audioRef}
        src={songUrl}

        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* 锁定栏背景 (可选) */}
      {currentSong?.al?.picUrl && (
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url(${currentSong.al.picUrl})` }} />
      )}

      <div className="relative z-10 container mx-auto max-w-[980px] h-full flex items-center justify-between px-4 sm:px-0">
        
        {/* 左侧控制按钮 */}
        <div className="flex items-center gap-2 w-[137px]">
          <button 
            onClick={playPrev}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#e83c3c] text-white hover:bg-[#c93232] transition"
          >
            <SkipBack className="w-4 h-4 fill-white" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#e83c3c] text-white hover:bg-[#c93232] transition mx-1"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>
          
          <button 
            onClick={playNext}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#e83c3c] text-white hover:bg-[#c93232] transition"
          >
            <SkipForward className="w-4 h-4 fill-white" />
          </button>
        </div>

        {/* 中间进度条区域 */}
        <div className="flex flex-1 items-center gap-4 px-4">
          {/* 封面 */}
          <div className="relative w-[34px] h-[34px] rounded bg-[#191919] border border-[#191919] overflow-hidden flex-shrink-0 cursor-pointer">
            {currentSong?.al?.picUrl ? (
              <Image 
                src={currentSong.al.picUrl} 
                alt={currentSong.name} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px]">
                ♫
              </div>
            )}
            <Link href={currentSong ? `/song/${currentSong.id}` : '#'} className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
          </div>

          {/* 播放信息与进度条 */}
          <div className="flex flex-col flex-1 h-[34px] justify-between">
            {/* 顶部信息 */}
            <div className="flex items-center gap-2 h-4 text-xs">
              <Link 
                href={currentSong ? `/song/${currentSong.id}` : '#'} 
                className="text-[#e8e8e8] hover:underline truncate max-w-[200px]"
              >
                {currentSong?.name || "网易云音乐"}
              </Link>
              {currentSong && (
                <>
                   <span className="text-[#9b9b9b] cursor-default">-</span>
                   <Link 
                    href={`/artist/${currentSong.ar[0].id}`} 
                    className="text-[#9b9b9b] hover:underline truncate max-w-[150px]"
                   >
                     {currentSong.ar.map(a => a.name).join('/')}
                   </Link>
                </>
              )}
            </div>

            {/* 进度条 */}
            <div className="flex items-center gap-3 h-4">
              <div className="flex-1 relative group h-2 flex items-center">
                <Slider 
                  value={[currentTime]} 
                  max={duration || 100} 
                  step={1}
                  onValueChange={handleSliderChange}
                  onValueCommit={handleSliderCommit}
                  className="cursor-pointer"
                  trackClassName="bg-[#535353]"
                  rangeClassName="bg-[#C20C0C]"
                />
              </div>
              <div className="text-[10px] text-[#797979] font-sans scale-90 origin-left min-w-[70px]">
                <span className="text-[#a1a1a1]">{formatTime(currentTime)}</span>
                <span className="mx-0.5">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧工具栏 */}
        <div className="flex items-center gap-3 w-[200px] justify-end border-l border-[#191919] pl-3 h-[34px]">
            {/* 音量 */}
            <div className="flex items-center gap-2 group relative">
                <Volume2 className="w-4 h-4 text-[#888] hover:text-white cursor-pointer" />
                <div className="w-16 hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#2b2b2b] p-2 rounded shadow-lg border border-[#191919]">
                    <div className="h-24 flex justify-center">
                        <Slider 
                            orientation="vertical"
                            value={[volume]} 
                            max={100} 
                            step={1}
                            onValueChange={(val) => setVolume(val[0])}
                            className="h-full"
                        />
                    </div>
                </div>
            </div>
            
            {/* 循环模式 (Icon placeholder) */}
            <Repeat className="w-4 h-4 text-[#888] hover:text-white cursor-pointer" />
            
            {/* 播放列表 */}
            <div className="flex items-center bg-[#191919] hover:bg-[#1f1f1f] rounded-l-full rounded-r-full px-2 py-1 cursor-pointer transition ml-2">
                <ListMusic className="w-4 h-4 text-[#888]" />
                <span className="text-[#666] text-xs ml-1 w-6 text-center">
                    {usePlayerStore.getState().playlist.length}
                </span>
            </div>
        </div>

      </div>
    </div>
  );
};
