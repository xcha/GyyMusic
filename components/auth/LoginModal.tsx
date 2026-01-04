'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Smartphone, QrCode } from 'lucide-react';
import Image from 'next/image';
import { loginCellPhone, loginCellPhoneWithCaptcha, sendCaptcha, getQrKey, getQrCreate, checkQr,getLoginStatus } from '@/services/auth';
import { useUserStore } from '@/store/useUserStore';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'qr' | 'phone'>('qr');
  const [isCaptchaLogin, setIsCaptchaLogin] = useState(false);
  
  const [qrImg, setQrImg] = useState('');
  const [qrStatus, setQrStatus] = useState('');
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [countdown, setCountdown] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const { login } = useUserStore();

  // Reset state when opening
  useEffect(() => {
    if (open) {
       if (activeTab === 'qr') {
          initQrCode();
       }
    } else {
      clearTimer();
      clearCountdown();
    }
    return () => {
      clearTimer();
      clearCountdown();
    };
  }, [open, activeTab]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const clearCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }
  
  const startCountdown = () => {
    setCountdown(60);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearCountdown();
          return 0;
        }
        return prev - 1;
      });
    }, 20000);
  };
  
  const handleSendCaptcha = async () => {
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }
    setError('');
    try {
      await sendCaptcha(phone);
      startCountdown();
    } catch (e: any) {
      setError(e.response?.msg || '发送验证码失败');
    }
  };

  const initQrCode = async () => {
    try {
      setQrStatus('加载中...');
      // Types were updated in service but here we access direct data
      // Wait, request.ts returns response.data
      // Let's check service definition again.
      // service/auth.ts: 
      // getQrKey returns request.get<QrKeyResponse>('/login/qr/key')
      // request.ts returns response.data directly.
      // QrKeyResponse is { data: { unikey: string } }
      // So existing code `keyRes.data.data.unikey` in previous read was correct if request.ts returns full response
      // BUT request.ts returns `response.data`.
      // So if backend returns { data: { unikey: ... }, code: 200 }
      // Then `keyRes` is that object.
      // So keyRes.data.unikey is correct.
      
      const keyRes = await getQrKey();
      // The API structure for /login/qr/key is usually { data: { unikey: '...' }, code: 200 }
      // So keyRes.data.unikey
      const key = keyRes.data.unikey;
      
      const imgRes = await getQrCreate(key);
      setQrImg(imgRes.data.qrimg);
      setQrStatus('请使用网易云音乐APP扫码登录');

      clearTimer();
      timerRef.current = setInterval(async () => {
        try {
          const checkRes = await checkQr(key);
          const code = checkRes.code;
          
          if (code === 800) {
            setQrStatus('二维码已过期');
            clearTimer();
          } else if (code === 803) {
             clearTimer();
             handleLoginSuccess(checkRes.cookie);
          } else if (code === 802) {
            setQrStatus('扫描成功，请在手机上确认');
          }
        } catch (e) {
          console.error(e);
        }
      }, 5000);

    } catch (e) {
      setQrStatus('加载二维码失败');
      console.error(e);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let res;
      if (isCaptchaLogin) {
         if (!captcha) {
           setError('请输入验证码');
           setLoading(false);
           return;
         }
         res = await loginCellPhoneWithCaptcha(phone, captcha);
      } else {
         if (!password) {
           setError('请输入密码');
           setLoading(false);
           return;
         }
         res = await loginCellPhone(phone, password);
      }
      
      if (res.code === 200) {
        handleLoginSuccess(res.cookie, res.profile);
      } else {
        setError('登录失败，请检查输入信息');
      }
    } catch (e: any) {
      setError(e.response?.data?.msg || e.message || '登录发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (cookie: string, profile?: any) => {
    document.cookie = `MUSIC_U=${encodeURIComponent(cookie)}; path=/`;
    let finalProfile = profile;
    if (!finalProfile) {
      try {
        const statusRes: any = await getLoginStatus();
        finalProfile = statusRes?.data?.profile ?? statusRes?.profile ?? null;
      } catch {}
    }
    if (finalProfile) {
      login(finalProfile, cookie);
      setSuccess(`登录成功，欢迎 ${finalProfile.nickname}`);
      setTimeout(() => {
        setSuccess('');
        onOpenChange(false);
      }, 1200);
    } else {
      setSuccess('登录成功');
      setTimeout(() => {
        setSuccess('');
        onOpenChange(false);
      }, 1200);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[350px] bg-white rounded-lg shadow-2xl overflow-hidden">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex bg-gray-50 border-b">
          <button 
            className={`flex-1 py-4 text-sm font-medium ${activeTab === 'qr' ? 'text-black border-b-2 border-red-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('qr')}
          >
            扫码登录
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-medium ${activeTab === 'phone' ? 'text-black border-b-2 border-red-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('phone')}
          >
            手机号登录
          </button>
        </div>

        <div className="p-8 min-h-[300px] flex flex-col items-center justify-center">
          {success && (
            <div className="mb-3 w-full text-center text-green-600 text-sm">
              {success}
            </div>
          )}
          {activeTab === 'qr' ? (
            <div className="flex flex-col items-center">
              {qrImg ? (
                <div className="relative group">
                  <Image src={qrImg} alt="QR Code" width={180} height={180} />
                  {qrStatus === '二维码已过期' && (
                    <div 
                      className="absolute inset-0 bg-white/90 flex items-center justify-center cursor-pointer"
                      onClick={initQrCode}
                    >
                      <span className="text-sm font-medium text-red-600">点击刷新</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-[180px] h-[180px] bg-gray-100 animate-pulse rounded" />
              )}
              <p className="mt-4 text-sm text-gray-600 text-center">{qrStatus}</p>
            </div>
          ) : (
            <form onSubmit={handlePhoneLogin} className="w-full space-y-4">
              <div className="flex justify-center mb-4 border-b">
                 <button
                   type="button"
                   className={`pb-2 px-4 text-sm ${!isCaptchaLogin ? 'border-b-2 border-red-600 font-bold' : 'text-gray-500'}`}
                   onClick={() => setIsCaptchaLogin(false)}
                 >
                   密码登录
                 </button>
                 <button
                   type="button"
                   className={`pb-2 px-4 text-sm ${isCaptchaLogin ? 'border-b-2 border-red-600 font-bold' : 'text-gray-500'}`}
                   onClick={() => setIsCaptchaLogin(true)}
                 >
                   验证码登录
                 </button>
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="请输入手机号"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-red-500 text-sm"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              
              {isCaptchaLogin ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="请输入验证码"
                    className="flex-1 px-4 py-2 border rounded focus:outline-none focus:border-red-500 text-sm"
                    value={captcha}
                    onChange={e => setCaptcha(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 disabled:opacity-50 w-24"
                    onClick={handleSendCaptcha}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </button>
                </div>
              ) : (
                <div>
                  <input 
                    type="password" 
                    placeholder="请输入密码"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-red-500 text-sm"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              )}
              
              {error && <div className="text-xs text-red-500">{error}</div>}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
