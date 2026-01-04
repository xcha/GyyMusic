import request from '@/lib/request';
import { Song } from '@/types/music';

export interface SearchResult {
  result: {
    songs: Song[];
    songCount: number;
  };
}

export const searchSongs = async (keywords: string): Promise<Song[]> => {
  try {
    const res = await request.get<SearchResult>('/cloudsearch', {
      params: { keywords },
    });
    return res.result?.songs || [];
  } catch (error) {
    console.error('Search songs error:', error);
    return [];
  }
};
