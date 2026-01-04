
import { getPlaylistTracks } from '@/services/playlist';
import PlaylistSongs from './components/PlaylistSongs';
import { notFound } from 'next/navigation';
import { Song } from '@/types/music';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaylistPage({ params }: PageProps) {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const songs: Song[] = await getPlaylistTracks(id, 100, 0);
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <PlaylistSongs songs={songs} playlistId={id} />
    </div>
  );
}
