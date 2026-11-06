// Копирует список альбомов из соседнего проекта tcp: только альбомы со скачиванием, без видео.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const source = process.argv[2] ?? path.join(root, '..', 'tcp', 'src', 'generated', 'albums.json')

const albums = JSON.parse(await readFile(source, 'utf8'))
  .filter((album) => album.downloadable !== false)
  .map(({ slug, title, date, cover, coverPhoto, spacing, photos }) => ({
    slug,
    title,
    date,
    cover,
    coverPhoto,
    spacing,
    photos: photos.filter((photo) => !photo.video),
  }))
  .filter((album) => album.photos.length > 0)

await writeFile(path.join(root, 'src', 'generated', 'albums.json'), `${JSON.stringify(albums, null, 2)}\n`)
console.log(`Альбомов: ${albums.length}, фото: ${albums.reduce((sum, album) => sum + album.photos.length, 0)}`)
