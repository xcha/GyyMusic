export interface Song {
  id: number;
  name: string;
  ar: Artist[];
  al: Album;
  dt: number; // 时长
  url?: string; // 播放链接
}

export interface Artist {
  id: number;
  name: string;
  picUrl?: string;
}

export interface Album {
  id: number;
  name: string;
  picUrl: string;
}

export interface Playlist {
  id: number;
  name: string;
  coverImgUrl?: string;
  picUrl?: string; // /personalized returns picUrl
  description: string;
  trackCount: number;
  playCount: number;
  creator: User;
}

export interface User {
  userId: number;
  nickname: string;
  avatarUrl: string;
}
