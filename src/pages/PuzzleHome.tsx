import { AlbumCard } from '../components/AlbumCard.tsx'
import { PuzzleSeams } from '../components/PuzzleSeams.tsx'
import { albums, coverOf, formatDate } from '../data.ts'
import { useNoSelect } from '../useNoSelect.ts'

export function PuzzleHome() {
  useNoSelect()

  return (
    <>
      <header className="home-header">
        <PuzzleSeams />
        <h1>Puzzlovna</h1>
        <p>Choose an album</p>
      </header>

      <main className="album-list">
        {albums.map((album) => (
          <AlbumCard
            key={album.slug}
            to={`/${album.slug}/`}
            cover={coverOf(album)}
            date={formatDate(album.date)}
            title={album.title}
            count={`${album.photos.length} ${album.photos.length === 1 ? 'photo' : 'photos'}`}
          />
        ))}
      </main>
    </>
  )
}
