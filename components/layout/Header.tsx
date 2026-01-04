'use client';

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import logo from "@/app/favicon.ico";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import LoginModal from "@/components/auth/LoginModal";

const Header = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const { profile, logout } = useUserStore();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#242424] text-white flex items-center justify-between px-6 border-b border-[#000]">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
              <Image src={logo} alt="冈易云音乐" className="w-8 h-8 rounded-full" />
            冈易云音乐
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link href="/" className="hover:text-white hover:bg-black/20 px-4 py-2 rounded-md transition">发现音乐</Link>
            <Link href="/my" className="hover:text-white hover:bg-black/20 px-4 py-2 rounded-md transition">我的音乐</Link>
            <Link href="/friend" className="hover:text-white hover:bg-black/20 px-4 py-2 rounded-md transition">关注</Link>
            <Link href="/store" className="hover:text-white hover:bg-black/20 px-4 py-2 rounded-md transition">商城</Link>
            <Link href="/musician" className="hover:text-white hover:bg-black/20 px-4 py-2 rounded-md transition">音乐人</Link>
            <Link href="/download" className="hover:text-white hover:bg-black/20 px-4 py-2 rounded-md transition">下载客户端</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="音乐/视频/电台/用户" 
              className="pl-8 w-64 h-9 bg-white text-black border-none rounded-full text-xs focus-visible:ring-0" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          {profile ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img src={profile.avatarUrl} alt={profile.nickname} className="w-8 h-8 rounded-full" />
              <span className="text-xs text-gray-300 group-hover:text-white">{profile.nickname}</span>
              <div className="absolute top-full right-0 mt-2 w-32 bg-[#2b2b2b] rounded shadow-xl py-2 hidden group-hover:block">
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-[#353535] text-gray-200">退出登录</button>
              </div>
            </div>
          ) : (
            <button 
              className="text-xs text-gray-300 hover:text-white"
              onClick={() => setShowLogin(true)}
            >
              登录
            </button>
          )}
        </div>
      </header>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </>
  );
};


export default Header;
