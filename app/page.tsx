import { BannerItem, getBanner, getPersonalized } from "@/services/home";
import { Playlist } from "@/types/music";
import Image from "next/image";

import Link from "next/link";

export default async function Home() {
  const [banners, playlists] = await Promise.all([
    getBanner(),
    getPersonalized(10)
  ]);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Banners */}
      <section className="mb-10">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {banners.map((banner, index) => (
            <div 
              key={index} 
              className="relative flex-shrink-0 w-[540px] h-[200px] rounded-xl overflow-hidden shadow-lg bg-zinc-100 dark:bg-zinc-800"
            >
              {banner.imageUrl ? (
                <Image 
                  src={banner.imageUrl} 
                  alt={banner.typeTitle} 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority={index < 2}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  No Image
                </div>
              )}
              <div className="absolute bottom-0 right-0 px-2 py-1 bg-blue-600 text-white text-xs rounded-tl-lg">
                {banner.typeTitle}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Playlists */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100">推荐歌单</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {playlists.map((list) => (
            <Link href={`/playlist/${list.id}`} key={list.id} className="group cursor-pointer">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-3 shadow-md">
                {list.picUrl || list.coverImgUrl ? (
                  <Image 
                    src={list.picUrl || list.coverImgUrl || ''} 
                    alt={list.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs flex items-center">
                  <span>▶ {Math.floor(list.playCount / 10000)}万</span>
                </div>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium line-clamp-2 leading-relaxed group-hover:text-black dark:group-hover:text-white transition-colors">
                {list.name}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
