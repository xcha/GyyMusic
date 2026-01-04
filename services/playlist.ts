import request from '@/lib/request';
import { Playlist, Song } from '@/types/music';

/**
 * 获取歌单详情
 * @param id 歌单 id
 */
export const getPlaylistDetail = async (id: number | string) => {
  try {
    const res = await request.get<{ playlist: Playlist }>('/playlist/detail', {
      params: { id },
    });
    return res.playlist;
  } catch (error) {
    console.error('getPlaylistDetail error:', error);
    return null;
  }
};

/**
 * 获取歌单所有歌曲
 * @param id 歌单 id
 * @param limit 限制获取歌曲数量，默认 100
 */
export const getPlaylistTracks = async (id: number | string, limit = 100, offset = 0) => {
  try {
    // 尝试获取所有歌曲
    const res = await request.get<any>('/playlist/track/all', {
      params: { id, limit, offset, timestamp: Date.now() },
    });
    
    if (res.songs && res.songs.length > 0) {
      console.log('Successfully fetched from /playlist/track/all:', res.songs.length);
      return res.songs;
    } else {
      console.log('No songs found in /playlist/track/all response.');
      return [];
    }
  } catch (error) {
    console.error('getPlaylistTracks error:', error);
    return [];
  }
};

// /**
//  * 获取歌曲详情
//  * @param ids 歌曲 id 列表, 如 '1,2,3'
//  */
// export const getSongDetail = async (ids: string) => {
//     try {
//       const res = await request.get<{ songs: Song[] }>('/song/detail', {
//         params: { ids },
//       });
//       return res.songs || [];
//     } catch (error) {
//       console.error('getSongDetail error:', error);
//       return [];
//     }
// };

/**
 * 获取用户歌单
 * @param uid 用户 id
 */
export const getUserPlaylists = async (uid: number) => {
  try {
    const res = await request.get<{ playlist: Playlist[] }>('/user/playlist', {
      params: { uid },
    });
    return res.playlist || [];
  } catch (error) {
    console.error('getUserPlaylists error:', error);
    return [];
  }
};
