import request from '@/utils/request'

const posters = import.meta.glob('../../../file/img/*', { eager: true, query: '?url', import: 'default' })
export const posterFor = (movie) => {
  const name = movie.img || movie.posterUrl || `${movie.name || movie.title}.jpg`
  if (/^https?:\/\//.test(name)) return name
  const local = Object.entries(posters).find(([path]) => path.endsWith(`/${name}`))
  return local?.[1] || `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090'}/file/preview/${encodeURIComponent(name)}`
}

export function normalizeMovie(movie) {
  return { ...movie, name: movie.name || movie.title, img: movie.img || movie.posterUrl, introduction: movie.introduction || movie.description || movie.synopsis, startTime: movie.startTime || movie.releaseDate, score: Number(movie.score || movie.rating || 0), count: Number(movie.count || 0) }
}

export async function fetchMovies() {
  const data = await request.get('/movie/list', { params: { current: 1, size: 100 } })
  return (Array.isArray(data) ? data : data?.records || []).map(normalizeMovie)
}

export async function fetchMovie(id) {
  return normalizeMovie(await request.get(`/movie/${id}`))
}

export async function fetchStatus() {
  return { open: true }
}



