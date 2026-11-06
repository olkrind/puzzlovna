import generated from './generated/albums.json'

export interface ImageSize {
  src: string
  width: number
  height: number
}

export interface PhotoEntry {
  name: string
  width: number
  height: number
  srcSet: ImageSize[]
}

export interface Album {
  slug: string
  title: string
  date: string
  cover: string | null
  /** обложка из отдельного файла, которого нет среди фото альбома */
  coverPhoto?: PhotoEntry
  /** промежуток между фото в сетке, px; по умолчанию 2 */
  spacing?: number
  photos: PhotoEntry[]
}

// Фото отдаёт воркер проекта tcp: photos/<альбом>/<файл> → <PHOTOS_URL>/<альбом>/<файл>.
const PHOTOS_URL = 'https://tcp.olkrind.workers.dev'
const photoUrl = (src: string) => src.replace(/^photos\//, `${PHOTOS_URL}/`)
const withPhotoUrls = (p: PhotoEntry): PhotoEntry => ({
  ...p,
  srcSet: p.srcSet.map((s) => ({ ...s, src: photoUrl(s.src) })),
})

export const albums: Album[] = (generated as Album[]).map((album) => ({
  ...album,
  coverPhoto: album.coverPhoto && withPhotoUrls(album.coverPhoto),
  photos: album.photos.map(withPhotoUrls),
}))

export const coverOf = (album: Album) =>
  album.coverPhoto ?? album.photos.find((p) => p.name === album.cover) ?? album.photos[0]

// ДД.ММ.ГГГГ независимо от языка браузера.
export const formatDate = (iso: string) => iso.split('-').reverse().join('.')

// Ближайший размер не меньше нужной ширины.
export const pickSize = (photo: PhotoEntry, minWidth: number) =>
  photo.srcSet.find((s) => s.width >= minWidth) ?? photo.srcSet[photo.srcSet.length - 1]
