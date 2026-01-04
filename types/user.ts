export interface UserProfile {
  userId: number;
  nickname: string;
  avatarUrl: string;
  backgroundUrl: string;
  signature?: string;
  gender?: number; // 1: male, 2: female
  vipType?: number;
}

export interface LoginStatusResponse {
  data: {
    code: number;
    account: {
      id: number;
      userName: string;
      status: number;
    } | null;
    profile: UserProfile | null;
  };
}
