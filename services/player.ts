import request from '@/lib/request';

interface SongUrlResponse {
  data: {
    id: number;
    url: string;
    br: number;
    size: number;
    md5: string;
    code: number;
    expi: number;
    type: string;
    gain: number;
    fee: number;
    uf: any;
    payed: number;
    flag: number;
    canExtend: boolean;
    freeTrialInfo: any;
    level: string;
    encodeType: string;
    start?: number;
    end?: number;
  }[];
}

export const getSongUrl = async (
  id: number,
  options?: {
    level?: 'standard' | 'higher' | 'exhigh' | 'lossless' | 'hires' | 'jyeffect' | 'sky' | 'dolby' | 'jymaster';
    unblock?: boolean;
  }
) => {
  try {
    const res = await request.get<SongUrlResponse>('/song/url', {
      params: { id, level: options?.level ?? 'standard', unblock: options?.unblock ?? false },
    });
    if (res.data && res.data.length > 0) {
      return res.data[0].url || null;
    }
    return null;
  } catch (error) {
    console.error('Get song url error:', error);
    return null;
  }
};
