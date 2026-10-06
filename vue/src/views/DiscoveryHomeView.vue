<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchMovies, fetchStatus } from '@/api/discovery'
import MoviePosterCard from '@/components/MoviePosterCard.vue'
import ContentState from '@/components/ContentState.vue'
import { isAdmin } from '@/utils/auth'
const router = useRouter()
const movies = ref([]), loading = ref(true), open = ref(true), query = ref('')
const visible = computed(() => movies.value.filter((movie) => movie.name.includes(query.value)).slice(0, 5))
onMounted(async () => {
  try { movies.value = await fetchMovies() } catch { movies.value = [] } finally { loading.value = false }
  try { const result = await fetchStatus(); open.value = result?.open ?? result?.status !== 'CLOSED' } catch { open.value = true }
})
function go(path) { router.push(path === '/personal' && isAdmin() ? '/adminPersonal' : path) }
</script>
<template>
  <main class="discovery-home">
    <div class="home-inner">
      <header class="home-heading"><div><span class="eyebrow">CINEMA · DISCOVER</span><h1>影视推荐平台 <span class="business-tag" :class="{ closed: !open }">{{ open ? '营业中' : '已打烊' }}</span></h1><p>下一场好电影，从这里开始。</p></div><button class="outline-light" @click="go('/screenings')">浏览场次 →</button></header>
      <section class="home-panel movies-panel"><div class="section-heading"><div><span class="eyebrow purple">NOW SHOWING</span><h2>热门电影 / 电视剧推荐</h2></div><el-input v-model="query" clearable placeholder="搜索电影名称" class="movie-search" /></div><ContentState :loading="loading" :empty="!loading && !visible.length" label="暂无符合条件的影片" /><div v-if="!loading && visible.length" class="movie-grid"><MoviePosterCard v-for="movie in visible" :key="movie.id" :movie="movie" @select="go(`/movieDetail?id=${movie.id}&name=${encodeURIComponent(movie.name)}`)" /></div></section>
    </div>
  </main>
</template>
<style scoped>
.discovery-home{min-height:calc(100vh - 60px);background:linear-gradient(135deg,#667eea 0%,#764ba2 56%,#87ceeb 100%);padding:52px 20px 70px}.home-inner{max-width:1200px;margin:auto}.home-heading{display:flex;justify-content:space-between;align-items:end;color:white;margin-bottom:32px;gap:20px}.home-heading h1{font-size:38px;margin:12px 0}.home-heading p{opacity:.9;margin:0}.eyebrow{font-size:12px;font-weight:800;letter-spacing:1px;opacity:.8}.eyebrow.purple{color:#667eea}.business-tag{display:inline-block;vertical-align:middle;font-size:13px;background:#52c41a;padding:7px 10px;border-radius:5px}.business-tag.closed{background:#747587}.outline-light{background:#ffffff25;border:1px solid #ffffffa0;border-radius:6px;padding:11px 17px;color:white;cursor:pointer}.outline-light:hover{background:#ffffff40}.home-panel{background:#fff;border-radius:12px;padding:27px 30px;margin-bottom:22px;box-shadow:0 12px 36px #2e2c5926}.section-heading{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px}.section-heading h2{font-size:21px;margin:3px 0}.section-heading span{color:#999;font-size:13px}.entry-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}.entry{position:relative;display:flex;flex-direction:column;align-items:start;gap:8px;text-align:left;border:1px solid #efedf8;background:#faf9fe;border-radius:8px;padding:20px;cursor:pointer;transition:.2s}.entry:hover{transform:translateY(-3px);box-shadow:0 8px 22px #667eea22;border-color:#c4b6ee}.entry:active{transform:translateY(0)}.entry-icon{display:grid;place-items:center;width:38px;height:38px;border-radius:7px;background:#e9e5fa;color:#674aba;font-size:20px}.entry strong{color:#333}.entry small{color:#999}.entry-arrow{position:absolute;right:18px;top:18px;color:#9a8bc7}.movie-search{max-width:250px}.movie-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:18px}.demo-note{color:#777;font-size:13px;margin:0 0 18px}@media(max-width:900px){.movie-grid{grid-template-columns:repeat(3,1fr)}.entry-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.discovery-home{padding:30px 14px}.home-heading{align-items:start}.home-heading h1{font-size:26px}.outline-light{display:none}.home-panel{padding:20px 16px}.movie-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.section-heading{align-items:start;flex-direction:column}.movie-search{max-width:none;width:100%}.entry{padding:15px}.entry small{display:none}}
</style>



