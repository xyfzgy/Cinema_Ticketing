<script setup>
import { ref } from 'vue'
import { posterFor } from '@/api/discovery'
defineProps({ movie: { type: Object, required: true } })
const broken = ref(false)
</script>

<template>
  <button class="poster-card" type="button" @click="$emit('select', movie)">
    <div class="poster-frame">
      <img v-if="!broken" :src="posterFor(movie)" :alt="movie.name" @error="broken = true" />
      <span v-else class="poster-fallback">{{ movie.name }}</span>
      <span class="score-chip">★ {{ movie.score ? movie.score.toFixed(1) : '暂无评分' }}</span>
    </div>
    <div class="poster-info"><strong>{{ movie.name }}</strong><span>{{ movie.type || '类型待更新' }}</span><small>{{ (movie.count || 0).toLocaleString() }} 次播放</small></div>
  </button>
</template>

<style scoped>
.poster-card{display:block;width:100%;padding:0;text-align:left;border:0;border-radius:8px;background:#fff;overflow:hidden;box-shadow:0 8px 24px #26315b16;cursor:pointer;transition:transform .2s,box-shadow .2s}.poster-card:hover{transform:translateY(-5px);box-shadow:0 14px 30px #26315b30}.poster-card:active{transform:translateY(-1px)}.poster-frame{position:relative;aspect-ratio:2/3;background:#d9d6ea}.poster-frame img{width:100%;height:100%;object-fit:cover}.poster-fallback{display:grid;place-items:center;height:100%;padding:20px;text-align:center;font-size:23px;font-weight:700;color:#544c78}.score-chip{position:absolute;right:9px;bottom:9px;border-radius:5px;background:#20213ddd;color:#ffd93d;padding:5px 8px;font-weight:700;font-size:12px}.poster-info{display:grid;gap:6px;padding:13px 14px 16px}.poster-info strong{font-size:16px;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.poster-info span,.poster-info small{color:#666;font-size:13px}
</style>


