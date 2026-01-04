import request from '@/lib/request';
import { UserProfile } from '@/types/user';

interface LoginResponse {
  code: number;
  profile: UserProfile;
  cookie: string;
}
// 登录接口
interface QrKeyResponse {
  data: {
    unikey: string;
  };
}
// 二维码登录接口
interface QrCreateResponse {
  data: {
    qrurl: string;
    qrimg: string;
  };
}
// 二维码登录检查接口
interface QrCheckResponse {
  code: number;
  message: string;
  cookie: string;
}

// Phone Login
export const loginCellPhone = async (phone: string, password: string) => {
  return request.post<LoginResponse>('/login/cellphone', {
    phone,
    password,
  });
};

export const loginCellPhoneWithCaptcha = async (phone: string, captcha: string) => {
  return request.post<LoginResponse>('/login/cellphone', {
    phone,
    captcha,
  });
};

export const sendCaptcha = async (phone: string, ctcode = '86') => {
  return request.get('/captcha/sent', {
    params: { phone, ctcode },
  });
};

export const verifyCaptcha = async (phone: string, captcha: string, ctcode = '86') => {
  return request.get('/captcha/verify', {
    params: { phone, captcha, ctcode },
  });
};

// QR Code Flow
// 获取二维码登录密钥接口
export const getQrKey = async () => {
  return request.get<QrKeyResponse>('/login/qr/key', {
    params: { timestamp: Date.now() },
  });
};
// 创建二维码登录接口
export const getQrCreate = async (key: string) => {
  return request.get<QrCreateResponse>('/login/qr/create', {
    params: { key, qrimg: true, timestamp: Date.now() },
  });
};
// 检查二维码登录状态接口
export const checkQr = async (key: string) => {
  return request.get<QrCheckResponse>('/login/qr/check', {
    params: { key, timestamp: Date.now() },
  });
};

// Status & Logout
export const getLoginStatus = async () => {
  return request.get('/login/status', {
    params: { timestamp: Date.now() },
  });
};

export const logout = async () => {
  return request.get('/logout');
};
