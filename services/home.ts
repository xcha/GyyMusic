import request from '@/lib/request';
import { Playlist, Song } from '@/types/music';

export interface BannerItem {
  imageUrl: string;
  targetId: number;
  targetType: number;
  titleColor: string;
  typeTitle: string;
  url: string | null;
}

/**
 * 获取首页 Banner
 * @param type 0: pc, 1: android, 2: iphone, 3: ipad
 */
export const getBanner = async (type = 0) => {
  try {
    const res = await request.get<{ banners: BannerItem[] }>('/banner', {
      params: { type },
    });
    return res.banners || [];
  } catch (error) {
    console.error('getBanner error:', error);
    return [];
  }
};

/**
 * 获取推荐歌单
 * @param limit 取出数量 , 默认为 10
 */
export const getPersonalized = async (limit = 10) => {
  try {
    const res = await request.get<{ result: Playlist[] }>('/personalized', {
      params: { limit },
    });
    return res.result || [];
  } catch (error) {
    console.error('getPersonalized error:', error);
    return [];
  }
};

/**
 * 获取推荐新音乐
 */
export const getNewSongs = async () => {
  try {
    const res = await request.get<{ result: { id: number; song: Song }[] }>('/personalized/newsong');
    return res.result?.map((item) => item.song) || [];
  } catch (error) {
    console.error('getNewSongs error:', error);
    return [];
  }
};
